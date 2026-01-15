import * as React from 'react';
import { CustomCursor } from './CustomCursor';
import { isSSR } from './utils/ssr';

type SpotlightMode = 'border' | 'inner' | 'outer' | 'fill';

type GradientConfig = {
  type: 'radial' | 'conic' | 'linear';
  colors: string[];
  angle?: number;
};

export interface CursorSpotlightProps {
  children: React.ReactNode;
  
  mode?: SpotlightMode;
  glowColor?: string;
  gradient?: GradientConfig;
  glowRadius?: number;
  glowIntensity?: number;
  borderWidth?: number;
  
  smoothness?: number;
  
  inheritBorderRadius?: boolean;
  customBorderRadius?: string;
  
  disabled?: boolean;
  
  className?: string;
  style?: React.CSSProperties;
  overlayClassName?: string;
  overlayStyle?: React.CSSProperties;
  
  debug?: boolean;
}

interface InheritedRadius {
  topLeft: string;
  topRight: string;
  bottomLeft: string;
  bottomRight: string;
}

const DEFAULT_GLOW_COLOR = 'rgba(168, 85, 247, 0.9)';
const DEFAULT_GLOW_RADIUS = 200;
const DEFAULT_GLOW_INTENSITY = 1;
const DEFAULT_BORDER_WIDTH = 2;
const DEFAULT_SMOOTHNESS = 10;

function parseRadius(radius: InheritedRadius): string {
  return `${radius.topLeft} ${radius.topRight} ${radius.bottomRight} ${radius.bottomLeft}`;
}

function getEffectiveColor(
  glowColor: string | undefined,
  gradient: GradientConfig | undefined,
  cursorX: number,
  cursorY: number
): string {
  if (gradient) {
    const colors = gradient.colors.join(', ');
    switch (gradient.type) {
      case 'conic':
        return `conic-gradient(from ${gradient.angle ?? 0}deg at ${cursorX}px ${cursorY}px, ${colors})`;
      case 'linear':
        return `linear-gradient(${gradient.angle ?? 90}deg, ${colors})`;
      case 'radial':
      default:
        return `radial-gradient(circle at ${cursorX}px ${cursorY}px, ${colors})`;
    }
  }
  return glowColor ?? DEFAULT_GLOW_COLOR;
}

function getBoxShadowForMode(
  mode: SpotlightMode,
  color: string,
  intensity: number,
  borderWidth: number
): string {
  const blur = Math.round(20 * intensity);
  const spread = Math.round(5 * intensity);
  
  switch (mode) {
    case 'border':
      return `inset 0 0 0 ${borderWidth}px ${color}`;
    case 'inner':
      return `inset 0 0 ${blur}px ${spread}px ${color}`;
    case 'outer':
      return `0 0 ${blur}px ${spread}px ${color}`;
    case 'fill':
      return `inset 0 0 ${blur * 3}px ${spread * 10}px ${color}`;
    default:
      return `inset 0 0 0 ${borderWidth}px ${color}`;
  }
}

function getBackgroundForMode(
  mode: SpotlightMode,
  color: string,
  isGradient: boolean
): React.CSSProperties {
  if (mode === 'fill' && isGradient) {
    return {
      background: color,
      opacity: 0.3,
    };
  }
  return {};
}

