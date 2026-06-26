// ========================================
// 求职伴侣 — 简历分析模块
// JD关键词提取 + API深度分析
// ========================================

class ResumeAnalyzer {
    constructor(config) {
        this.config = config;
    }

    /**
     * 前端关键词提取：从JD中识别关键要求
     */
    extractJDKeywords(jdText) {
        const keywordMap = {
            '沟通能力': ['沟通', '表达', '协调', '对接', '谈判', '交流'],
            '数据分析': ['数据', '分析', 'Excel', 'SQL', '统计', '报表'],
            '团队协作': ['团队', '协作', '合作', '配合', '跨部门'],
            '抗压能力': ['抗压', '压力', '快节奏', ' deadline', '多任务', '并行'],
            '学习能力': ['学习', '快速', '自驱', '主动', '探索'],
            '执行能力': ['执行', '推动', '落地', '完成', '交付'],
            '逻辑思维': ['逻辑', '思维', '结构化', '条理', '框架'],
            '用户导向': ['用户', '客户', '需求', '体验', '服务'],
            '项目管理': ['项目', '进度', '计划', '统筹', '管理'],
            '英语能力': ['英语', '英文', 'CET', '四级', '六级', '托福', '雅思'],
            '文案能力': ['文案', '写作', '内容', '编辑', '文字'],
            '运营能力': ['运营', '活动', '策划', '推广', '增长'],
            '产品思维': ['产品', '迭代', '需求', '功能', '优化'],
        };

        const found = [];
        for (const [keyword, patterns] of Object.entries(keywordMap)) {
            if (patterns.some(p => jdText.toLowerCase().includes(p.toLowerCase()))) {
                found.push(keyword);
            }
        }

        return found;
    }

    /**
     * 前端简历检查：简历中缺少了哪些JD提到的关键词
     */
    checkResumeGaps(jdKeywords, resumeText) {
        const missing = [];
        for (const kw of jdKeywords) {
            const patterns = this.getKeywordPatterns(kw);
            if (!patterns.some(p => resumeText.toLowerCase().includes(p.toLowerCase()))) {
                missing.push({
                    keyword: kw,
                    suggestion: this.getGapSuggestion(kw)
                });
            }
        }
        return missing;
    }

    /**
     * 获取关键词对应的搜索模式
     */
    getKeywordPatterns(keyword) {
        const map = {
            '沟通能力': ['沟通', '表达', '协调', '对接', '谈判'],
            '数据分析': ['数据', '分析', 'Excel', 'SQL', '统计'],
            '团队协作': ['团队', '协作', '合作', '配合'],
            '抗压能力': ['抗压', '压力', '快节奏'],
            '学习能力': ['学习', '快速', '自驱'],
            '执行能力': ['执行', '推动', '落地'],
            '逻辑思维': ['逻辑', '思维', '结构化'],
            '用户导向': ['用户', '客户', '需求'],
            '项目管理': ['项目', '进度', '计划'],
            '英语能力': ['英语', '英文', 'CET', '四级', '六级'],
            '文案能力': ['文案', '写作', '内容'],
            '运营能力': ['运营', '活动', '策划'],
            '产品思维': ['产品', '迭代', '需求']
        };
        return map[keyword] || [keyword];
    }

