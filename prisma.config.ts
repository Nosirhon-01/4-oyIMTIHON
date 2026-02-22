
import "dotenv/config";

export const defineConfig = (config: any) => config;

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"]
  },
});
