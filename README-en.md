<p align="center">
  <strong>Bujidao Web App</strong>
</p>

<p align="center"><strong>Bujidao user portal frontend for account management, subscription access, node overview, and theme switching.</strong></p>

<p align="center">
  <a href="https://github.com/xiaoxiaobujidao/BujidaoWebApp"><img src="https://img.shields.io/github/stars/xiaoxiaobujidao/BujidaoWebApp?style=flat-square" alt="GitHub stars" /></a>
  <a href="https://github.com/xiaoxiaobujidao/BujidaoWebApp/actions"><img src="https://img.shields.io/github/actions/workflow/status/xiaoxiaobujidao/BujidaoWebApp/ci.yml?branch=test&style=flat-square" alt="GitHub Workflow Status" /></a>
  <img src="https://img.shields.io/badge/Vue-3.5%2B-3BA776?style=flat-square&logo=vue" alt="Vue 3" />
  <img src="https://img.shields.io/badge/TypeScript-%3E=5.9-3178C6?style=flat-square&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-%3E=5.0-646CFF?style=flat-square&logo=vite" alt="Vite" />
</p>

<p align="center">
  <a href="https://bujidao.org">Website</a> ·
  <a href="https://t.me/bujidaoChat">Telegram</a> ·
  <a href="https://github.com/xiaoxiaobujidao/BujidaoWebApp">GitHub</a>
</p>

## Overview

Bujidao Web App is the frontend portal for Bujidao services, focused on member account management and subscription dashboards. It is built with Vue 3, TypeScript, and Vite, using modular theme support and device-aware routing.

## Quick Start

```bash
npm install
npm run dev
```

Open your browser at `http://localhost:5173` to preview the application.

## Key Features

- User login, registration, and sign-out
- Account balance display and recharge flow
- Subscription address display with one-click copy
- Node list queries and configuration details
- Custom configuration management and announcement feed
- Telegram and Google OAuth login support
- Theme module loading by device and route composition
- Pinia persisted state and JSON-RPC backend integration

## Technology Stack

- Vue 3.5+ (Composition API)
- TypeScript
- Vite
- Pinia + pinia-plugin-persistedstate
- Vue Router 4
- Element Plus
- ECharts
- Sass / SCSS
- Prettier

## Project Structure

- `src/`: core application source
- `src/themes/`: theme modules and device-specific routes
- `src/stores/`: global state management
- `src/router/`: base router setup
- `src/utils/`: JSON-RPC, user API, and utility functions

## Contribution Guidelines

Contributions are welcome. Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution process, code style, and branch workflow.

## Community & Support

- Official Website: <https://bujidao.org/>
- Telegram: <https://t.me/bujidaoChat>
- GitHub: <https://github.com/xiaoxiaobujidao/BujidaoWebApp>

