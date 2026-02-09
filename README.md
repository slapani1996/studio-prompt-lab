# Studio Prompt Lab

An AI-powered image generation prompting workbench for Bond Studio. This tool helps teams experiment with Google's Gemini image generation models, including prompting strategies, product catalog integration, and LLM settings for home remodeling visualization.

## Features

- **Input Sets Management**: Upload images, search and select products from the catalog API, save collections for reuse
- **Prompt Workbench**: Build single-step or multi-step (chain) prompts with customizable settings
- **Execution & Results**: Run prompts against input sets with real-time progress and side-by-side comparison
- **Review & Annotation**: Star ratings, notes, and tagging system for results
- **History & Traceability**: Full run history, reproducible runs, export functionality

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite with Prisma
- **Image Generation**: Google Gemini API
- **Catalog API**: studioxlowes.com

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Google Gemini API key

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd image-gen
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Edit `.env` and add your Gemini API key:
```env
DATABASE_URL="file:./dev.db"
GEMINI_API_KEY="your-gemini-api-key"
CATALOG_API_URL="https://api.studioxlowes.com/catalog/v3"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

5. Set up the database:
```bash
npx prisma migrate dev
npx prisma generate
```

6. Start the development server:
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Getting a Gemini API Key

### Quick Setup
1. Go to [https://aistudio.google.com](https://aistudio.google.com)
2. Sign in with your Google account
3. Click **"Get API Key"** > **"Create API Key"**
4. Copy the key and add to your `.env` file

### Enable Paid Usage
1. Go to [https://console.cloud.google.com](https://console.cloud.google.com)
2. Select your project > **Billing** > Link billing account
3. Add a payment method

### Pricing
| Model | Cost | Images per $100 |
|-------|------|-----------------|
| gemini-2.0-flash-exp-image-generation | ~$0.04/image | ~2,500 |
| imagen-3.0-generate-002 | ~$0.10/image | ~1,000 |

### Free Tier
- 15 requests/minute, 1,500 requests/day (no billing required)

## Project Structure

```
image-gen/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Dashboard
│   │   ├── inputs/               # Input sets management
│   │   ├── prompts/              # Prompt builder
│   │   ├── runs/                 # Run history & execution
│   │   ├── review/               # Review & compare results
│   │   └── api/                  # API routes
│   ├── components/
│   │   ├── ui/                   # Base UI components
│   │   ├── ImageUploader.tsx     # Drag & drop image upload
│   │   ├── ProductSearch.tsx     # Catalog product search
│   │   ├── PromptEditor.tsx      # Single step prompt editor
│   │   ├── ChainBuilder.tsx      # Multi-step chain builder
│   │   ├── ResultViewer.tsx      # Results grid & comparison
│   │   └── ReviewPanel.tsx       # Rating, notes, tags
│   ├── lib/
│   │   ├── db.ts                 # Prisma client
│   │   ├── gemini.ts             # Gemini API client
│   │   └── catalog.ts            # Catalog API client
│   └── types/
│       └── index.ts              # TypeScript interfaces
├── prisma/
│   └── schema.prisma             # Database schema
├── public/
│   ├── uploads/                  # Uploaded images
│   └── outputs/                  # Generated images
└── .env.example
```

## Usage Guide

### 1. Create an Input Set
1. Go to **Input Sets** in the sidebar
2. Click **New Input Set**
3. Upload reference images (drag & drop or click)
4. Search and add products from the catalog
5. Save with a descriptive name

### 2. Build a Prompt Template
1. Go to **Prompts** in the sidebar
2. Click **New Template**
3. Add one or more steps with:
   - Prompt text (use `{{product}}` for product context)
   - Model selection
   - Aspect ratio & image size
   - Temperature setting
4. Save the template

### 3. Run a Generation
1. Go to **Run History** in the sidebar
2. Click **New Run**
3. Select an input set and prompt template
4. Click **Start Run** and wait for completion

### 4. Review Results
1. View results in the run detail page
2. Or go to **Review** for all results
3. Rate results (1-5 stars)
4. Add notes and tags
5. Compare multiple results side-by-side

### 5. Export Data
- Export all rated results as JSON or CSV
- Export individual runs with full metadata

## Deployment to Vercel

### Option 1: Turso Database (Recommended for Production)

1. **Set up Turso database:**
```bash
# Install Turso CLI
brew install tursodatabase/tap/turso

# Login and create database
turso auth login
turso db create studio-prompt-lab

# Get connection info
turso db show studio-prompt-lab --url
turso db tokens create studio-prompt-lab
```

2. **Push schema to Turso:**
```bash
turso db shell studio-prompt-lab < prisma/migrations/*/migration.sql
```

3. **Deploy to Vercel:**
   - Push code to GitHub
   - Import repository in [vercel.com](https://vercel.com)
   - Add environment variables:
     - `TURSO_DATABASE_URL`: Your Turso database URL
     - `TURSO_AUTH_TOKEN`: Your Turso auth token
     - `GEMINI_API_KEY`: Your Gemini API key
     - `CATALOG_API_URL`: `https://api.studioxlowes.com/catalog/v3`
     - `NEXT_PUBLIC_APP_URL`: Your Vercel deployment URL

4. Deploy

### Option 2: SQLite (Development Only)

For quick testing with SQLite:

1. Add environment variables in Vercel:
   - `DATABASE_URL`: `file:./dev.db`
   - `GEMINI_API_KEY`: Your API key
   - `CATALOG_API_URL`: `https://api.studioxlowes.com/catalog/v3`

Note: SQLite data will not persist between Vercel deployments.

## API Reference

### Input Sets
- `GET /api/inputs` - List all input sets
- `POST /api/inputs` - Create input set
- `GET /api/inputs/[id]` - Get input set
- `PUT /api/inputs/[id]` - Update input set
- `DELETE /api/inputs/[id]` - Delete input set

### Prompts
- `GET /api/prompts` - List all templates
- `POST /api/prompts` - Create template
- `GET /api/prompts/[id]` - Get template
- `PUT /api/prompts/[id]` - Update template
- `DELETE /api/prompts/[id]` - Delete template

### Runs
- `GET /api/runs` - List all runs
- `POST /api/runs` - Create run
- `GET /api/runs/[id]` - Get run
- `POST /api/runs/[id]/execute` - Execute run
- `DELETE /api/runs/[id]` - Delete run

### Results
- `GET /api/results` - List results with filters
- `PATCH /api/results/[id]` - Update result (rating, notes, tags)

### Export
- `GET /api/export?format=json` - Export all rated results as JSON
- `GET /api/export?format=csv` - Export all rated results as CSV
- `GET /api/export?runId=[id]&format=json` - Export specific run

### Catalog
- `GET /api/catalog?category=...&search=...&page=...` - Search products

## Available Models

| Model ID | Name | Description |
|----------|------|-------------|
| `gemini-2.0-flash-exp-image-generation` | Nano Banana (Flash) | Fast image generation |
| `imagen-3.0-generate-002` | Imagen 3 | High-quality image generation |

## Aspect Ratios

- 1:1 (Square)
- 2:3, 3:2 (Portrait/Landscape)
- 3:4, 4:3 (Portrait/Landscape)
- 9:16, 16:9 (Vertical/Widescreen)

## Prompt Variables

Use these variables in your prompts:
- `{{product}}` or `{{products}}` - Replaced with product catalog information
- `{{previous_output}}` - In chains, references the previous step's output

## License

Studio Prompt Lab - Bond Studio Internal Tool
