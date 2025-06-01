# client-connect-server

> 连接 MCP（Model Context Protocol）服务的客户端 npm 包。本工具包可帮助您快速集成和连接到MCP-SERVER服务。

## 特性

- 简单易用的 API 接口
- 支持与 MCP 服务端进行高效通信(stdio,sse,streambleHttp)
- 完整的 TypeScript 类型定义支持
- 支持 Anthropic Claude 等现代 AI 大模型

## 安装

使用 npm:
```bash
npm install client-connect-server
```
## 快速开始

- 基本用法

```javascript
   import { stdioConnectServer } from 'client-connect-server'; 
   const client = await sseConnectServer("http://localhost:3333/sse");
    console.log("连接成功", await client.listTools()); //查看所有tools
```
