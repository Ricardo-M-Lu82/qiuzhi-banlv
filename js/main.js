// ========================================
// 求职伴侣 — 通用交互脚本
// ========================================

// 导出管理
function exportAsImage(elementId) {
    // 简单实现：创建一个新窗口，展示内容
    const content = document.getElementById(elementId);
    if (!content) return;

    const win = window.open('', '_blank', 'width=800,height=600');
    win.document.write(`
        <html>
        <head><meta charset="UTF-8"><title>求职伴侣</title></head>
        <body style="font-family: sans-serif; padding: 20px; background: #FAF8F5; color: #1E1E1E;">
            ${content.innerHTML}
        </body>
        </html>
    `);
    win.document.close();
}

// 显示加载状态
function showLoading(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = `
        <div class="loading">
            <div class="loading-dots">
                <span></span><span></span><span></span>
            </div>
            <p>正在分析...</p>
        </div>
    `;
}

// 隐藏加载状态
function hideLoading(containerId) {
    const container = document.getElementById(containerId);
    if (container) container.innerHTML = '';
}

// 显示错误消息
function showError(containerId, message) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = `
        <div style="color: #D4694A; padding: 16px; text-align: center;">
            ⚠️ ${message}
        </div>
    `;
}

// 滚动到页面底部
function scrollToBottom() {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
}

// 获取URL参数
function getUrlParam(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
}
