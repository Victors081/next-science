#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get arguments
const args = process.argv.slice(2);
const slug = args[0];
const title = args[1];

if (!slug || !title) {
  console.error('Usage: npm run new:experiment <slug> "<title>"');
  console.error('Example: npm run new:experiment 2025-12-27-sales-analysis "Sales Analysis December"');
  process.exit(1);
}

// Validate slug format (YYYY-MM-DD-keywords)
const slugPattern = /^\d{4}-\d{2}-\d{2}-.+$/;
if (!slugPattern.test(slug)) {
  console.error('Error: Slug must be in format YYYY-MM-DD-keywords');
  console.error('Example: 2025-12-27-sales-analysis');
  process.exit(1);
}

const projectRoot = path.join(__dirname, '..');
const contentPath = path.join(projectRoot, 'content', 'blog', `${slug}.mdx`);
const analysisDir = path.join(projectRoot, 'analysis', 'blog', slug);
const analysisPath = path.join(analysisDir, 'analysis.qmd');
const templateMdx = path.join(projectRoot, 'templates', 'experiment.mdx.template');
const templateQmd = path.join(projectRoot, 'templates', 'analysis.qmd.template');

// Check if blog post already exists
if (fs.existsSync(contentPath)) {
  console.error(`Error: Blog post ${slug} already exists`);
  process.exit(1);
}

// Read templates
const mdxTemplate = fs.readFileSync(templateMdx, 'utf8');
const qmdTemplate = fs.readFileSync(templateQmd, 'utf8');

// Get current date
const date = new Date().toISOString().split('T')[0];

// Replace placeholders
const mdxContent = mdxTemplate
  .replace(/\{\{TITLE\}\}/g, title)
  .replace(/\{\{DATE\}\}/g, date)
  .replace(/\{\{SLUG\}\}/g, slug);

const qmdContent = qmdTemplate
  .replace(/\{\{TITLE\}\}/g, title)
  .replace(/\{\{DATE\}\}/g, date)
  .replace(/\{\{SLUG\}\}/g, slug);

// Create directories
fs.mkdirSync(path.dirname(contentPath), { recursive: true });
fs.mkdirSync(analysisDir, { recursive: true });

// Write files
fs.writeFileSync(contentPath, mdxContent);
fs.writeFileSync(analysisPath, qmdContent);

console.log('✅ Blog post with Quarto created successfully!\n');
console.log('📁 Files created:');
console.log(`   - ${contentPath}`);
console.log(`   - ${analysisPath}\n`);
console.log('📝 Next steps:');
console.log('   1. Edit the Quarto file (analysis.qmd) for your analysis');
console.log('   2. Run: npm run quarto:render');
console.log('   → This will automatically generate/update the MDX file!');
console.log('   3. (Optional) Edit the MDX file to add narrative content');
console.log('   4. Check the output in public/experiments/' + slug);
