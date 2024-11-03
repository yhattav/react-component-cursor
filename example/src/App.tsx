import React from 'react';
import { Layout } from 'antd';
import { DemoSection } from './sections/DemoSection';
import { Section } from './types/Section';

const { Content } = Layout;

// Define all sections
const sections: Section[] = [
  {
    id: 'demo',
    component: DemoSection,
    height: '100vh',
  },
  // Add more sections here as needed
];

function App() {
  return (
    <Layout
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(45deg, #f0f2f5, #e6f7ff)',
      }}
    >
      <Content>
        {sections.map(({ id, component: Component, height = '100vh' }) => (
          <div key={id} style={{ minHeight: height }}>
            <Component />
          </div>
        ))}
      </Content>
    </Layout>
  );
}

export default App;
