#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerGenericTools } from "./tools/generic.js";
import { registerProjectTools } from "./tools/projects.js";

const server = new McpServer({
  name: "flow-team-mcp",
  version: "1.0.0"
});

registerGenericTools(server);
registerProjectTools(server);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
