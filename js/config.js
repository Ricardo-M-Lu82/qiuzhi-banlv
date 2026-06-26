// ========================================
// 求职伴侣 — API 配置
// 讯飞星辰 Coding Plan
// ========================================

const API_CONFIG = {
    // 讯飞星辰 Coding Plan 端点
    baseURL: 'https://maas-coding-api.cn-huabei-1.xf-yun.com/v2',
    apiKey: 'da90bf4b058c26b45851e34786dff94e:ZDQzYzcwMzVjNDAwYjk0M2VjY2M0YmVm',
    model: 'astron-code-latest',

    // 对话参数
    maxTokens: 2048,
    temperature: 0.7,

    // 请求超时（毫秒）
    timeout: 30000
};

// 导出（如果在模块环境中）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = API_CONFIG;
}
