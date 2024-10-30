# React Component Cursor

A flexible and customizable React component for creating smooth, interactive custom cursors. This library allows you to replace the default cursor with any React component, supporting both global and container-specific cursor behaviors.

## Features

- 🎯 Use any React component as a cursor
- 🔄 Smooth cursor movement with configurable smoothing
- 📦 Container-specific cursors
- 🎨 Fully customizable styling
- ⚡ Lightweight (<10KB)
- 🔧 TypeScript support
- 📱 Zero dependencies (except React)

## Installation

```bash
npm install react-component-cursor
or
yarn add react-component-cursor
```
## Basic Usage


```tsx
import { CustomCursor } from 'react-component-cursor';
function App() {
return (
<div style={{ cursor: 'none' }}>
<CustomCursor>
<div style={{
width: '20px',
height: '20px',
backgroundColor: '#3b82f6',
borderRadius: '50%',
transform: 'translate(-50%, -50%)'
}} />
</CustomCursor>
{/ Your app content /}
</div>
);
}
```
## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | The component to use as cursor |
| `className` | `string` | `''` | Additional CSS classes |
| `style` | `CSSProperties` | `{}` | Additional inline styles |
| `offsetX` | `number` | `0` | Horizontal offset from cursor position |
| `offsetY` | `number` | `0` | Vertical offset from cursor position |
| `zIndex` | `number` | `9999` | Z-index of the cursor element |
| `smoothFactor` | `number` | `1` | Movement smoothing (1 = no smoothing, higher = smoother) |
| `containerRef` | `RefObject<HTMLElement>` | - | Reference to container element for bounded cursor |
| `onMove` | `(x: number, y: number) => void` | - | Callback fired on cursor movement |

## Advanced Usage

### Container-Specific Cursor

```tsx
function ContainerExample() {
const containerRef = useRef<HTMLDivElement>(null);
return (
<div
ref={containerRef}
style={{
position: 'relative',
cursor: 'none'
}}
>
<CustomCursor
containerRef={containerRef}
smoothFactor={2}
>
<div style={{
width: '40px',
height: '40px',
border: '2px solid #ef4444',
borderRadius: '50%',
transform: 'translate(-50%, -50%)'
}} />
</CustomCursor>
{/ Container content /}
</div>
);
}
```

### Interactive Cursor

```tsx
function InteractiveCursor() {
const [isHovered, setIsHovered] = useState(false);
return (
<div style={{ cursor: 'none' }}>
<CustomCursor>
<div style={{
width: isHovered ? '60px' : '20px',
height: isHovered ? '60px' : '20px',
backgroundColor: '#3b82f6',
borderRadius: '50%',
transform: 'translate(-50%, -50%)',
transition: 'all 0.2s ease'
}} />
</CustomCursor>
<button
onMouseEnter={() => setIsHovered(true)}
onMouseLeave={() => setIsHovered(false)}
>
Hover me!
</button>
</div>
);
}
```

## Development

This project was bootstrapped with [TSDX](https://github.com/jaredpalmer/tsdx).

```bash
Install dependencies
npm install
Start development server
npm start
Run tests
npm test
Build for production
npm run build
Run Storybook
npm run storybook
```
## License

MIT © [yhattav](https://github.com/yhattav)