export const CursorSpotlight: React.FC<CursorSpotlightProps> = ({
  children,
  mode = 'border',
  glowColor,
  gradient,
  glowRadius = DEFAULT_GLOW_RADIUS,
  glowIntensity = DEFAULT_GLOW_INTENSITY,
  borderWidth = DEFAULT_BORDER_WIDTH,
  smoothness = DEFAULT_SMOOTHNESS,
  inheritBorderRadius = true,
  customBorderRadius,
  disabled = false,
  className = '',
  style = {},
  overlayClassName = '',
  overlayStyle = {},
  debug = false,
}) => {
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const childContainerRef = React.useRef<HTMLDivElement>(null);
  
  const [cursorPos, setCursorPos] = React.useState<{ x: number; y: number } | null>(null);
  const [inheritedRadius, setInheritedRadius] = React.useState<InheritedRadius>({
    topLeft: '0px',
    topRight: '0px',
    bottomLeft: '0px',
    bottomRight: '0px',
  });
  const [childOffset, setChildOffset] = React.useState<{ 
    top: number; 
    left: number; 
    width: number; 
    height: number;
  } | null>(null);

  React.useEffect(() => {
    if (isSSR() || !childContainerRef.current || !wrapperRef.current) return;

    const detectStyles = () => {
      const childElement = childContainerRef.current?.firstElementChild as HTMLElement;
      const wrapperElement = wrapperRef.current;
      if (!childElement || !wrapperElement) return;

      // Calculate child's position relative to wrapper
      const childRect = childElement.getBoundingClientRect();
      const wrapperRect = wrapperElement.getBoundingClientRect();
      
      setChildOffset({
        top: childRect.top - wrapperRect.top,
        left: childRect.left - wrapperRect.left,
        width: childRect.width,
        height: childRect.height,
      });

      if (inheritBorderRadius && !customBorderRadius) {
        const computed = getComputedStyle(childElement);
        setInheritedRadius({
          topLeft: computed.borderTopLeftRadius || '0px',
          topRight: computed.borderTopRightRadius || '0px',
          bottomLeft: computed.borderBottomLeftRadius || '0px',
          bottomRight: computed.borderBottomRightRadius || '0px',
        });
      }
    };

    detectStyles();

    const resizeObserver = new ResizeObserver(detectStyles);
    const childElement = childContainerRef.current?.firstElementChild;
    if (childElement) {
      resizeObserver.observe(childElement);
    }

    return () => resizeObserver.disconnect();
  }, [inheritBorderRadius, customBorderRadius, children]);

  const handleCursorMove = React.useCallback((position: { x: number; y: number }) => {
    const rect = wrapperRef.current?.getBoundingClientRect();
    if (!rect) return;
    setCursorPos({ x: position.x - rect.left, y: position.y - rect.top });
  }, []);

  const hasValidCursor = cursorPos !== null && !disabled;
  const isGradient = !!gradient;
  
  const effectiveRadius = customBorderRadius ?? parseRadius(inheritedRadius);
  const effectiveColor = hasValidCursor
    ? getEffectiveColor(glowColor, gradient, cursorPos.x, cursorPos.y)
    : DEFAULT_GLOW_COLOR;

  const overlayStyles: React.CSSProperties = React.useMemo(() => {
    if (!hasValidCursor || !childOffset) return {};

    const boxShadow = isGradient && mode !== 'fill'
      ? getBoxShadowForMode(mode, glowColor ?? DEFAULT_GLOW_COLOR, glowIntensity, borderWidth)
      : getBoxShadowForMode(mode, effectiveColor, glowIntensity, borderWidth);

    const backgroundStyles = getBackgroundForMode(mode, effectiveColor, isGradient);

    // Calculate cursor position relative to the child element (not wrapper)
    const childRelativeCursorX = (cursorPos?.x ?? 0) - childOffset.left;
    const childRelativeCursorY = (cursorPos?.y ?? 0) - childOffset.top;

    return {
      position: 'absolute' as const,
      top: childOffset.top,
      left: childOffset.left,
      width: childOffset.width,
      height: childOffset.height,
      pointerEvents: 'none' as const,
      borderRadius: effectiveRadius,
      boxShadow,
      ...backgroundStyles,
      maskImage: `radial-gradient(circle ${glowRadius}px at ${childRelativeCursorX}px ${childRelativeCursorY}px, black 0%, transparent 70%)`,
      WebkitMaskImage: `radial-gradient(circle ${glowRadius}px at ${childRelativeCursorX}px ${childRelativeCursorY}px, black 0%, transparent 70%)`,
      zIndex: 10,
      ...overlayStyle,
    };
  }, [
    hasValidCursor,
    cursorPos,
    childOffset,
    effectiveRadius,
    effectiveColor,
    mode,
    glowRadius,
    glowIntensity,
    borderWidth,
    isGradient,
    glowColor,
    overlayStyle,
  ]);

  const wrapperStyles: React.CSSProperties = React.useMemo(() => ({
    position: 'relative' as const,
    display: 'inline-flex',
    verticalAlign: 'middle',
    '--spotlight-x': hasValidCursor ? `${cursorPos?.x ?? 0}px` : '0px',
    '--spotlight-y': hasValidCursor ? `${cursorPos?.y ?? 0}px` : '0px',
    ...style,
  }), [hasValidCursor, cursorPos, style]);

  if (isSSR()) {
    return <>{children}</>;
  }

  return (
    <div
      ref={wrapperRef}
      className={className}
      style={wrapperStyles}
    >
      <div 
        ref={childContainerRef} 
        style={{ 
          display: 'contents',
          // Force the child to inherit the parent's sizing context
        }}
      >
        {children}
      </div>

      {hasValidCursor && childOffset && (
        <div
          className={overlayClassName}
          style={overlayStyles}
          aria-hidden="true"
        />
      )}

      {debug && (
        <div
          style={{
            position: 'absolute',
            bottom: -30,
            left: 0,
            fontSize: 10,
            color: 'white',
            background: 'rgba(0,0,0,0.7)',
            padding: '2px 4px',
            borderRadius: 2,
            pointerEvents: 'none',
            zIndex: 100,
            whiteSpace: 'nowrap',
          }}
        >
          pos: {cursorPos ? `${Math.round(cursorPos.x)}, ${Math.round(cursorPos.y)}` : 'null'} | 
          child: {childOffset ? `${Math.round(childOffset.width)}x${Math.round(childOffset.height)} @ ${Math.round(childOffset.left)},${Math.round(childOffset.top)}` : 'null'}
        </div>
      )}

      {/* Track globally like AnimatedGrid - no containerRef */}
      <CustomCursor
        smoothness={smoothness}
        onMove={handleCursorMove}
        style={{ opacity: 0 }}
        showDevIndicator={false}
      />
    </div>
  );
};

CursorSpotlight.displayName = 'CursorSpotlight';

export default CursorSpotlight;
