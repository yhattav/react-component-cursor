'use client';

import * as React from 'react';
import { CustomCursor } from './CustomCursor';
import { isSSR } from './utils/ssr';

/**
 * Animation mode for the light effect:
 * - 'border': Light travels exactly on the border/edge
 * - 'inner': Light glows inward from the border
 * - 'outer': Light glows outward from the border
 * - 'both': Light glows both inward and outward
 */
type AnimatedBorderMode = 'border' | 'inner' | 'outer' | 'both';

/**
 * Direction of light travel around the perimeter
 */
type AnimationDirection = 'clockwise' | 'counterclockwise';

/**
 * Trigger mode for when the effect is visible:
 * - 'always': Effect is always visible and animating
 * - 'hover': Effect only visible when cursor is inside the element
 * - 'proximity': Effect visible when cursor is within proximityRadius of the element
 */
type TriggerMode = 'always' | 'hover' | 'proximity';

export interface AnimatedBorderProps {
  /** Content to wrap with animated border effect */
  children: React.ReactNode;

  /** Animation mode controlling glow direction */
  mode?: AnimatedBorderMode;

  /** Color of the animated light (CSS color string) */
  color?: string;

  /** Secondary color for gradient effect (optional) */
  secondaryColor?: string;

  /** Size of the glowing light in pixels */
  lightSize?: number;

  /** Blur radius for the glow effect in pixels */
  glowBlur?: number;

  /** Duration of one complete animation cycle in milliseconds */
  duration?: number;

  /** Direction of the light animation */
  direction?: AnimationDirection;

  /** Border width when using border mode */
  borderWidth?: number;

  /** Border radius to match the child element (CSS string or inherit) */
  borderRadius?: string | 'inherit';

  /** Whether to pause the animation */
  paused?: boolean;

  /** Disable the effect entirely */
  disabled?: boolean;

  /** 
   * When the effect should be visible:
   * - 'always': Always visible (default)
   * - 'hover': Only when cursor is inside the element
   * - 'proximity': When cursor is within proximityRadius distance
   */
  trigger?: TriggerMode;

  /** 
   * Distance in pixels from the element edge at which the effect becomes visible.
   * Only used when trigger='proximity'. Default: 150
   */
  proximityRadius?: number;

  /** 
   * Smoothness of cursor tracking (1-100). Higher = smoother but more latency.
   * Only used when trigger='hover' or 'proximity'. Default: 5
   */
  cursorSmoothness?: number;

  /** Additional className for the wrapper */
  className?: string;

  /** Additional styles for the wrapper */
  style?: React.CSSProperties;

  /** Show debug indicators */
  debug?: boolean;
}

interface Dimensions {
  width: number;
  height: number;
}

interface Position {
  x: number;
  y: number;
}

/**
 * Hook to animate a light position around the perimeter of a rectangle
 */
function usePerimeterAnimation(
  dimensions: Dimensions,
  duration: number,
  paused: boolean,
  direction: AnimationDirection
): Position {
  const [position, setPosition] = React.useState<Position>({ x: 0, y: 0 });
  const animationRef = React.useRef<number | null>(null);
  const startTimeRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    if (paused || dimensions.width === 0 || dimensions.height === 0) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      return;
    }

    const { width, height } = dimensions;
    const perimeter = 2 * (width + height);

    const animate = (timestamp: DOMHighResTimeStamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;

      let progress = (elapsed % duration) / duration;
      if (direction === 'counterclockwise') {
        progress = 1 - progress;
      }

      const currentPosition = progress * perimeter;

      let x = 0;
      let y = 0;

      if (currentPosition < width) {
        x = currentPosition;
        y = 0;
      } else if (currentPosition < width + height) {
        x = width;
        y = currentPosition - width;
      } else if (currentPosition < 2 * width + height) {
        x = width - (currentPosition - (width + height));
        y = height;
      } else {
        x = 0;
        y = height - (currentPosition - (2 * width + height));
      }

      setPosition({ x, y });
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      startTimeRef.current = null;
    };
  }, [dimensions.width, dimensions.height, duration, paused, direction]);

  return position;
}

/**
 * Calculate distance from cursor to element edge (negative if inside)
 */
function calculateDistanceToElement(
  cursorX: number,
  cursorY: number,
  elementRect: DOMRect
): number {
  const { left, top, right, bottom } = elementRect;

  const closestX = Math.max(left, Math.min(cursorX, right));
  const closestY = Math.max(top, Math.min(cursorY, bottom));

  const distanceX = cursorX - closestX;
  const distanceY = cursorY - closestY;

  const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

  const isInside = cursorX >= left && cursorX <= right && cursorY >= top && cursorY <= bottom;

  return isInside ? -1 : distance;
}

