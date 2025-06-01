import { sseConnectServer } from ".";
async function main() {
     const client = await sseConnectServer("http://localhost:3000/sse");
     console.log("连接成功", await client.listTools());
}
main();