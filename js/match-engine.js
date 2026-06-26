// ========================================
// 求职伴侣 — 岗位匹配引擎
// 基于用户画像 + 结构化数据 → 推荐岗位
// ========================================

class MatchEngine {
    constructor() {
        // 岗位库
        this.jobs = this.getJobDatabase();
    }

    /**
     * 岗位数据库
     * 每个岗位包含：名称、标签、匹配规则、详细介绍
     */
    getJobDatabase() {
        return [
            {
                id: 'b2b-sales',
                name: 'B2B 大客户销售',
                matchScore: 0,
                tags: ['沟通表达', '抗压能力', '跟人打交道', '挑战型', '自驱力'],
                workStyle: '跟人打交道',
                preference: '挑战型',
                description: '开发和维护企业客户，了解客户需求，提供解决方案，完成商务谈判和签约。不是简单的"卖东西"，而是帮客户解决他们的问题。',
                careerPath: [
                    '1-3年：客户经理，独立负责中小客户',
                    '3-5年：区域负责人，管理客户群和业绩目标',
                    '5-10年：销售总监 / 自己创业'
                ],
                searchKeywords: ['B2B销售', '大客户代表', '商务拓展', '客户经理'],
                salaryRange: '底薪6-10K + 提成，成熟后年薪20-50W+',
                suitableFor: '喜欢跟人打交道，不怕被拒绝，能从"搞定一件事"中获得成就感'
            },
            {
                id: 'customer-success',
                name: '客户成功经理',
                matchScore: 0,
                tags: ['沟通表达', '共情能力', '跟人打交道', '稳定型', '解决问题'],
                workStyle: '跟人打交道',
                preference: '稳定型',
                description: '维护已有客户关系，确保客户用好产品，续约和增购。不像销售那样需要大量开拓新客户，更侧重长期关系的维护和客户问题的解决。',
                careerPath: [
                    '1-2年：客户成功专员，服务中小客户',
                    '3-5年：客户成功经理，负责大客户群',
                    '5-8年：客户成功总监 / 转产品/运营'
                ],
                searchKeywords: ['客户成功', 'CSM', '客户运营', '客户经理'],
                salaryRange: '应届8-15K，3年后15-25K',
                suitableFor: '喜欢帮别人解决问题，有耐心，擅长长期关系维护'
            },
            {
                id: 'business-operations',
                name: '商务运营',
                matchScore: 0,
                tags: ['执行力', '细致', '跟数据打交道', '稳定型', '协调能力'],
                workStyle: '跟数据打交道',
                preference: '稳定型',
                description: '支持销售/商务团队的后端运营工作，包括合同管理、数据统计、流程优化、跨部门协调。是业务运转的"润滑剂"。',
                careerPath: [
                    '1-2年：运营专员，负责具体模块',
                    '3-5年：运营主管，管理流程和团队',
                    '5-8年：运营总监 / 转产品/项目管理'
                ],
                searchKeywords: ['商务运营', '业务运营', '销售运营', '运营专员'],
                salaryRange: '应届7-12K，3年后12-20K',
                suitableFor: '做事有条理，喜欢把流程理顺，不介意在后台支持团队'
            },
            {
                id: 'project-management',
                name: '项目管理',
                matchScore: 0,
                tags: ['组织协调', '沟通表达', '执行力', '挑战型', '逻辑分析'],
                workStyle: '综合',
                preference: '挑战型',
                description: '负责项目的整体推进：制定计划、协调资源、跟踪进度、管理风险。确保项目按时按质交付。',
                careerPath: [
                    '1-2年：项目助理/项目专员',
                    '3-5年：项目经理，独立负责中型项目',
                    '5-10年：高级项目经理 / PMO负责人'
                ],
                searchKeywords: ['项目管理', '项目专员', '项目助理', 'PM'],
                salaryRange: '应届7-12K，3年后15-25K',
                suitableFor: '喜欢"把一件事从头到尾做成"，擅长协调不同的人一起做事'
            },
            {
                id: 'hr-recruitment',
                name: 'HR / 招聘',
                matchScore: 0,
                tags: ['沟通表达', '共情能力', '跟人打交道', '稳定型', '细致'],
                workStyle: '跟人打交道',
                preference: '稳定型',
                description: '负责公司的人才招聘、员工关系或培训发展。核心是"帮公司找到对的人，帮人在公司里成长"。',
                careerPath: [
                    '1-2年：招聘专员/HR专员',
                    '3-5年：HR主管，负责独立模块',
                    '5-8年：HR经理 / HRBP'
                ],
                searchKeywords: ['HR', '招聘', '人力资源', '人事'],
                salaryRange: '应届6-10K，3年后12-20K',
                suitableFor: '对人敏感，喜欢帮别人找到合适的位置，有耐心'
            },
            {
                id: 'marketing',
                name: '市场营销',
                matchScore: 0,
                tags: ['创意', '沟通表达', '逻辑分析', '挑战型', '学习能力'],
                workStyle: '综合',
                preference: '挑战型',
                description: '负责品牌推广、内容创作、活动策划或用户增长。核心是"让更多人知道并喜欢我们的产品"。',
                careerPath: [
                    '1-2年：市场专员/新媒体运营',
                    '3-5年：市场主管/品牌经理',
                    '5-8年：市场总监'
                ],
                searchKeywords: ['市场营销', '品牌', '新媒体运营', '内容运营', '活动策划'],
                salaryRange: '应届6-10K，3年后12-22K',
                suitableFor: '有想法有创意，喜欢研究"怎么让人感兴趣"，不介意数据分析和内容创作都要做'
            },
            {
                id: 'product-assistant',
                name: '产品助理',
                matchScore: 0,
                tags: ['逻辑分析', '沟通表达', '学习能力', '挑战型', '细致'],
                workStyle: '综合',
                preference: '挑战型',
                description: '协助产品经理进行需求调研、竞品分析、文档撰写和项目跟进。是产品经理的入门岗位。',
                careerPath: [
                    '1-2年：产品助理',
                    '3-5年：产品经理',
                    '5-8年：高级产品经理 / 产品总监'
                ],
                searchKeywords: ['产品助理', '产品专员', '助理产品经理', 'APM'],
                salaryRange: '应届7-12K，3年后15-30K',
                suitableFor: '逻辑清晰，喜欢研究"为什么用户会这样用"，愿意从基础做起'
            },
            {
                id: 'data-analysis',
                name: '数据分析',
                matchScore: 0,
                tags: ['逻辑分析', '跟数据打交道', '学习能力', '稳定型', '细致'],
                workStyle: '跟数据打交道',
                preference: '稳定型',
                description: '收集和整理业务数据，通过分析发现问题和机会，为决策提供数据支持。需要学SQL和Excel，入门门槛比程序员低。',
                careerPath: [
                    '1-2年：数据分析师/数据专员',
                    '3-5年：高级数据分析师',
                    '5-8年：数据负责人 / 转数据科学'
                ],
                searchKeywords: ['数据分析', '数据分析师', '数据专员', 'BI'],
                salaryRange: '应届7-12K，3年后15-25K',
                suitableFor: '喜欢跟数字打交道，有耐心从数据里找规律，不介意学SQL和Excel'
            },
            {
                id: 'content-editor',
                name: '内容编辑 / 文案',
                matchScore: 0,
                tags: ['创意', '细致', '学习能力', '稳定型', '文字表达'],
                workStyle: '跟事物打交道',
                preference: '稳定型',
                description: '负责公众号、小红书、官网等渠道的内容创作和编辑。核心是"用文字打动人心"。',
                careerPath: [
                    '1-2年：内容编辑/文案',
                    '3-5年：内容主管/资深文案',
                    '5-8年：内容总监 / 自由职业'
                ],
                searchKeywords: ['内容编辑', '文案', '新媒体编辑', '内容运营'],
                salaryRange: '应届6-10K，3年后10-18K',
                suitableFor: '喜欢写字，能把复杂的事情说清楚，对文字有感觉'
            },
            {
                id: 'government-exam',
                name: '公务员 / 事业单位',
                matchScore: 0,
                tags: ['稳定型', '细致', '学习能力', '执行力'],
                workStyle: '综合',
                preference: '稳定型',
                description: '通过国考/省考/事业单位考试进入体制内。工作稳定，福利完善，但竞争激烈（报录比经常100:1以上）。',
                careerPath: [
                    '1-3年：科员',
                    '3-8年：副科/正科',
                    '8年+：副处及以上（取决于机遇和能力）'
                ],
                searchKeywords: ['公务员', '事业单位', '国考', '省考', '编制'],
                salaryRange: '因地区和岗位差异大，一般6-15K + 五险一金齐全',
                suitableFor: '追求稳定，不介意考试竞争激烈，愿意在体制内长期发展'
            }
        ];
    }

