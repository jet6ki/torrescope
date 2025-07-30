# Torre Radar 🎯

A Next.js 14 application that visualizes Torre.ai user skills as interactive radar charts with percentile comparisons.

## Features

- **Interactive Skill Radar**: Visualize any Torre user's skills as a radar chart
- **Percentile Analysis**: Compare skills against global Torre population
- **Compare Mode**: Overlay two users' radars for direct comparison
- **Shareable URLs**: `/radar/{usernameA}+{usernameB}` for easy sharing
- **Export to PNG**: Save radar charts as images
- **Dark/Light Mode**: Toggle between themes
- **Responsive Design**: Mobile-friendly with adaptive layouts
- **Real-time Search**: Debounced search with instant results

## Tech Stack

- **Next.js 14** with App Router
- **TypeScript** for type safety
- **TailwindCSS** for styling
- **Recharts** for radar visualization
- **React Query** for data fetching & caching
- **Zustand** for state management
- **Edge Runtime** for optimized API routes
- **React Hot Toast** for notifications

## Quick Start

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Open http://localhost:3000
```

## Project Structure

```
torre-radar/
├── app/
│   ├── layout.tsx              # Root layout with theme provider
│   ├── page.tsx                # Landing page with search
│   ├── globals.css             # Global styles and CSS variables
│   ├── radar/[...slugs]/       # Dynamic radar comparison pages
│   └── api/genome/[username]/  # Edge API route for Torre data
├── components/
│   ├── SkillRadar.tsx          # Main radar chart component
│   ├── SearchBar.tsx           # Debounced search input
│   ├── CompareDropzone.tsx     # JSON upload for comparisons
│   └── ThemeToggle.tsx         # Dark/light mode switcher
├── lib/
│   ├── api.ts                  # Torre API client functions
│   ├── computePercentile.ts    # Skill percentile calculations
│   └── utils.ts                # Utility functions
└── types/
    └── torre.ts                # TypeScript interfaces
```

## API Routes

### GET `/api/genome/{username}`

Proxies Torre.ai genome data and computes percentiles.

**Response Format:**
```json
{
  "username": "johndoe",
  "skills": [
    {
      "name": "JavaScript",
      "proficiency": 4.5,
      "percentile": 85
    }
  ]
}
```

## Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

## Deployment

### Vercel (Recommended)

```bash
# Deploy to Vercel
npx vercel

# Set environment variables in Vercel dashboard
```

### Docker

```bash
# Build image
docker build -t torre-radar .

# Run container
docker run -p 3000:3000 torre-radar
```

## Usage Examples

### Basic Search
1. Enter any Torre username in the search bar
2. View their skill radar with percentile coloring:
   - Gray: <50th percentile
   - Sky: 50-79th percentile  
   - Emerald: 80-95th percentile
   - Amber: 96-100th percentile

### Compare Mode
1. Search for first user
2. Click "Add Comparison" 
3. Enter second username or upload JSON genome
4. View overlaid semi-transparent radars

### Sharing
- Copy URL from browser: `/radar/user1+user2`
- Export PNG using the export button
- Share on social media with auto-generated meta tags

## Development

```bash
# Type checking
pnpm type-check

# Linting
pnpm lint
pnpm lint:fix

# Formatting
pnpm format
pnpm format:check

# Build for production
pnpm build
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

MIT License - see [LICENSE](LICENSE) file for details.

## LLM/AI Usage Documentation

All prompts used during development are documented in [PROMPTS.md](./PROMPTS.md).

## Acknowledgments

- [Torre.ai](https://torre.ai) for providing the genome API
- [Recharts](https://recharts.org) for beautiful charts
- [Vercel](https://vercel.com) for hosting platform