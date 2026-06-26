// ========================================
// 求职伴侣 — API 配置
// 讯飞星辰 Coding Plan
// ========================================

const API_CONFIG = {
    // 使用当前域名的 /api/chat 代理（Cloudflare Worker 会自动转发到讯飞）
    // 讯飞星辰 Coding Plan
    baseURL: '/api',  // 使用相对路径，由Worker代理转发
    apiKey: '',       // Worker代理中已内置API Key，前端不需要传
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