    /**
     * 根据用户画像和结构化数据计算匹配度
     * @param {Object} chatProfile - 对话中提取的用户画像
     * @param {Object} formData - 结构化确认的数据
     * @returns {Array} 排序后的岗位推荐列表
     */
    match(chatProfile = {}, formData = {}) {
        // 合并用户数据
        const userData = this.mergeUserData(chatProfile, formData);

        // 为每个岗位计算匹配度
        const results = this.jobs.map(job => {
            let score = 0;
            const reasons = [];

            // 1. 工作方式匹配（权重30%）
            if (userData.workStyle && job.workStyle === userData.workStyle) {
                score += 30;
                reasons.push(`你喜欢${userData.workStyle}`);
            } else if (job.workStyle === '综合') {
                score += 15;
            }

            // 2. 偏好匹配（权重25%）
            if (userData.preference && job.preference === userData.preference) {
                score += 25;
                reasons.push(`你偏好${userData.preference === '挑战型' ? '有挑战的工作' : '稳定可预期的工作'}`);
            }

            // 3. 能力标签匹配（权重30%）
            const userTags = this.extractUserTags(userData);
            const matchedTags = job.tags.filter(tag => userTags.includes(tag));
            const tagScore = (matchedTags.length / job.tags.length) * 30;
            score += tagScore;
            if (matchedTags.length > 0) {
                reasons.push(`你的能力跟这个岗位匹配度较高`);
            }

            // 4. 关键词匹配（权重15%）
            const userKeywords = userData.keywords || [];
            const matchedKeywords = job.tags.filter(tag =>
                userKeywords.some(kw => tag.includes(kw) || kw.includes(tag))
            );
            score += (matchedKeywords.length / Math.max(job.tags.length, 1)) * 15;

            return {
                ...job,
                matchScore: Math.min(Math.round(score), 98), // 最高98%，不给100%
                matchReasons: reasons
            };
        });

        // 按匹配度排序，取前5个
        return results
            .filter(job => job.matchScore >= 40) // 只推荐匹配度40%以上的
            .sort((a, b) => b.matchScore - a.matchScore)
            .slice(0, 5);
    }

