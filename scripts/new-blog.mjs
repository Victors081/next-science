#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const args = process.argv.slice(2);
const slug = args[0];
const title = args[1];

if (!slug || !title) {
  console.error('Usage: npm run new:blog <slug> "<title>"');
  console.error('Example: npm run new:blog my-first-post "My First Post"');
  process.exit(1);
}

const projectRoot = path.join(__dirname, '..');
const contentPath = path.join(projectRoot, 'content', 'blog', `${slug}.mdx`);
const templatePath = path.join(projectRoot, 'templates', 'blog-post.mdx.template');

if (fs.existsSync(contentPath)) {
  console.error(`Error: Blog post ${slug} already exists`);
  process.exit(1);
}

const template = fs.readFileSync(templatePath, 'utf8');
const date = new Date().toISOString().split('T')[0];

const content = template
  .replace(/\{\{TITLE\}\}/g, title)
  .replace(/\{\{DATE\}\}/g, date)
  .replace(/\{\{SLUG\}\}/g, slug);

fs.mkdirSync(path.dirname(contentPath), { recursive: true });
fs.writeFileSync(contentPath, content);

console.log('✅ Blog post created successfully!');
console.log(`📁 File: ${contentPath}`);
