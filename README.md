<p align="center">
  <strong>Bujidao Web App</strong>
</p>

<p align="center"><strong>Bujidao 用户门户前端控制台，支持账户管理、订阅地址、节点列表与主题切换。</strong></p>

<p align="center">
  <a href="https://github.com/koharachan/BujidaoWebApp"><img src="https://img.shields.io/github/stars/koharachan/BujidaoWebApp?style=flat-square" alt="GitHub stars" /></a>
  <a href="https://github.com/koharachan/BujidaoWebApp/actions"><img src="https://img.shields.io/github/actions/workflow/status/koharachan/BujidaoWebApp/ci.yml?branch=main&style=flat-square" alt="GitHub Workflow Status" /></a>
  <img src="https://img.shields.io/badge/Vue-3.5%2B-3BA776?style=flat-square&logo=vue" alt="Vue 3" />
  <img src="https://img.shields.io/badge/TypeScript-%3E=5.9-3178C6?style=flat-square&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-%3E=5.0-646CFF?style=flat-square&logo=vite" alt="Vite" />
</p>

<p align="center">
  <a href="https://bujidao.org">官网</a> ·
  <a href="https://t.me/bujidaoChat">Telegram</a> ·
  <a href="https://github.com/koharachan/BujidaoWebApp">GitHub</a>
</p>

## 项目简介

Bujidao Web App 是 Bujidao 服务的前端门户控制台，面向会员账户与订阅管理。项目基于 Vue 3、TypeScript 和 Vite 构建，采用模块化主题设计，能够按设备动态加载路由和视图。

## 核心功能

- 用户登录 / 注册 / 退出
- 账户余额查看与充值入口
- 订阅地址显示与一键复制
- 节点列表查询与节点配置展示
- 自定义配置管理与公告推送
- Telegram / Google OAuth 登录支持
- 主题模块化加载与设备适配路由
- Pinia 状态持久化与 JSON-RPC 后端接口交互

## 快速启动

```bash
npm install
npm run dev
```

打开浏览器访问 `http://localhost:5173` 进行本地调试。

## 技术栈

- Vue 3.5+ (Composition API)
- TypeScript
- Vite
- Pinia + pinia-plugin-persistedstate
- Vue Router 4
- Element Plus
- ECharts
- Sass / SCSS
- Prettier

## 项目结构

- `src/`：核心源码
- `src/themes/`：主题模块与各设备路由
- `src/stores/`：Pinia 状态管理
- `src/router/`：基础路由配置
- `src/utils/`：JSON-RPC、用户与工具函数

## 适用场景

本项目适用于 Bujidao 会员中心、控制台及订阅服务界面展示，适合用于 VPN/订阅服务类前端管理系统。

## 贡献

欢迎贡献者加入。请阅读 [CONTRIBUTING.md](./CONTRIBUTING.md) 了解贡献流程、代码规范和分支管理。

## 社区与支持

- 官方网站：<https://bujidao.org/>
- Telegram：<https://t.me/bujidaoChat>
- GitHub：<https://github.com/koharachan/BujidaoWebApp>

