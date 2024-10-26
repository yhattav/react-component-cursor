import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { CustomCursor } from '../src';

const CustomCursorButton: React.FC<{ text: string }> = ({ text }) => {
  return (
    <div 
      style={{
        padding: '0.5rem 1rem',
        backgroundColor: 'rgba(59, 130, 246, 0.9)',
        color: 'white',
        borderRadius: '1rem',
        fontSize: '14px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        transform: 'translate(-50%, -50%)',
        whiteSpace: 'nowrap'
      }}
    >
      {text} ✨
    </div>
  );
};

const App = () => {
  const [cursorMode, setCursorMode] = useState<'simple' | 'button'>('simple');
  const [clickCount, setClickCount] = useState<number>(0);
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [message, setMessage] = useState<string>('');

  const cards = [
    { title: 'Hover Me', content: 'I change on hover!' },
    { title: 'Click Me', content: 'I count your clicks!' },
    { title: 'Interactive', content: 'I show a message!' }
  ];

  return (
    <div style={{ 
      cursor: 'none',
      height: '100vh',
      background: 'linear-gradient(45deg, #f3f4f6, #e5e7eb)',
      padding: '2rem'
    }}>
      <CustomCursor smoothFactor={2}>
        {cursorMode === 'simple' ? (
          <div style={{
            width: '20px',
            height: '20px',
            backgroundColor: '#3b82f6',
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)'
          }} />
        ) : (
          <CustomCursorButton text={clickCount > 0 ? `Clicked ${clickCount} times!` : "Click something!"} />
        )}
      </CustomCursor>

      <h1>Custom Cursor Component Demo</h1>
      <p>This demo shows how you can use any React component as a cursor!</p>
      
      {/* Cursor Toggle Buttons */}
      <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
        <button 
          onClick={() => setCursorMode('simple')}
          style={{
            padding: '1rem 2rem',
            border: 'none',
            borderRadius: '0.5rem',
            backgroundColor: cursorMode === 'simple' ? '#3b82f6' : '#94a3b8',
            color: 'white',
            cursor: 'none',
            transition: 'all 0.2s ease'
          }}
        >
          Simple Cursor
        </button>
        
        <button 
          onClick={() => setCursorMode('button')}
          style={{
            padding: '1rem 2rem',
            border: 'none',
            borderRadius: '0.5rem',
            backgroundColor: cursorMode === 'button' ? '#3b82f6' : '#94a3b8',
            color: 'white',
            cursor: 'none',
            transition: 'all 0.2s ease'
          }}
        >
          Button Cursor
        </button>
      </div>

      {/* Interactive Area */}
      <div style={{ 
        marginTop: '3rem',
        padding: '2rem',
        backgroundColor: 'white',
        borderRadius: '1rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h2>Interactive Area</h2>
        <p style={{ marginBottom: '1rem' }}>Try interacting with these cards!</p>
        
        {/* Interactive Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginTop: '1rem'
        }}>
          {cards.map((card, index) => (
            <div
              key={index}
              onClick={() => {
                setClickCount(prev => prev + 1);
                setMessage(`You clicked ${card.title}!`);
              }}
              onMouseEnter={() => setActiveCard(index)}
              onMouseLeave={() => setActiveCard(null)}
              style={{
                padding: '1.5rem',
                backgroundColor: activeCard === index ? '#f0f9ff' : '#f8fafc',
                borderRadius: '0.5rem',
                cursor: 'none',
                transition: 'all 0.2s ease',
                transform: activeCard === index ? 'translateY(-2px)' : 'none',
                boxShadow: activeCard === index 
                  ? '0 4px 6px rgba(59, 130, 246, 0.1)' 
                  : '0 2px 4px rgba(0,0,0,0.05)'
              }}
            >
              <h3 style={{ 
                color: '#1e3a8a',
                marginBottom: '0.5rem',
                fontSize: '1.1rem'
              }}>
                {card.title}
              </h3>
              <p style={{ color: '#64748b' }}>{card.content}</p>
            </div>
          ))}
        </div>

        {/* Message Display */}
        {message && (
          <div style={{
            marginTop: '2rem',
            padding: '1rem',
            backgroundColor: '#f0f9ff',
            borderRadius: '0.5rem',
            color: '#1e3a8a',
            textAlign: 'center',
            animation: 'fadeIn 0.3s ease'
          }}>
            {message}
          </div>
        )}

        {/* Click Counter Display */}
        <div style={{
          marginTop: '2rem',
          textAlign: 'center',
          color: '#64748b'
        }}>
          Total clicks: {clickCount}
        </div>
      </div>
    </div>
  );
};

const container = document.getElementById('root');
if (!container) throw new Error('Failed to find the root element');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);