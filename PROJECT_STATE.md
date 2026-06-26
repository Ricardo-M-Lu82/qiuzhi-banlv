# 求职伴侣 — 项目交接单

## 项目是什么

面向中国应届大学毕业生的求职辅助网站。帮迷茫的大学生找到岗位方向、优化简历、准备面试。

**目标用户：** 不知道自己能投什么岗位的应届生（普遍痛点：学校教的和市场脱节，缺乏职业认知）

**产品定位：** "一个刚走完求职路的普通毕业生做的工具"，不是冰冷的工具平台，是"过来人带你走一遍"

**线上地址：** https://qiuzhi-banlv.191625864.workers.dev/

**GitHub：** https://github.com/Ricardo-M-Lu82/qiuzhi-banlv

---

## 目录结构

```
qiuzhi-banlv/
├── index.html              # 首页（故事 + 三个功能卡片 + 入口按钮）
├── match.html              # 岗位匹配（对话 + 结构化确认 + 结果展示）
├── resume.html             # 简历优化（JD粘贴 + 简历粘贴 + 分析结果）
├── css/style.css           # 全局样式（720px最大宽度，暖色系，移动端优先）
├── js/
│   ├── config.js           # API配置（baseURL: '/api'，走Worker代理）
│   ├── chat.js             # 对话引擎（CareerChat类，5轮对话后自动提取用户画像）
│   ├── match-engine.js     # 匹配引擎（10个岗位的数据库 + 标签匹配算法）
│   ├── resume-analyzer.js  # 简历分析（前端关键词提取 + API深度分析 + 降级方案）
│   └── main.js             # 通用工具（导出、加载、错误处理）
└── worker.js               # Cloudflare Worker（静态托管 + /api/chat 反向代理）
```

---

## 做完了什么

### 整体设计
- 5轮需求讨论，核心痛点定位为 **方向迷失 > 简历困境 > 面试恐惧**
- 方案C（混合模式）：对话式开场 → 结构化确认 → 规则匹配输出
- 配色/排版/间距/动画/响应式全套设计标准已定
- 所有文案已针对"迷茫大学生"优化（说人话、降防御、先共情）

### 三页面完整代码
1. **首页**：M Lu真实求职故事（500+份简历，11月→6月）+ 三个功能卡片 + 单一入口按钮
2. **岗位匹配**：Chat UI → 结构化表单（3步）→ 匹配结果卡片（含匹配度、工作内容、发展路径、搜索关键词）
3. **简历优化**：JD输入 + 简历输入 → API分析 → JD拆解 + 差距标注 + 优化版简历

### 部署
- GitHub仓库创建，2次commit已推送
- Cloudflare Worker已部署，URL可用

---

## 卡在哪里：API跨域问题

**现象：** 用户在聊天界面发消息后，前端报错 `Failed to fetch`，AI不回复

**根因：** 浏览器同源策略（CORS）阻止前端JS直接调用 `maas-coding-api.cn-huabei-1.xf-yun.com`。讯飞API没有设置 `Access-Control-Allow-Origin` 头，浏览器拒绝跨域请求。

**技术本质：** 讯飞星辰 Coding Plan 的API是给后端/IDE插件用的，不是给前端网页直接调的。它的Base URL（`maas-coding-api`）不支持浏览器端CORS。

---

## 尝试过的方案

| 方案 | 结果 |
|------|------|
| 前端直接fetch讯飞API | ❌ CORS被拦截 |
| 绕过代理直接curl调API | ✅ curl环境通，证明API Key有效、端点可达 |
| 前端改走本地Worker代理 `/api/chat` | ⏳ 代码已写好未生效 |

---

## 已完成的修复

1. `config.js`：baseURL从 `https://maas-coding-api...` 改为 `/api`，API Key从前端移除（由Worker后端持有）
2. `chat.js`：所有 `fetch` 调用改为 `/api/chat`，移除 `Authorization` header（Worker代理负责加）
3. `resume-analyzer.js`：同上
4. `worker.js`：新建Cloudflare Worker脚本，同时托管静态文件 + `/api/chat` 反向代理到讯飞API。代理路径：浏览器 → Worker `/api/chat` → 讯飞 `maas-coding-api/.../chat/completions`

这些修复已commit（`4da7c06`），已推送到GitHub。

---

## 下一步（按优先级）

### 1. 更新Cloudflare Worker代码（立即，需要操作Cloudflare后台）

当前Worker只托管了静态文件，还没有 `/api/chat` 代理逻辑。需要在Cloudflare控制台编辑Worker代码，把 `worker.js` 的内容替换进去。

**操作路径：** Cloudflare Dashboard → Workers & Pages → qiuzhi-banlv → 编辑代码 → 粘贴 `worker.js` → Deploy

**部署后验证：** 打开浏览器控制台（F12），在岗位匹配页发一条消息，观察Network标签中 `/api/chat` 请求是否返回200。

### 2. 功能验证

- [ ] 对话3-5轮后自动切换到结构化确认
- [ ] 表单填完后正确推荐岗位
- [ ] 简历分析返回JD关键词和差距建议
- [ ] 手机端样式正确

### 3. v0.2规划

- 面试辅导页面
- "学长学姐说"社区板块
- 岗位库从10个扩展到30个

---

## 技术决策备忘

- **为什么纯前端不用框架？** MVP阶段，3个页面不需要React/Vue的开销。纯HTML+CSS+JS，零依赖，部署快。
- **为什么用Cloudflare Workers而不是单独的后端？** 没服务器、不花钱、Worker自带全球CDN、`/api/chat`代理逻辑极简单（不到50行）。
- **为什么API Key放在Worker而不是前端？** 前端放Key会被任何人看到并滥用。Worker是服务端环境，Key安全。
- **匹配引擎为什么用规则不用AI？** 10个岗位的匹配不需要大模型。标签匹配算法可解释、可调优、不花钱。
- **API代理路径为什么是 `/api/chat` 而不是 `/api/chat/completions`？** 为了跟Worker路由匹配更简洁。

---

## 开发环境

- 操作系统：Windows 11
- Git：已配置（Ricardo-M-Lu82）
- GitHub CLI：已登录
- 网络：HTTP_PROXY=127.0.0.1:7897（经常失效），push需 `env -u ALL_PROXY` 绕过
- 浏览器：直接打开 `index.html` 即可本地预览
