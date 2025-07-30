# LLM/AI Usage Documentation

This document contains all prompts used during the development of Torre Radar. As a beginner developer, I relied heavily on AI assistance to learn best practices, debug issues, and implement features correctly.

## Project Setup & Architecture

### Initial Project Setup
**Tool:** Cursor  
**Model:** Claude-3.5-Sonnet  
**Prompt:** I need to create a Next.js 14 application that uses Torre.ai API to display user skills as radar charts. Help me set up the project structure with TypeScript, TailwindCSS, and proper folder organization. I want to follow modern React patterns and best practices.

### API Route Structure
**Tool:** ChatGPT  
**Model:** GPT-4o  
**Prompt:** How do I create API routes in Next.js 14 App Router? I need to proxy requests to Torre.ai API endpoints. Show me the proper way to handle errors, add CORS headers, and implement caching for better performance.

### TypeScript Types Setup
**Tool:** Cursor  
**Model:** Claude-3.5-Sonnet  
**Prompt:** Help me create TypeScript interfaces for Torre.ai API responses. I need types for the genome endpoint response including person data, skills, and experiences. Make sure the types are properly structured and reusable.

## Core Features Implementation

### Search Functionality
**Tool:** ChatGPT  
**Model:** GPT-4o  
**Prompt:** I want to implement a search bar that queries Torre.ai people search API. The search should be debounced, show suggestions as you type, and handle loading states. How do I implement this with React Query and proper error handling?

### Radar Chart Implementation
**Tool:** Cursor  
**Model:** Claude-3.5-Sonnet  
**Prompt:** I need to create a skill radar chart using Recharts library. The chart should display user skills with different colors based on percentile ranges (gray <50%, sky 50-79%, emerald 80-95%, amber 96-100%). Help me implement this with proper responsive design.

### Percentile Calculation
**Tool:** ChatGPT  
**Model:** GPT-4o  
**Prompt:** I need to calculate skill percentiles for Torre users. Given a skill proficiency value (0-5), how do I compute what percentile this represents compared to the global Torre population? I want to create realistic percentile distributions.

## UI/UX Improvements

### Theme Implementation
**Tool:** Cursor  
**Model:** Claude-3.5-Sonnet  
**Prompt:** Help me implement dark/light mode toggle using next-themes. I want smooth transitions between themes and proper color schemes that work well with TailwindCSS. The theme should persist across page reloads.

### Loading States
**Tool:** ChatGPT  
**Model:** GPT-4o  
**Prompt:** What's the best way to implement loading skeletons in React? I need loading states for my radar charts, user profiles, and search results. Show me how to create reusable skeleton components with TailwindCSS.

### Responsive Design
**Tool:** Cursor  
**Model:** Claude-3.5-Sonnet  
**Prompt:** My radar charts don't look good on mobile devices. Help me make the entire application responsive. I need the charts to resize properly and the layout to adapt to different screen sizes.

## Advanced Features

### Comparison Mode
**Tool:** ChatGPT  
**Model:** GPT-4o  
**Prompt:** I want to add a feature where users can compare two Torre profiles side by side. The radar charts should overlay with different colors and transparency. How do I implement this state management and URL routing for shareable comparison links?

### Export Functionality
**Tool:** Cursor  
**Model:** Claude-3.5-Sonnet  
**Prompt:** How can I add an export feature that saves the radar chart as a PNG image? I want users to be able to download their skill visualization. Show me how to implement this using html2canvas or similar libraries.

### URL Routing for Comparisons
**Tool:** ChatGPT  
**Model:** GPT-4o  
**Prompt:** I need to implement shareable URLs like /radar/user1+user2 for skill comparisons. How do I set up dynamic routing in Next.js 14 App Router to handle this pattern and parse the usernames correctly?

## Debugging & Problem Solving

