import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

export const stdioConnectServer = async (serverPath: string) => {
  try {
    // 验证文件类型
    const isJS = serverPath.endsWith(".js") || serverPath.endsWith(".cjs");
    if (!isJS) {
      throw new Error("The serverPath must be a .js or .cjs file");
    }

    console.log(`尝试通过stdio连接到服务器: ${serverPath}`);
    const command = process.execPath; // stdio在node环境下连接
    const client = new Client({ name: "mcp-client-cli", version: "1.0.0" });
    const transport = new StdioClientTransport({
      command,
      args: [serverPath],
    });

    try {
      await client.connect(transport);
      console.log(`成功连接到stdio服务器: ${serverPath}`);
      return client;
    } catch (error) {
      console.error("服务器连接失败:", error);
      // 关闭传输资源
      try {
        await transport.close?.();
      } catch (closeError) {
        console.warn("关闭传输层时出错:", closeError);
      }
      throw error; // 重新抛出错误供调用者处理
    }
  } catch (error) {
    throw new Error(`Stdio连接mcp-server失败: ${error}`);
  }
};

export const sseConnectServer = async (url: string) => {
  const baseUrl = new URL(url);
  const transport = new SSEClientTransport(baseUrl);
  const client = new Client({
    name: "mcp-client-cli",
    version: "1.0.0",
  });
  try {
    await client.connect(transport);
    console.log(`成功连接到sse服务器: ${url}`);
    return client;
  } catch (error) {
    await transport.close?.();
    throw new Error(`SSE连接mcp-server失败: ${error}`);
  }
};
export const streamableHttpConnectServer = async (url: string) => {
  const baseUrl = new URL(url);
  const transport = new StreamableHTTPClientTransport(baseUrl);
  const client = new Client({
    name: "mcp-client-cli",
    version: "1.0.0",
  });
  try {
    await client.connect(transport);
    console.log(`成功连接到streamableHttp服务器: ${url}`);
    return client;
  } catch (error) {
    await transport.close?.();
    // 如果连接失败，尝试使用sse连接
    console.error(`StreamableHttp连接mcp-server失败: ${error}`);
    try {
      sseConnectServer(url);
    } catch (err) {
      throw new Error(`连接mcp-server失败: ${error}`);
    }
  }
};
