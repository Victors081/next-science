#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const args = process.argv.slice(2);
const slug = args[0];
const newStatus = args[1]; // 'draft' or 'published'

if (!slug || !newStatus) {
  console.error('Usage: npm run toggle:blog <slug> <draft|published>');
  console.error('Example: npm run toggle:blog 2025-12-28-plotly-demo draft');
  process.exit(1);
}

if (newStatus !== 'draft' && newStatus !== 'published') {
  console.error('Error: Status must be either "draft" or "published"');
  process.exit(1);
}

const projectRoot = path.join(__dirname, '..');
const contentPath = path.join(projectRoot, 'content', 'blog', `${slug}.mdx`);

if (!fs.existsSync(contentPath)) {
  console.error(`❌ Error: Blog post "${slug}" not found`);
  console.error(`   Expected file: ${contentPath}`);
  process.exit(1);
}

const fileContents = fs.readFileSync(contentPath, 'utf8');
const { data, content } = matter(fileContents);

const oldStatus = data.status || 'published';
data.status = newStatus;

const updatedContent = matter.stringify(content, data);
fs.writeFileSync(contentPath, updatedContent);

console.log(`✅ Blog post "${slug}" status updated:`);
console.log(`   ${oldStatus} → ${newStatus}`);
console.log(`\n📝 Note: Draft posts are hidden in production but visible in development mode.`);