/**
 * Generate the gradient/glow style based on mode and position
 */
function generateGlowStyles(
  mode: AnimatedBorderMode,
  position: Position,
  color: string,
  secondaryColor: string | undefined,
  lightSize: number,
  glowBlur: number,
  borderWidth: number,
  opacity: number
): React.CSSProperties {
  const gradientColor = secondaryColor
    ? `${color}, ${secondaryColor}`
    : `${color}, transparent`;

  const gradient = `radial-gradient(circle ${lightSize}px at ${position.x}px ${position.y}px, ${gradientColor})`;

  const baseStyles: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    zIndex: 1,
    transition: 'opacity 0.2s ease-out',
    opacity,
  };

  switch (mode) {
    case 'border':
      return {
        ...baseStyles,
        background: gradient,
        maskImage: `
          linear-gradient(#fff 0 0) content-box, 
          linear-gradient(#fff 0 0)
        `,
        maskComposite: 'exclude',
        WebkitMaskComposite: 'xor',
        padding: `${borderWidth}px`,
        filter: `blur(${glowBlur * 0.5}px)`,
      };

    case 'inner':
      return {
        ...baseStyles,
        background: gradient,
        maskImage: `radial-gradient(circle ${lightSize * 1.5}px at ${position.x}px ${position.y}px, black 0%, transparent 70%)`,
        WebkitMaskImage: `radial-gradient(circle ${lightSize * 1.5}px at ${position.x}px ${position.y}px, black 0%, transparent 70%)`,
        filter: `blur(${glowBlur}px)`,
        opacity: opacity * 0.8,
      };

    case 'outer':
      return {
        ...baseStyles,
        inset: `-${lightSize / 2}px`,
        background: gradient,
        maskImage: `
          radial-gradient(circle ${lightSize}px at calc(${position.x}px + ${lightSize / 2}px) calc(${position.y}px + ${lightSize / 2}px), black 0%, transparent 70%)
        `,
        WebkitMaskImage: `
          radial-gradient(circle ${lightSize}px at calc(${position.x}px + ${lightSize / 2}px) calc(${position.y}px + ${lightSize / 2}px), black 0%, transparent 70%)
        `,
        filter: `blur(${glowBlur}px)`,
        opacity: opacity * 0.9,
      };

    case 'both':
      return {
        ...baseStyles,
        inset: `-${lightSize / 4}px`,
        background: gradient,
        maskImage: `radial-gradient(circle ${lightSize * 1.2}px at calc(${position.x}px + ${lightSize / 4}px) calc(${position.y}px + ${lightSize / 4}px), black 0%, transparent 60%)`,
        WebkitMaskImage: `radial-gradient(circle ${lightSize * 1.2}px at calc(${position.x}px + ${lightSize / 4}px) calc(${position.y}px + ${lightSize / 4}px), black 0%, transparent 60%)`,
        filter: `blur(${glowBlur}px)`,
        opacity: opacity * 0.85,
      };

    default:
      return baseStyles;
  }
}

const DEFAULT_COLOR = 'rgba(168, 85, 247, 1)';
const DEFAULT_LIGHT_SIZE = 100;
const DEFAULT_GLOW_BLUR = 15;
const DEFAULT_DURATION = 3000;
const DEFAULT_BORDER_WIDTH = 2;
const DEFAULT_PROXIMITY_RADIUS = 150;
const DEFAULT_CURSOR_SMOOTHNESS = 5;

