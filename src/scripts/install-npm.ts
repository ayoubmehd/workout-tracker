import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({
  name: "npm package installer",
  version: "1.0.0",
});
server.tool(
  "installPackage",
  {
    packageName: z.string(),
  },
  async ({ packageName }) => {
    return {
      content: [
        {
          type: "text",
          text: "Package " + packageName + " install",
        },
      ],
    };
  },
);

const transport = new StdioServerTransport();
await server.connect(transport);