    /**
     * 合并对话画像和表单数据
     */
    mergeUserData(chatProfile, formData) {
        return {
            workStyle: formData.workStyle || this.inferWorkStyle(chatProfile),
            preference: formData.preference || this.inferPreference(chatProfile),
            strengths: [
                ...(chatProfile.strengths || []),
                ...(formData.strengths || [])
            ],
            keywords: chatProfile.keywords || [],
            cities: formData.cities || chatProfile.cities || [],
            salary: formData.salary || chatProfile.salary || ''
        };
    }

    /**
     * 从用户画像推断工作方式偏好
     */
    inferWorkStyle(profile) {
        const text = JSON.stringify(profile).toLowerCase();
        if (text.includes('人') || text.includes('沟通') || text.includes('聊天') || text.includes('帮')) {
            return '跟人打交道';
        }
        if (text.includes('数据') || text.includes('分析') || text.includes('数字') || text.includes('整理')) {
            return '跟数据打交道';
        }
        if (text.includes('做') || text.includes('动手') || text.includes('写') || text.includes('创作')) {
            return '跟事物打交道';
        }
        return null;
    }

    /**
     * 从用户画像推断稳定/挑战偏好
     */
    inferPreference(profile) {
        const text = JSON.stringify(profile).toLowerCase();
        if (text.includes('挑战') || text.includes('成长') || text.includes('变化') || text.includes('快')) {
            return '挑战型';
        }
        if (text.includes('稳定') || text.includes('安稳') || text.includes('平衡')) {
            return '稳定型';
        }
        return null;
    }

    /**
     * 从用户数据中提取能力标签
     */
    extractUserTags(userData) {
        const tags = [];
        const allText = JSON.stringify(userData).toLowerCase();

        const tagMapping = {
            '沟通表达': ['沟通', '表达', '说', '聊', '讲', '交流', '谈'],
            '抗压能力': ['抗压', '压力', '坚持', '不放弃', '挺过来'],
            '共情能力': ['共情', '理解', '体谅', '帮', '照顾', '关心'],
            '逻辑分析': ['逻辑', '分析', '推理', '思考', '数学', '理'],
            '执行力': ['执行', '做', '完成', '落地', '组织', '办'],
            '创意': ['创意', '想法', '设计', '写', '创作', '新'],
            '细致': ['细致', '细心', '认真', '仔细', '检查', '整理'],
            '学习能力': ['学习', '自学', '学', '研究', '探索'],
            '自驱力': ['主动', '自己', '独立', '自发'],
            '组织协调': ['组织', '协调', '安排', '统筹', '策划']
        };

        for (const [tag, keywords] of Object.entries(tagMapping)) {
            if (keywords.some(kw => allText.includes(kw))) {
                tags.push(tag);
            }
        }

        return tags;
    }

    /**
     * 获取匹配度等级
     */
    getMatchLevel(score) {
        if (score >= 80) return 'high';
        if (score >= 60) return 'mid';
        return 'low';
    }
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MatchEngine;
}