export const AnimatedBorder: React.FC<AnimatedBorderProps> = ({
  children,
  mode = 'border',
  color = DEFAULT_COLOR,
  secondaryColor,
  lightSize = DEFAULT_LIGHT_SIZE,
  glowBlur = DEFAULT_GLOW_BLUR,
  duration = DEFAULT_DURATION,
  direction = 'clockwise',
  borderWidth = DEFAULT_BORDER_WIDTH,
  borderRadius = 'inherit',
  paused = false,
  disabled = false,
  trigger = 'always',
  proximityRadius = DEFAULT_PROXIMITY_RADIUS,
  cursorSmoothness = DEFAULT_CURSOR_SMOOTHNESS,
  className = '',
  style = {},
  debug = false,
}) => {
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const childContainerRef = React.useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = React.useState<Dimensions>({ width: 0, height: 0 });
  const [inheritedRadius, setInheritedRadius] = React.useState<string>('0px');
  const [effectOpacity, setEffectOpacity] = React.useState<number>(trigger === 'always' ? 1 : 0);
  const [cursorDistance, setCursorDistance] = React.useState<number>(Infinity);

  React.useEffect(() => {
    if (isSSR() || !wrapperRef.current) return;

    const updateDimensions = () => {
      if (wrapperRef.current) {
        const rect = wrapperRef.current.getBoundingClientRect();
        setDimensions({
          width: rect.width,
          height: rect.height,
        });
      }
    };

    updateDimensions();

    const resizeObserver = new ResizeObserver(updateDimensions);
    resizeObserver.observe(wrapperRef.current);

    return () => resizeObserver.disconnect();
  }, []);

  React.useEffect(() => {
    if (isSSR() || !childContainerRef.current || borderRadius !== 'inherit') return;

    const detectRadius = () => {
      const childElement = childContainerRef.current?.firstElementChild as HTMLElement;
      if (!childElement) return;

      const computed = getComputedStyle(childElement);
      setInheritedRadius(computed.borderRadius || '0px');
    };

    detectRadius();

    const resizeObserver = new ResizeObserver(detectRadius);
    const childElement = childContainerRef.current?.firstElementChild;
    if (childElement) {
      resizeObserver.observe(childElement);
    }

    return () => resizeObserver.disconnect();
  }, [borderRadius, children]);

  const handleCursorMove = React.useCallback((position: Position) => {
    if (trigger === 'always' || !wrapperRef.current) return;

    const rect = wrapperRef.current.getBoundingClientRect();
    const distance = calculateDistanceToElement(position.x, position.y, rect);
    setCursorDistance(distance);

    if (trigger === 'hover') {
      setEffectOpacity(distance < 0 ? 1 : 0);
    } else if (trigger === 'proximity') {
      if (distance < 0) {
        setEffectOpacity(1);
      } else if (distance <= proximityRadius) {
        const normalizedDistance = 1 - (distance / proximityRadius);
        setEffectOpacity(normalizedDistance);
      } else {
        setEffectOpacity(0);
      }
    }
  }, [trigger, proximityRadius]);

  const handleVisibilityChange = React.useCallback((isVisible: boolean) => {
    if (trigger === 'always') return;
    if (!isVisible) {
      setEffectOpacity(0);
      setCursorDistance(Infinity);
    }
  }, [trigger]);

  const lightPosition = usePerimeterAnimation(
    dimensions,
    duration,
    paused || disabled || effectOpacity === 0,
    direction
  );

  const effectiveRadius = borderRadius === 'inherit' ? inheritedRadius : borderRadius;

  if (isSSR()) {
    return <>{children}</>;
  }

  const wrapperStyles: React.CSSProperties = {
    position: 'relative',
    display: 'inline-block',
    ...style,
  };

  const glowStyles = disabled
    ? {}
    : generateGlowStyles(
        mode,
        lightPosition,
        color,
        secondaryColor,
        lightSize,
        glowBlur,
        borderWidth,
        effectOpacity
      );

  const needsCursorTracking = trigger !== 'always';

  return (
    <div
      ref={wrapperRef}
      className={className}
      style={wrapperStyles}
    >
      <div ref={childContainerRef} style={{ display: 'contents' }}>
        {children}
      </div>

      {!disabled && (
        <div
          style={{
            ...glowStyles,
            borderRadius: effectiveRadius,
          }}
          aria-hidden="true"
        />
      )}

      {debug && !disabled && (
        <>
          <div
            style={{
              position: 'absolute',
              left: lightPosition.x - 5,
              top: lightPosition.y - 5,
              width: 10,
              height: 10,
              backgroundColor: 'red',
              borderRadius: '50%',
              zIndex: 100,
              pointerEvents: 'none',
              opacity: effectOpacity,
            }}
          />
          {trigger === 'proximity' && (
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: dimensions.width + proximityRadius * 2,
                height: dimensions.height + proximityRadius * 2,
                border: '1px dashed rgba(255,255,255,0.3)',
                borderRadius: effectiveRadius,
                pointerEvents: 'none',
                zIndex: 99,
              }}
            />
          )}
          <div
            style={{
              position: 'absolute',
              bottom: -20,
              left: 0,
              fontSize: 10,
              color: 'white',
              background: 'rgba(0,0,0,0.7)',
              padding: '2px 4px',
              borderRadius: 2,
              pointerEvents: 'none',
              zIndex: 100,
            }}
          >
            {trigger}: {cursorDistance === Infinity ? '∞' : cursorDistance < 0 ? 'inside' : `${Math.round(cursorDistance)}px`} | opacity: {effectOpacity.toFixed(2)}
          </div>
        </>
      )}

      {needsCursorTracking && (
        <CustomCursor
          smoothness={cursorSmoothness}
          onMove={handleCursorMove}
          onVisibilityChange={handleVisibilityChange}
          style={{ opacity: 0 }}
          showDevIndicator={false}
        />
      )}
    </div>
  );
};

AnimatedBorder.displayName = 'AnimatedBorder';

export default AnimatedBorder;
