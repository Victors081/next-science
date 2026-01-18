#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.join(__dirname, '..');
const analysisDir = path.join(projectRoot, 'analysis', 'blog');
const contentDir = path.join(projectRoot, 'content', 'blog');
const publicDir = path.join(projectRoot, 'public', 'experiments');

/**
 * Extract metadata and structure from a .qmd file
 */
function parseQmdFile(qmdPath) {
  const content = fs.readFileSync(qmdPath, 'utf8');
  const { data: frontmatter, content: body } = matter(content);

  // Remove code blocks (we don't want to include Python code in MDX)
  const bodyWithoutCode = body.replace(/```\{[^}]+\}[\s\S]*?```/g, '');

  // Extract sections with their content
  const sections = [];
  const lines = bodyWithoutCode.split('\n');
  let currentSection = null;
  let currentContent = [];

  for (const line of lines) {
    const headerMatch = line.match(/^(##+)\s+(.+)$/);
    if (headerMatch) {
      // Save previous section if exists
      if (currentSection) {
        sections.push({
          title: currentSection,
          content: currentContent.join('\n').trim(),
        });
      }
      // Start new section
      currentSection = headerMatch[2];
      currentContent = [];
    } else if (currentSection) {
      // Add content to current section
      currentContent.push(line);
    }
  }

  // Don't forget the last section
  if (currentSection) {
    sections.push({
      title: currentSection,
      content: currentContent.join('\n').trim(),
    });
  }

  // Extract chart filenames from plt.savefig and fig.write_html calls
  const chartFiles = [];
  // Matplotlib/Seaborn charts
  const savefigRegex = /plt\.savefig\([^)]*['"]([^'"]+)['"]/g;
  let match;
  while ((match = savefigRegex.exec(body)) !== null) {
    const filename = path.basename(match[1]);
    if (filename.match(/\.(png|svg|jpg|jpeg)$/i)) {
      chartFiles.push(filename);
    }
  }
  // Plotly HTML charts
  const writeHtmlRegex = /fig\.write_html\([^)]*['"]([^'"]+)['"]/g;
  while ((match = writeHtmlRegex.exec(body)) !== null) {
    const filename = path.basename(match[1]);
    if (filename.match(/\.html$/i)) {
      chartFiles.push(filename);
    }
  }

  return {
    frontmatter,
    sections,
    chartFiles,
  };
}

/**
 * Find all image files in the output directory
 */
function findOutputFiles(outputDir) {
  if (!fs.existsSync(outputDir)) {
    return { charts: [], hasSummary: false };
  }

  const files = fs.readdirSync(outputDir);
  const charts = files
    .filter((f) => /\.(png|svg|jpg|jpeg|html)$/i.test(f))
    .sort(); // Sort to maintain consistent order (fig1.png, chart1.html, etc.)
  const hasSummary = files.includes('summary.json');

  return { charts, hasSummary };
}

/**
 * Generate MDX content from QMD data
 */
function generateMdxContent(slug, qmdData, outputFiles) {
  const { frontmatter, sections, chartFiles } = qmdData;
  const { charts, hasSummary } = outputFiles;

  // Use charts from output directory (more reliable than parsing code)
  const finalCharts = charts.length > 0 ? charts : chartFiles;

  // Extract date from slug or use current date
  const dateMatch = slug.match(/^(\d{4}-\d{2}-\d{2})/);
  const defaultDate = dateMatch ? dateMatch[1] : new Date().toISOString().split('T')[0];

  // Build frontmatter
  const tags = frontmatter.tags || [];
  // Ensure "experiment" tag exists
  if (!tags.includes('experiment')) {
    tags.push('experiment');
  }
  
  const mdxFrontmatter = {
    title: frontmatter.title || 'Untitled Blog Post',
    date: frontmatter.date || defaultDate,
    summary: frontmatter.summary || 'Brief description of the blog post',
    tags: tags,
    type: frontmatter.type || 'exploratory',
    status: frontmatter.status || 'draft',
    hasQuarto: true,
  };

  // Build MDX content
  // Note: We don't include import statements because next-mdx-remote/rsc
  // doesn't support them. Components are provided via the components prop.
  let mdxContent = `---
title: "${mdxFrontmatter.title}"
date: "${mdxFrontmatter.date}"
summary: "${mdxFrontmatter.summary}"
tags: ${JSON.stringify(mdxFrontmatter.tags)}
type: "${mdxFrontmatter.type}"
status: "${mdxFrontmatter.status}"
hasQuarto: true
---

`;

  // Add summary component at the beginning if available
  if (hasSummary) {
    mdxContent += '<ExperimentSummary />\n\n';
  }

  // Add sections from QMD, or use defaults
  if (sections.length > 0) {
    // Use sections from QMD
    let chartsAdded = false;
    sections.forEach((section, index) => {
      const sectionTitle = section.title;
      const sectionContent = section.content;
      const sectionLower = sectionTitle.toLowerCase();
      
      mdxContent += `## ${sectionTitle}\n\n`;
      
      // Add section content if it exists
      if (sectionContent) {
        mdxContent += `${sectionContent}\n\n`;
      }
      
      // Add charts after "Analysis" section or at appropriate points
      if ((sectionLower.includes('analysis') || sectionLower.includes('visualization') || sectionLower.includes('plot')) && finalCharts.length > 0 && !chartsAdded) {
        finalCharts.forEach((chart, chartIndex) => {
          const chartNum = chartIndex + 1;
          mdxContent += `<ExperimentChart filename="${chart}" alt="${sectionTitle} visualization ${chartNum}" caption="Figure ${chartNum}: ${sectionTitle} visualization" />\n\n`;
        });
        chartsAdded = true;
      }
    });
  } else {
    // Default structure
    mdxContent += `## Context

Describe the context and motivation for this experiment.

## Data

Describe the data used in this experiment.

## Analysis

`;

    // Add all charts in the Analysis section
    if (finalCharts.length > 0) {
      finalCharts.forEach((chart, index) => {
        const chartNum = index + 1;
        mdxContent += `<ExperimentChart filename="${chart}" alt="Chart ${chartNum}" caption="Figure ${chartNum}: Analysis visualization" />\n\n`;
      });
    }

    mdxContent += `## Results

Summarize the key findings.

## Conclusion

What did we learn? What are the next steps?
`;
  }

  return mdxContent;
}

/**
 * Sync MDX file from QMD file
 */
function syncMdxFromQmd(slug) {
  const qmdPath = path.join(analysisDir, slug, 'analysis.qmd');
  const mdxPath = path.join(contentDir, `${slug}.mdx`);
  const outputDir = path.join(publicDir, slug);

  if (!fs.existsSync(qmdPath)) {
    console.log(`⚠️  Skipping ${slug} - no analysis.qmd found`);
    return false;
  }

  try {
    // Parse QMD file
    const qmdData = parseQmdFile(qmdPath);

    // Find output files
    const outputFiles = findOutputFiles(outputDir);

    // Generate MDX content
    const mdxContent = generateMdxContent(slug, qmdData, outputFiles);

    // Write MDX file
    fs.mkdirSync(path.dirname(mdxPath), { recursive: true });
    fs.writeFileSync(mdxPath, mdxContent);

    console.log(`✅ Synced ${slug}.mdx`);
    if (outputFiles.charts.length > 0) {
      console.log(`   Found ${outputFiles.charts.length} chart(s): ${outputFiles.charts.join(', ')}`);
    }
    if (outputFiles.hasSummary) {
      console.log(`   Found summary.json`);
    }

    return true;
  } catch (error) {
    console.error(`❌ Error syncing ${slug}:`, error.message);
    return false;
  }
}

// Main execution
const args = process.argv.slice(2);
const specificSlug = args[0];

if (specificSlug) {
  // Sync a specific blog post
  syncMdxFromQmd(specificSlug);
} else {
  // Sync all blog posts with Quarto
  console.log('🔄 Syncing MDX files from QMD files...\n');

  if (!fs.existsSync(analysisDir)) {
    console.log('No analysis directory found.');
    process.exit(0);
  }

  const blogPosts = fs.readdirSync(analysisDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  if (blogPosts.length === 0) {
    console.log('No blog posts with Quarto found.');
    process.exit(0);
  }

  let successCount = 0;
  let errorCount = 0;

  for (const blogPost of blogPosts) {
    if (syncMdxFromQmd(blogPost)) {
      successCount++;
    } else {
      errorCount++;
    }
  }

  console.log(`\n✅ Sync complete!`);
  console.log(`   Succeeded: ${successCount}`);
  console.log(`   Failed: ${errorCount}`);

  if (errorCount > 0) {
    process.exit(1);
  }
}

