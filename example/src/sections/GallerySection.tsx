import React, { useState, useRef, useCallback } from 'react';
import { CustomCursor } from '@yhattav/react-component-cursor';
import { Typography, Button } from 'antd';
import {
  RightOutlined,
  LeftOutlined,
  ExpandAltOutlined,
  CloseOutlined,
} from '@ant-design/icons';

const { Title, Paragraph } = Typography;

// Constants for gallery
const GALLERY_ITEMS = Array.from({ length: 10 }, (_, i) => ({
  id: i,
  color: `hsl(${i * 36}, 70%, 60%)`, // Creates different colors
}));

const ITEM_WIDTH = 300; // Width of each gallery item
const ITEM_GAP = 20; // Gap between items

interface GallerySectionProps {
  onDebugData?: (data: any) => void;
}

interface GalleryItem {
  id: number;
  color: string;
}

export const GallerySection: React.FC<GallerySectionProps> = React.memo(
  ({ onDebugData }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const galleryRef = useRef<HTMLDivElement>(null);
    const [isLeftSide, setIsLeftSide] = useState(false);
    const [scrollPosition, setScrollPosition] = useState(0);
    const [expandedItem, setExpandedItem] = useState<number | null>(null);
    const expandedContainerRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current) return;
        const { width, left } = containerRef.current.getBoundingClientRect();
        const isLeft = e.clientX - left < width / 2;
        setIsLeftSide(isLeft);
      },
      []
    );

    const handleClick = useCallback(() => {
      if (!galleryRef.current) return;
      const maxScroll =
        galleryRef.current.scrollWidth - galleryRef.current.clientWidth;
      const scrollAmount = ITEM_WIDTH + ITEM_GAP;

      let newPosition;
      if (isLeftSide) {
        newPosition = Math.max(0, scrollPosition - scrollAmount);
      } else {
        newPosition = Math.min(maxScroll, scrollPosition + scrollAmount);
      }

      galleryRef.current.scrollTo({
        left: newPosition,
        behavior: 'smooth',
      });
      setScrollPosition(newPosition);
    }, [isLeftSide, scrollPosition]);

    const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
      setScrollPosition(e.currentTarget.scrollLeft);
    }, []);

    const GalleryItem = ({ item }: { item: GalleryItem }) => {
      const [isHovered, setIsHovered] = useState(false);

      return (
        <div
          key={item.id}
          style={{
            position: 'relative',
            width: `${ITEM_WIDTH}px`,
            height: '400px',
            backgroundColor: item.color,
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            color: 'white',
            flexShrink: 0,
            cursor: 'default',
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          Gallery Item {item.id + 1}
          {/* Hover Overlay */}
          {isHovered && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'flex-end',
                padding: '1rem',
              }}
            >
              <Button
                icon={<ExpandAltOutlined />}
                onClick={(e) => {
                  e.stopPropagation();
                  setExpandedItem(item.id);
                }}
              />
            </div>
          )}
        </div>
      );
    };

    return (
      <div style={{ padding: '2rem', height: '100%', boxSizing: 'border-box' }}>
        <Typography>
          <Title>Gallery Demo</Title>
          <Paragraph>
            Move your cursor to either side of the gallery to navigate through
            items. Click to scroll!
          </Paragraph>
        </Typography>

        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onClick={handleClick}
          style={{
            position: 'relative',
            cursor: 'none',
            padding: '2rem',
            background: '#f0f0f0',
            borderRadius: '8px',
            width: '100%',
          }}
        >
          {/* Only show gallery cursor when not in expanded mode */}
          {expandedItem === null && (
            <CustomCursor containerRef={containerRef} smoothFactor={2}>
              <div
                style={{
                  width: '50px',
                  height: '50px',
                  backgroundColor: 'rgba(0,0,0,0.3)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: 'translate(-50%, -50%)',
                  color: 'white',
                  fontSize: '20px',
                }}
              >
                {isLeftSide ? <LeftOutlined /> : <RightOutlined />}
              </div>
            </CustomCursor>
          )}

          <div
            ref={galleryRef}
            onScroll={handleScroll}
            style={{
              display: 'flex',
              gap: `${ITEM_GAP}px`,
              overflowX: 'auto',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch',
              width: '100%',
            }}
          >
            <div
              style={{
                display: 'flex',
                gap: `${ITEM_GAP}px`,
                width: 'fit-content',
              }}
            >
              {GALLERY_ITEMS.map((item) => (
                <GalleryItem key={item.id} item={item} />
              ))}
            </div>
          </div>
        </div>

        {/* Expanded Item Modal */}
        {expandedItem !== null && (
          <div
            ref={expandedContainerRef}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              cursor: 'none', // Hide default cursor
            }}
            onClick={() => setExpandedItem(null)}
          >
            <CustomCursor containerRef={expandedContainerRef} smoothFactor={2}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: 'translate(-50%, -50%)',
                  color: 'white',
                  fontSize: '16px',
                }}
              >
                <CloseOutlined />
              </div>
            </CustomCursor>

            <div
              style={{
                position: 'relative',
                width: '80vw',
                height: '80vh',
                backgroundColor: GALLERY_ITEMS[expandedItem].color,
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '32px',
                color: 'white',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                icon={<CloseOutlined />}
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                }}
                onClick={() => setExpandedItem(null)}
              />
              Gallery Item {expandedItem + 1}
            </div>
          </div>
        )}
      </div>
    );
  }
);

GallerySection.displayName = 'GallerySection';
