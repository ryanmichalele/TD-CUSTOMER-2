import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from './schemas'

export default defineConfig({
  name: 'default',
  title: 'TreasuryDirect Dashboard CMS',
  projectId: 'e9j72tow',
  dataset: 'production',
  basePath: '/',
  plugins: [structureTool()],
  schema: { types: schemaTypes },
})
