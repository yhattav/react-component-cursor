import React, { useEffect, useState } from 'react';
import { Layout, Tabs } from 'antd';
import {
  DemoSection,
  MagneticFieldsSection,
  PaintSection,
  ContentRevealSection,
} from './sections';
import { Section } from './types/Section';

const { Content, Header } = Layout;
const { TabPane } = Tabs;

// Define all sections
const sections: Section[] = [
  {
    id: 'demo',
    title: 'Basic Demo',
    component: DemoSection,
    height: '100vh',
  },
  {
    id: 'magnetic-fields',
    title: 'Magnetic Fields',
    component: MagneticFieldsSection,
    height: '100vh',
  },
  {
    id: 'paint',
    title: 'Paint',
    component: PaintSection,
    height: '100vh',
  },
  {
    id: 'content-reveal',
    title: 'Content Reveal',
    component: ContentRevealSection,
    height: '100vh',
  },
];

function App() {
  const [activeSection, setActiveSection] = useState(() => {
    const saved = localStorage.getItem('activeSection');
    return saved || 'magnetic-fields';
  });

  useEffect(() => {
    localStorage.setItem('activeSection', activeSection);
  }, [activeSection]);

  const CurrentSection = sections.find(
    (section) => section.id === activeSection
  )?.component;

  return (
    <Layout style={{ height: '100vh' }}>
      <Header
        style={{
          background: '#fff',
          padding: '0 16px',
          height: 'auto',
          lineHeight: 'normal',
        }}
      >
        <Tabs
          activeKey={activeSection}
          onChange={setActiveSection}
          style={{ marginBottom: 0 }}
        >
          {sections.map(({ id, title }) => (
            <TabPane tab={title} key={id} />
          ))}
        </Tabs>
      </Header>
      <Layout>
        <Content
          style={{
            position: 'relative',
            height: 'calc(100vh - 64px)',
            overflow: 'hidden',
          }}
        >
          {CurrentSection && <CurrentSection />}
        </Content>
        <Layout.Sider
          width="20%"
          style={{
            background: '#fff',
            minWidth: '300px',
            height: 'calc(100vh - 64px)',
            overflow: 'auto',
          }}
        >
          Debug Info Panel
        </Layout.Sider>
      </Layout>
    </Layout>
  );
}

export default App;
