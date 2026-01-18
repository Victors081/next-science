# Next Science

A modern scientific blog and data analysis platform built with Next.js, Quarto, and Python. This project seamlessly integrates data analysis workflows (using Quarto and Python) with a beautiful Next.js website for sharing experiments, blog posts, and projects.

## Features

- 🔬 **Blog Posts with Quarto**: Create reproducible data analyses using Quarto (`.qmd` files) with Python, integrated into blog posts
- 📊 **Interactive Visualizations**: Support for Matplotlib, Seaborn, and Plotly charts
- 📝 **Blog Posts**: Write and publish blog posts using MDX
- 🚀 **Projects**: Showcase your projects with rich content
- 🎨 **Modern UI**: Built with Next.js 16, React 19, Tailwind CSS, and shadcn/ui components
- ⚡ **Fast Development**: Hot reload and automatic MDX syncing from Quarto outputs
- 📈 **Summary Cards**: Automatic generation of experiment summaries with key metrics

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) and npm
- **Python** (3.11 or higher)
- **Quarto** ([Installation guide](https://quarto.org/docs/get-started/))

## Installation

1. **Clone the repository** (or navigate to your project directory):
   ```bash
   cd next-science
   ```

2. **Install Node.js dependencies**:
   ```bash
   npm install
   ```

3. **Set up Python virtual environment**:
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

4. **Verify Quarto installation**:
   ```bash
   quarto --version
   ```

## Project Structure

```
next-science/
├── app/                    # Next.js app directory
│   ├── blog/               # Blog pages (includes posts with Quarto)
│   └── projects/           # Project pages
├── analysis/               # Quarto analysis files
│   └── blog/               # Blog posts with Quarto analyses (.qmd files)
├── components/             # React components
│   ├── content/            # Content-specific components
│   ├── layout/             # Layout components
│   └── ui/                 # UI components (shadcn/ui)
├── content/                # MDX content files
│   ├── blog/               # Blog post MDX files (includes Quarto posts)
│   └── projects/           # Project MDX files
├── lib/                    # Utility functions
├── public/                 # Static assets
│   └── experiments/        # Generated Quarto outputs (charts, summaries)
├── scripts/                # Build and utility scripts
│   ├── build-quarto.mjs    # Renders all Quarto files
│   ├── sync-mdx.mjs        # Syncs MDX from QMD files
│   ├── new-experiment.mjs  # Creates new blog post with Quarto
│   ├── new-blog.mjs        # Creates new blog post
│   └── new-project.mjs     # Creates new project
└── templates/              # Template files for new content
```

## Usage

### Development Server

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Creating a Blog Post with Quarto

Blog posts can include Quarto analysis files (`.qmd`) for data analysis. The workflow is:

1. **Create a new blog post with Quarto**:
   ```bash
   npm run new:experiment <slug> "<title>"
   ```
   
   Example:
   ```bash
   npm run new:experiment 2025-01-15-sales-analysis "Sales Analysis January 2025"
   ```
   
   This creates:
   - `content/blog/2025-01-15-sales-analysis.mdx` - MDX content file (with `hasQuarto: true` and `"experiment"` tag)
   - `analysis/blog/2025-01-15-sales-analysis/analysis.qmd` - Quarto analysis file

2. **Edit the Quarto file** (`analysis/blog/<slug>/analysis.qmd`):
   - Write your Python code in code blocks
   - Save charts to `public/experiments/<slug>/`
   - Generate a `summary.json` file for automatic summary cards

3. **Render the Quarto file**:
   ```bash
   npm run quarto:render
   ```
   
   This will:
   - Execute all Quarto files and generate outputs
   - Automatically sync MDX files from the QMD content
   - Place charts and summaries in `public/experiments/<slug>/`

4. **Edit the MDX file** (optional):
   - Add narrative content, explanations, and context
   - The MDX file is auto-generated but you can customize it
   - Charts are automatically inserted using `<ExperimentChart>` components

5. **View your blog post**:
   - Visit `http://localhost:3000/blog/<slug>`

#### Example Quarto Analysis Structure

```yaml
---
title: "My Blog Post with Quarto"
format:
  html:
    embed-resources: false
    self-contained: false
execute:
  echo: false
  warning: false
jupyter: python3
---

```{python}
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from pathlib import Path

# Set output directory
output_dir = Path("../../../public/experiments/2025-01-15-sales-analysis")
output_dir.mkdir(parents=True, exist_ok=True)
```

## Data Loading

```{python}
# Load your data
df = pd.read_csv("data.csv")
```

## Analysis

```{python}
# Create visualizations
plt.figure(figsize=(10, 6))
plt.plot(df['x'], df['y'])
plt.savefig(output_dir / 'fig1.png', dpi=150, bbox_inches='tight')
plt.close()
```

## Summary

```{python}
# Generate summary JSON
import json
summary = {
    "highlights": ["Key finding 1", "Key finding 2"],
    "metrics": {
        "main": [
            {"label": "Total Records", "value": len(df), "unit": ""}
        ]
    }
}
with open(output_dir / 'summary.json', 'w') as f:
    json.dump(summary, f, indent=2)
```
```

### Creating a New Blog Post

1. **Create a new blog post**:
   ```bash
   npm run new:blog <slug> "<title>"
   ```
   
   Example:
   ```bash
   npm run new:blog my-first-post "My First Post"
   ```

2. **Edit the MDX file** at `content/blog/<slug>.mdx`

3. **View your blog post** at `http://localhost:3000/blog/<slug>`

### Creating a New Project

1. **Create a new project**:
   ```bash
   npm run new:project <slug> "<title>"
   ```
   
   Example:
   ```bash
   npm run new:project my-awesome-project "My Awesome Project"
   ```

2. **Edit the MDX file** at `content/projects/<slug>.mdx`

3. **View your project** at `http://localhost:3000/projects/<slug>`

### Building for Production

Build the site for production:

```bash
npm run build
```

This command:
1. Renders all Quarto files (`npm run quarto:render`)
2. Syncs MDX files from QMD outputs
3. Builds the Next.js application

Start the production server:

```bash
npm start
```

### Manual MDX Sync

If you need to sync MDX files without rendering Quarto:

```bash
npm run sync:mdx
```

To sync a specific blog post:

```bash
node scripts/sync-mdx.mjs <slug>
```

## Workflow Tips

### Blog Post with Quarto Workflow

1. **Development cycle**:
   - Edit `analysis/blog/<slug>/analysis.qmd`
   - Run `npm run quarto:render` (or render individual files)
   - MDX files are automatically updated
   - View changes at `http://localhost:3000/blog/<slug>`

2. **Chart naming**:
   - Save charts as `fig1.png`, `fig2.png`, etc. for consistent ordering
   - Plotly HTML charts: `chart1.html`, `chart2.html`, etc.
   - Charts are automatically detected and inserted into MDX

3. **Summary cards**:
   - Generate `summary.json` in your Quarto file
   - The `<ExperimentSummary />` component will automatically display it
   - Format: `{"highlights": [...], "metrics": {"main": [...]}}`

### Content Status

- Set `status: "draft"` in frontmatter to hide content in production
- Drafts are visible in development mode
- Use `status: "published"` for published content

### Hiding Blog Entries

You can hide blog entries without deleting them by setting their status to `"draft"`. Draft posts are:
- Hidden from the blog listing page in production
- Not accessible via direct URL in production (returns 404)
- Still visible in development mode for testing

**Toggle blog post status:**
```bash
npm run toggle:blog <slug> <draft|published>
```

Examples:
```bash
# Hide a blog post
npm run toggle:blog 2025-12-28-plotly-demo draft

# Show a blog post
npm run toggle:blog 2025-12-28-plotly-demo published
```

**Manually edit frontmatter:**
You can also manually edit the MDX file and change `status: "draft"` to `status: "published"` or vice versa.

### Deleting Blog Entries

To permanently delete a blog entry:

```bash
npm run delete:blog <slug>
```

Example:
```bash
npm run delete:blog 2025-12-28-plotly-demo
```

This will:
- Delete the MDX file from `content/blog/`
- For Quarto-based posts, also delete:
  - The analysis directory (`analysis/blog/<slug>/`)
  - The experiments directory (`public/experiments/<slug>/`)

**Note:** After deletion, restart your dev server or rebuild to see changes.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production (includes Quarto rendering)
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run quarto:render` - Render all Quarto files
- `npm run sync:mdx` - Sync MDX files from QMD outputs
- `npm run new:experiment <slug> "<title>"` - Create new blog post with Quarto
- `npm run new:blog <slug> "<title>"` - Create new blog post
- `npm run new:project <slug> "<title>"` - Create new project
- `npm run toggle:blog <slug> <draft|published>` - Toggle blog post visibility
- `npm run delete:blog <slug>` - Delete a blog post and its related files

## Python Environment

The project uses a Python virtual environment for data analysis. The `build-quarto.mjs` script automatically detects and uses the virtual environment's Python interpreter.

To activate the virtual environment manually:

```bash
source venv/bin/activate  # macOS/Linux
# or
venv\Scripts\activate      # Windows
```

## Quarto Configuration

Quarto files are configured to:
- Use Python 3 (`jupyter: python3`)
- Output to `public/experiments/<slug>/`
- Generate non-self-contained HTML (for faster builds)
- Suppress code echo and warnings in output

## Components

### Blog Post Components (for Quarto posts)

- `<ExperimentSummary />` - Displays summary card from `summary.json`
- `<ExperimentChart filename="..." alt="..." caption="..." />` - Embeds charts/images

These components are automatically available in blog post MDX files that have `hasQuarto: true` in their frontmatter.

## Deployment

### Vercel (Recommended)

This project uses a **pre-render approach** for Quarto files. Quarto outputs are generated locally and committed to the repository, so Vercel doesn't need Quarto installed.

#### Pre-deployment Steps

1. **Render Quarto files locally**:
   ```bash
   npm run quarto:render
   ```
   This generates all charts, summaries, and updates MDX files.

2. **Commit the generated files**:
   ```bash
   git add public/experiments/ content/blog/
   git commit -m "Pre-render Quarto outputs for deployment"
   ```

3. **Push to GitHub**:
   ```bash
   git push
   ```

#### Vercel Setup

1. Push your code to GitHub/GitLab/Bitbucket
2. Import the project in Vercel
3. Vercel will automatically detect the `vercel.json` configuration:
   - Build Command: `npm run build:vercel` (skips Quarto rendering)
   - Output Directory: `.next`
   - Framework: Next.js
4. Deploy!

**Note**: The `vercel.json` file is already configured. You don't need to change any settings in the Vercel dashboard.

#### After Making Changes to Quarto Files

Whenever you update a Quarto analysis file:

1. Render locally: `npm run quarto:render`
2. Commit the updated outputs
3. Push to trigger a new deployment

### Other Platforms

The project builds to a standard Next.js application. Follow your platform's Next.js deployment guide.

**Note**: For platforms without Quarto, use the pre-render approach (render locally and commit outputs).

## Troubleshooting

### Quarto not found

Ensure Quarto is installed and available in your PATH:
```bash
quarto --version
```

### Python errors

- Activate your virtual environment: `source venv/bin/activate`
- Ensure all dependencies are installed: `pip install -r requirements.txt`
- Check that `QUARTO_PYTHON` environment variable points to the correct Python

### Charts not appearing

- Verify charts are saved to `public/experiments/<slug>/`
- Run `npm run sync:mdx` to update MDX files
- Check that filenames match in your MDX file

### MDX sync issues

- Ensure Quarto files have been rendered first
- Check that the slug matches between directories
- Verify file paths are correct

## Contributing

1. Create a new branch for your changes
2. Make your modifications
3. Test locally with `npm run dev`
4. Submit a pull request

## License

[Add your license here]

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Quarto Documentation](https://quarto.org/docs/)
- [MDX Documentation](https://mdxjs.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
