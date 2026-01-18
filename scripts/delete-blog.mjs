#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const args = process.argv.slice(2);
const slug = args[0];

if (!slug) {
  console.error('Usage: npm run delete:blog <slug>');
  console.error('Example: npm run delete:blog 2025-12-28-plotly-demo');
  process.exit(1);
}

const projectRoot = path.join(__dirname, '..');
const contentPath = path.join(projectRoot, 'content', 'blog', `${slug}.mdx`);
const analysisPath = path.join(projectRoot, 'analysis', 'blog', slug);
const experimentsPath = path.join(projectRoot, 'public', 'experiments', slug);

// Check if blog post exists
if (!fs.existsSync(contentPath)) {
  console.error(`❌ Error: Blog post "${slug}" not found`);
  console.error(`   Expected file: ${contentPath}`);
  process.exit(1);
}

// Check if it's a Quarto-based post
let isQuartoPost = false;
try {
  const fileContents = fs.readFileSync(contentPath, 'utf8');
  const { data } = matter(fileContents);
  isQuartoPost = data.hasQuarto === true;
} catch (error) {
  console.warn('⚠️  Warning: Could not read frontmatter, checking directories...');
  isQuartoPost = fs.existsSync(analysisPath);
}

console.log(`🗑️  Deleting blog post: ${slug}`);
console.log(`   Type: ${isQuartoPost ? 'Quarto-based (experiment)' : 'Regular blog post'}`);

// Delete MDX file
try {
  fs.unlinkSync(contentPath);
  console.log(`✅ Deleted: ${contentPath}`);
} catch (error) {
  console.error(`❌ Error deleting MDX file: ${error.message}`);
  process.exit(1);
}

// Delete Quarto-related files if it's a Quarto post
if (isQuartoPost) {
  // Delete analysis directory
  if (fs.existsSync(analysisPath)) {
    try {
      fs.rmSync(analysisPath, { recursive: true, force: true });
      console.log(`✅ Deleted: ${analysisPath}`);
    } catch (error) {
      console.error(`⚠️  Warning: Could not delete analysis directory: ${error.message}`);
    }
  }

  // Delete experiments directory
  if (fs.existsSync(experimentsPath)) {
    try {
      fs.rmSync(experimentsPath, { recursive: true, force: true });
      console.log(`✅ Deleted: ${experimentsPath}`);
    } catch (error) {
      console.error(`⚠️  Warning: Could not delete experiments directory: ${error.message}`);
    }
  }
}

console.log(`\n✨ Blog post "${slug}" has been deleted successfully!`);
console.log(`   Remember to restart your dev server or rebuild to see changes.`);