    /**
     * 获取针对缺失关键词的改写建议
     */
    getGapSuggestion(keyword) {
        const suggestions = {
            '沟通能力': '如果你做过任何需要跟人打交道的事——社团外联、活动组织、兼职销售、甚至小组作业答辩——都可以写进来。重点写"跟谁沟通、达成什么结果"。',
            '数据分析': '如果你用过Excel做统计、做过问卷分析、或者写论文时处理过数据，都可以体现。没有经验的话可以写"正在学习Excel/数据分析"。',
            '团队协作': '几乎所有大学生都有团队协作经历——小组作业、社团活动、班级事务都算。写的时候突出"你在团队里扮演什么角色"。',
            '抗压能力': '如果你有同时处理多件事的经历（比如边上课边实习）、或者经历过困难的挑战（比如某次考试/比赛前的准备），可以写进来。',
            '学习能力': '如果你自学过任何技能（PS、剪辑、编程、公众号排版等），都可以体现你的学习能力。重点是"自己主动学了什么"。',
            '执行能力': '把你做过的任何事用"做了什么+取得什么结果"的格式写。比如"组织班级秋游，协调30人出行，零事故"比"负责班级活动"有说服力得多。',
            '逻辑思维': '如果你的简历结构清晰、分点陈述、每段经历都用了STAR法则（情境-任务-行动-结果），这本身就展示了逻辑思维。',
            '用户导向': '如果你做过任何服务他人的事——志愿者、客服兼职、帮同学解答问题——都可以呼应这个关键词。',
            '项目管理': '如果你统筹过任何从开始到结束的事（社团活动、比赛、项目作业），用"计划-执行-交付"的框架来描述。',
            '英语能力': '如果四级没过，可以写"具备基础英语阅读能力，正在备考四级"。如果过了，把分数写上（如果分数好看的话）。',
            '文案能力': '如果你写过公众号、小红书、社团宣传文案、甚至朋友圈长文被很多人转发过，都可以算文案能力。',
            '运营能力': '如果你运营过任何账号（社团公众号、个人小红书、B站等），或者策划过线上/线下活动，都可以体现。',
            '产品思维': '如果你做过用户调研、竞品分析、或者参与过任何"发现问题→提出方案→落地"的流程，都是产品思维的体现。'
        };
        return suggestions[keyword] || '尝试在你的经历中寻找跟这个关键词相关的部分，用具体的事例来体现。';
    }

    /**
     * 调用API进行深度简历分析
     */
    async deepAnalyze(jdText, resumeText, jdKeywords, gaps) {
        const prompt = `你是一个简历优化专家。请分析以下JD和简历，给出优化建议。

【JD原文】
${jdText}

【简历原文】
${resumeText}

【前端已识别的问题】
JD关键词：${jdKeywords.join('、')}
简历缺少的关键词：${gaps.map(g => g.keyword).join('、')}

请以JSON格式返回分析结果：
{
    "jdSummary": "用3-5句话总结这个JD的核心要求（说人话，不要术语）",
    "coreRequirements": ["JD最看重的3个核心要求"],
    "resumeIssues": ["简历存在的主要问题，每条20字以内"],
    "specificAdvice": ["具体的优化建议，每条要可执行"],
    "optimizedVersion": "基于原简历的优化版本（保留原经历，优化表述方式）"
}

优化原则：
1. 不编造经历，只优化表述
2. 把"做了什么"改成"做成了什么"
3. 用数字量化成果
4. 语言要具体，不要空洞形容词
5. 用STAR法则组织每段经历
6. 针对JD的核心要求，把相关经历放到前面

只返回JSON，不要其他内容。`;

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
                        { role: 'user', content: prompt }
                    ],
                    max_tokens: 4096,
                    temperature: 0.5
                }),
                signal: AbortSignal.timeout(this.config.timeout)
            });

            if (!response.ok) {
                throw new Error(`API请求失败: ${response.status}`);
            }

            const data = await response.json();
            const content = data.choices[0].message.content;
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
            throw new Error('无法解析API返回的JSON');
        } catch (error) {
            console.error('简历分析API错误:', error);
            // 返回降级结果
            return this.getFallbackAnalysis(jdKeywords, gaps);
        }
    }

    /**
     * API调用失败时的降级分析
     */
    getFallbackAnalysis(jdKeywords, gaps) {
        return {
            jdSummary: `这个岗位看重：${jdKeywords.join('、')}。`,
            coreRequirements: jdKeywords.slice(0, 3),
            resumeIssues: gaps.map(g => `缺少"${g.keyword}"的体现`),
            specificAdvice: gaps.map(g => g.suggestion),
            optimizedVersion: null
        };
    }

    /**
     * 完整的简历分析流程
     */
    async analyze(jdText, resumeText) {
        // 第1步：前端提取JD关键词
        const jdKeywords = this.extractJDKeywords(jdText);

        // 第2步：检查简历差距
        const gaps = this.checkResumeGaps(jdKeywords, resumeText);

        // 第3步：调用API深度分析
        const analysis = await this.deepAnalyze(jdText, resumeText, jdKeywords, gaps);

        return {
            jdKeywords,
            gaps,
            ...analysis
        };
    }
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ResumeAnalyzer;
}
