#!/usr/bin/env node
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.join(__dirname, '..');
const analysisDir = path.join(projectRoot, 'analysis', 'blog');

console.log('🔬 Building Quarto blog posts...\n');

if (!fs.existsSync(analysisDir)) {
  console.log('No analysis directory found. Skipping Quarto rendering.');
  process.exit(0);
}

// Get all blog post directories
const blogPosts = fs.readdirSync(analysisDir, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name);

if (blogPosts.length === 0) {
  console.log('No blog posts with Quarto found. Skipping Quarto rendering.');
  process.exit(0);
}

let successCount = 0;
let errorCount = 0;

for (const blogPost of blogPosts) {
  const qmdFile = path.join(analysisDir, blogPost, 'analysis.qmd');

  if (!fs.existsSync(qmdFile)) {
    console.log(`⚠️  Skipping ${blogPost} - no analysis.qmd found`);
    continue;
  }

  try {
    console.log(`📊 Rendering ${blogPost}...`);
    // Use venv Python if it exists
    const venvPython = path.join(projectRoot, 'venv', 'bin', 'python3');
    const pythonPath = fs.existsSync(venvPython) ? venvPython : 'python3';

    execSync(`quarto render "${qmdFile}"`, {
      cwd: projectRoot,
      stdio: 'inherit',
      env: {
        ...process.env,
        QUARTO_PYTHON: pythonPath,
      },
    });
    successCount++;
  } catch (error) {
    console.error(`❌ Error rendering ${blogPost}`);
    errorCount++;
  }
}

console.log('\n✅ Quarto build complete!');
console.log(`   Succeeded: ${successCount}`);
console.log(`   Failed: ${errorCount}`);

// Sync MDX files from QMD files
console.log('\n🔄 Syncing MDX files...');
try {
  const syncScript = path.join(__dirname, 'sync-mdx.mjs');
  execSync(`node "${syncScript}"`, {
    cwd: projectRoot,
    stdio: 'inherit',
  });
} catch (error) {
  console.error('⚠️  Error syncing MDX files (continuing anyway)');
}

if (errorCount > 0) {
  process.exit(1);
}