### API Error Handling
**Tool:** ChatGPT  
**Model:** GPT-4o  
**Prompt:** I'm getting inconsistent responses from Torre.ai API. Sometimes users exist but return empty skill arrays, other times I get 404 errors for valid usernames. Help me implement robust error handling with proper user feedback and retry logic.

### React Query Caching Issues
**Tool:** Cursor  
**Model:** Claude-3.5-Sonnet  
**Prompt:** My React Query cache isn't working as expected. When I search for the same user multiple times, it makes new API calls instead of using cached data. Help me configure proper cache settings and stale time for better performance.

### Chart Rendering Problems
**Tool:** ChatGPT  
**Model:** GPT-4o  
**Prompt:** My Recharts radar chart sometimes doesn't render properly on first load. The data is there but the chart appears empty until I resize the window. How do I fix this rendering issue and ensure the chart displays correctly on initial load?

### TypeScript Errors
**Tool:** Cursor  
**Model:** Claude-3.5-Sonnet  
**Prompt:** I'm getting TypeScript errors when trying to access nested properties from Torre API responses. The data structure is complex and sometimes optional. Help me create proper type guards and safe property access patterns.

## Performance Optimization

### Bundle Size Optimization
**Tool:** ChatGPT  
**Model:** GPT-4o  
**Prompt:** My Next.js bundle is getting large. How can I optimize it? I'm using Recharts, Framer Motion, and several UI libraries. Show me how to implement code splitting and reduce bundle size without losing functionality.

### API Response Caching
**Tool:** Cursor  
**Model:** Claude-3.5-Sonnet  
**Prompt:** I want to implement proper caching for Torre API responses. Help me set up cache headers in my API routes and implement stale-while-revalidate patterns for better user experience.

## Deployment & Production

### Vercel Deployment Setup
**Tool:** ChatGPT  
**Model:** GPT-4o  
**Prompt:** How do I deploy my Next.js application to Vercel? I need to set up environment variables, configure build settings, and ensure my API routes work correctly in production. What are the best practices for Next.js deployment?

### Environment Configuration
**Tool:** Cursor  
**Model:** Claude-3.5-Sonnet  
**Prompt:** Help me set up proper environment variable management for development and production. I need to configure Torre API base URLs and other settings that differ between environments.

### SEO and Meta Tags
**Tool:** ChatGPT  
**Model:** GPT-4o  
**Prompt:** I want to improve SEO for my Torre Radar application. Help me implement proper meta tags, Open Graph images, and Twitter cards. The app should have good social media sharing previews.

## Learning & Best Practices

### Code Organization
**Tool:** Cursor  
**Model:** Claude-3.5-Sonnet  
**Prompt:** As a beginner, I want to make sure my code is well-organized and follows React best practices. Review my component structure and suggest improvements for better maintainability and readability.

### Error Boundary Implementation
**Tool:** ChatGPT  
**Model:** GPT-4o  
**Prompt:** I learned about React Error Boundaries but I'm not sure how to implement them properly in Next.js 14. Help me create error boundaries that gracefully handle component crashes and provide good user feedback.

### Testing Strategy
**Tool:** Cursor  
**Model:** Claude-3.5-Sonnet  
**Prompt:** I want to add basic testing to my application but I'm new to testing React components. What testing strategy would you recommend for a beginner? Show me how to test my API routes and key components.

---

## Reflection

This project was a significant learning experience. As a beginner, I relied heavily on AI assistance to:

1. **Learn modern React patterns** - Understanding hooks, state management, and component composition
2. **Implement complex features** - Radar charts, data visualization, and API integration
3. **Debug issues** - Solving TypeScript errors, API problems, and rendering issues
4. **Follow best practices** - Code organization, error handling, and performance optimization
5. **Deploy to production** - Understanding deployment processes and environment management

The AI tools helped me bridge the gap between my current knowledge and the requirements of building a production-ready application. Each prompt was a learning opportunity that helped me understand not just the "how" but also the "why" behind different implementation choices.
