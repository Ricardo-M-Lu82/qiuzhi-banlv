// ========================================
// 求职伴侣 — Cloudflare Workers
// 功能：托管静态网站 + 代理讯飞API请求（解决跨域）
// ========================================

// 网页文件内容
const HTML_FILES = {};

// API配置
const API_BASE = 'https://maas-coding-api.cn-huabei-1.xf-yun.com/v2';
const API_KEY = 'da90bf4b058c26b45851e34786dff94e:ZDQzYzcwMzVjNDAwYjk0M2VjY2M0YmVm';

export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);
        const path = url.pathname;

        // API 代理：前端调用 /api/chat → 转发到讯飞API
        if (path === '/api/chat') {
            return handleAPIProxy(request);
        }

        // 静态文件：从环境变量读取或回退到默认页面
        return handleStaticFile(request, env);
    }
};

/**
 * API代理：解决跨域问题
 */
async function handleAPIProxy(request) {
    // 处理 CORS 预检请求
    if (request.method === 'OPTIONS') {
        return new Response(null, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                'Access-Control-Max-Age': '86400'
            }
        });
    }

    try {
        // 转发请求到讯飞API
        const response = await fetch(`${API_BASE}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: request.body
        });

        const data = await response.json();

        return new Response(JSON.stringify(data), {
            status: response.status,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    } catch (error) {
        return new Response(JSON.stringify({
            error: 'API代理请求失败',
            detail: error.message
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    }
}

/**
 * 处理静态文件请求
 * 优先从 Workers KV 或环境变量读取，否则返回提示
 */
async function handleStaticFile(request, env) {
    const url = new URL(request.url);
    let path = url.pathname;

    // 默认首页
    if (path === '/' || path === '') {
        path = '/index.html';
    }

    // 去掉开头的 /
    const filename = path.startsWith('/') ? path.substring(1) : path;

    // 尝试从 KV namespace 读取文件
    // 如果绑定了 KV (名称为 ASSETS)，从 KV 读取
    if (env.ASSETS) {
        try {
            const file = await env.ASSETS.get(filename);
            if (file) {
                const contentType = getContentType(filename);
                return new Response(file, {
                    headers: {
                        'Content-Type': contentType,
                        'Cache-Control': 'public, max-age=3600'
                    }
                });
            }
        } catch (e) {
            // KV 读取失败，继续尝试其他方式
        }
    }

    // 从环境变量读取（备选方案）
    if (env[filename]) {
        const contentType = getContentType(filename);
        return new Response(env[filename], {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=3600'
            }
        });
    }

    // 文件未找到
    return new Response('File not found: ' + path, { status: 404 });
}

/**
 * 根据文件扩展名返回 Content-Type
 */
function getContentType(filename) {
    const ext = filename.split('.').pop().toLowerCase();
    const types = {
        'html': 'text/html; charset=utf-8',
        'css': 'text/css; charset=utf-8',
        'js': 'application/javascript; charset=utf-8',
        'json': 'application/json',
        'png': 'image/png',
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'svg': 'image/svg+xml',
        'ico': 'image/x-icon'
    };
    return types[ext] || 'text/plain';
}
