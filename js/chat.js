// ========================================
// 求职伴侣 — 对话模块
// 调用讯飞星辰 API 进行岗位匹配对话
// ========================================

class CareerChat {
    constructor(config) {
        this.config = config;
        this.messages = [];
        this.round = 0;
        this.maxRounds = 5;  // 最多聊5轮
        this.userProfile = {}; // 从对话中提取的用户信息
        this.onNewMessage = null;  // 收到新消息的回调
        this.onComplete = null;    // 对话完成的回调
    }

    /**
     * 系统提示词：设定AI的行为
     */
    getSystemPrompt() {
        return `你是一个求职顾问，你的名字叫"求职伴侣"，由2026年刚毕业的大学生M Lu创建。

你的任务是跟一个迷茫的应届大学毕业生聊天，了解他的经历、能力和偏好，帮他找到适合的岗位方向。

聊天规则：
1. 用口语化的中文聊天，像朋友一样，不要用书面语
2. 每次只问一个问题，不要连续问很多
3. 先问最有成就感的事 → 再问偏好 → 最后问约束条件
4. 对方如果说不清楚，换个角度问，不要逼问
5. 3-5轮对话后，如果你觉得已经了解了足够的信息，在回复末尾加上 [CHAT_COMPLETE]
6. 不要评价对方（不说"你的经历很普通"之类的话），保持鼓励和理解的态度
7. 不要说"根据我的分析"、"基于你的回答"这种AI腔

你应该了解的信息：
- 对方做过什么（实习、社团、项目、任何有成就感的事）
- 对方擅长什么、不擅长什么
- 喜欢的工作方式（跟人/跟数据/跟事物）
- 对工作的期待（稳定/挑战、成长空间、薪资等）
- 硬性约束（城市、能不能出差等）

开场白模板（只用于第1轮）：
"嗨，先随便聊聊。不用紧张，这不是考试，也没有标准答案。大学这几年，有没有一件事——不管大事小事——做完之后你心里想的是'这事儿我干得还不错'？想到了就说，想不出来也没关系，我们换个角度聊。"`;
    }

    /**
     * 构建发给API的消息列表
     */
    buildMessages(userInput) {
        // 第一轮：用系统提示词 + 开场白
        if (this.round === 0) {
            return [
                { role: 'system', content: this.getSystemPrompt() },
                { role: 'user', content: '你好，我想了解一下自己适合做什么工作。' }
            ];
        }

        // 后续轮次：发送完整对话历史
        return [
            { role: 'system', content: this.getSystemPrompt() },
            ...this.messages
        ];
    }

    /**
     * 调用讯飞星辰 API
     */
    async callAPI(messages) {
        const url = `${this.config.baseURL}/chat/completions`;

        const body = {
            model: this.config.model,
            messages: messages,
            max_tokens: this.config.maxTokens,
            temperature: this.config.temperature
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.config.apiKey}`
            },
            body: JSON.stringify(body),
            signal: AbortSignal.timeout(this.config.timeout)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API请求失败: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    }

    /**
     * 发送用户消息，获取AI回复
     * @param {string} userInput - 用户输入的内容
     * @returns {string} AI的回复
     */
    async sendMessage(userInput) {
        // 把用户消息加入历史
        this.messages.push({ role: 'user', content: userInput });
        this.round++;

        // 构建请求消息
        const requestMessages = this.buildMessages(userInput);

        try {
            // 调用API
            const reply = await this.callAPI(requestMessages);

            // 检查是否对话完成
            const isComplete = reply.includes('[CHAT_COMPLETE]');
            const cleanReply = reply.replace('[CHAT_COMPLETE]', '').trim();

            // 把AI回复加入历史
            this.messages.push({ role: 'assistant', content: cleanReply });

            // 触发回调
            if (this.onNewMessage) {
                this.onNewMessage(cleanReply, isComplete, this.round);
            }

            // 如果完成，提取用户画像
            if (isComplete || this.round >= this.maxRounds) {
                await this.extractProfile();
                if (this.onComplete) {
                    this.onComplete(this.userProfile);
                }
            }

            return { reply: cleanReply, isComplete: isComplete || this.round >= this.maxRounds, round: this.round };
        } catch (error) {
            console.error('对话API错误:', error);
            throw error;
        }
    }

    /**
     * 对话结束后，调用API提取用户画像
     */
    async extractProfile() {
        const extractionPrompt = {
            role: 'system',
            content: `根据以上对话内容，提取用户的关键信息，以JSON格式返回：
{
    "achievements": "用户最有成就感的事情（简述）",
    "strengths": ["能力1", "能力2", "能力3"],
    "weaknesses": ["不擅长1"],
    "workStyle": "跟人打交道/跟数据打交道/跟事物打交道/综合",
    "preference": "稳定型/挑战型/不确定",
    "cities": ["目标城市"],
    "salary": "薪资期望",
    "keywords": ["关键词1", "关键词2"]
}
只返回JSON，不要其他内容。`
        };

        try {
            const response = await fetch(`${this.config.baseURL}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.config.apiKey}`
                },
                body: JSON.stringify({
                    model: this.config.model,
                    messages: [
                        ...this.messages,
                        extractionPrompt
                    ],
                    max_tokens: 1024,
                    temperature: 0.3
                }),
                signal: AbortSignal.timeout(this.config.timeout)
            });

            if (!response.ok) return;

            const data = await response.json();
            const content = data.choices[0].message.content;
            // 尝试解析JSON
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                this.userProfile = JSON.parse(jsonMatch[0]);
            }
        } catch (error) {
            console.error('提取用户画像失败:', error);
            // 不阻塞流程，即使提取失败也继续
        }
    }

    /**
     * 重置对话
     */
    reset() {
        this.messages = [];
        this.round = 0;
        this.userProfile = {};
    }
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CareerChat;
}
