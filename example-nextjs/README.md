# React Custom Cursor - Next.js SSR Example

This is a comprehensive Next.js example that showcases the **server-side rendering (SSR) capabilities** of `@yhattav/react-component-cursor` while demonstrating SEO best practices.

## 🌟 Features Demonstrated

### SSR & SEO
- ✅ **Full Server-Side Rendering** with Next.js App Router
- ✅ **SEO Optimization** with meta tags, Open Graph, and Twitter Cards
- ✅ **Structured Data** (JSON-LD) for better search engine understanding
- ✅ **Dynamic Sitemap** generation
- ✅ **Robots.txt** configuration
- ✅ **Performance Optimizations** for production builds

### Custom Cursor Showcase
- 🎯 **Multiple Cursor Modes**: Glow effect, emoji cursors, trail effects
- ⚡ **Interactive Demo Areas** with real-time cursor switching
- 🎨 **Beautiful UI** with Tailwind CSS and Framer Motion
- 📱 **Responsive Design** that works on all devices
- 🔧 **TypeScript Integration** with full type safety

## 🚀 Key SSR Benefits

1. **SEO Optimization**: Search engines can crawl and index the content
2. **Performance**: Initial page load with pre-rendered HTML
3. **Social Sharing**: Proper meta tags for social media previews
4. **Accessibility**: Content available without JavaScript

## 🛠️ Technical Implementation

### SSR Compatibility
The custom cursor library is designed to work seamlessly with SSR:

```tsx
// The cursor automatically handles SSR by returning null during server rendering
<CustomCursor>
  <div className="cursor-content">✨ Custom Cursor</div>
</CustomCursor>
```

### Key SSR Features:
- **Graceful Degradation**: Returns `null` during SSR
- **No Hydration Mismatches**: Prevents React hydration errors
- **Client-Side Activation**: Cursor activates after hydration
- **Performance Optimized**: Minimal impact on server-side bundle

## 📦 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation & Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Development Mode**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to see the result.

3. **Production Build**
   ```bash
   npm run build
   npm start
   ```

4. **Static Export** (for GitHub Pages)
   ```bash
   npm run export
   ```

## 🏗️ Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with SEO metadata
│   ├── page.tsx            # Main showcase page
│   ├── sitemap.ts          # Dynamic sitemap generation
│   ├── robots.ts           # SEO robots configuration
│   └── globals.css         # Global styles
├── components/             # Reusable components (future)
└── utils/                  # Utility functions (future)
```

## 🎯 Demo Features

### Interactive Cursor Modes
1. **Glow Effect**: Gradient background with blur effect
2. **Emoji Cursor**: Customizable emoji with selection palette  
3. **Trail Effect**: Animated trailing cursor with ping effect
4. **Default**: Standard browser cursor

### Real-time Interaction
- Switch between cursor modes instantly
- Hover effects on interactive areas
- Smooth animations with Framer Motion
- Performance monitoring in development mode

## 🔧 Configuration

### Next.js Configuration
The project is configured for optimal SSR and deployment:

```typescript
// next.config.ts
const nextConfig = {
  output: 'export',           // Static export for GitHub Pages
  basePath: '/react-component-cursor',
  trailingSlash: true,
  images: { unoptimized: true },
  experimental: { optimizeCss: true },
}
```

### SEO Configuration
Comprehensive SEO setup in `layout.tsx`:
- Meta tags with keywords and descriptions
- Open Graph tags for social sharing
- Twitter Card optimization
- JSON-LD structured data
- Canonical URLs

## 📊 Performance Features

### Build Optimizations
- **Tree Shaking**: Unused code elimination
- **Bundle Splitting**: Optimal code splitting
- **CSS Optimization**: Minimal CSS footprint
- **Image Optimization**: Optimized static assets

### Runtime Performance
- **Smooth Animations**: 60fps cursor tracking
- **Memory Efficiency**: Optimized event handling
- **Throttling Support**: Configurable performance throttling

## 🚀 Deployment

### GitHub Pages
This example is configured for GitHub Pages deployment:

```bash
npm run deploy
```

The build creates an optimized static export that can be deployed to any static hosting provider.

### Other Platforms
- **Vercel**: Deploy with zero configuration
- **Netlify**: Drag and drop the `out` folder
- **AWS S3**: Upload static files to S3 bucket

## 🧪 Testing SSR

To verify SSR is working correctly:

1. **View Page Source**: Right-click → "View Page Source"
2. **Check for Content**: HTML should contain the full page content
3. **Disable JavaScript**: Page should still display content
4. **Network Tab**: Initial response should include rendered HTML

## 📈 SEO Benefits

This example demonstrates real-world SEO benefits:

- **Search Engine Visibility**: Content crawlable by search engines
- **Social Media Sharing**: Rich previews on platforms
- **Performance Scores**: High Lighthouse scores
- **Accessibility**: Screen reader compatible
- **Mobile Optimization**: Responsive design

## 🔗 Related Links

- **Main Library**: [@yhattav/react-component-cursor](https://www.npmjs.com/package/@yhattav/react-component-cursor)
- **Documentation**: [Library Docs](https://yhattav.github.io/react-component-cursor)
- **Vite Example**: [../example](../example)
- **GitHub Repository**: [Source Code](https://github.com/yhattav/react-component-cursor)

## 📝 License

This example is part of the `@yhattav/react-component-cursor` project and follows the same MIT license.

---

**Built with ❤️ to showcase SSR capabilities and promote the React Custom Cursor library**
