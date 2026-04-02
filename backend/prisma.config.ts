import { defineConfig } from 'prisma/config';

export default defineConfig({
  // Multi-file schema: all *.prisma files inside prisma/ are merged.
  // schema.prisma holds the generator + datasource blocks.
  // Domain files: business.prisma, menu.prisma
  schema: 'prisma/',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: process.env['DATABASE_URL'],
  },
});
