import React from 'react';
import { Layout } from 'antd';
import {
  DemoSection,
  MagneticFieldsSection,
  PaintSection,
  ContentRevealSection,
} from './sections';
import { Section } from './types/Section';

const { Content } = Layout;

// Define all sections
const sections: Section[] = [
  {
    id: 'demo',
    component: DemoSection,
    height: '100vh',
  },
  {
    id: 'magnetic-fields',
    component: MagneticFieldsSection,
    height: '100vh',
  },
  {
    id: 'paint',
    component: PaintSection,
    height: '100vh',
  },
  {
    id: 'content-reveal',
    component: ContentRevealSection,
    height: '100vh',
  },
  // Add more sections here as needed
];

function App() {
  return (
    <Layout
      style={{
        minHeight: '100vh',
        height: '100vh',
        background: 'linear-gradient(45deg, #f0f2f5, #e6f7ff)',
      }}
    >
      <Content style={{ position: 'relative' }}>
        {sections.map(({ id, component: Component, height = '200vh' }) => (
          <div
            key={id}
            style={{
              height,
              width: '100%',
              position: 'relative',
              overflow: 'hidden',
              border: '1px solid',
            }}
          >
            <Component />
          </div>
        ))}
      </Content>
    </Layout>
  );
}

export default App;
