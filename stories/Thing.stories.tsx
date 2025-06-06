import React from 'react';
import type { Meta, StoryFn } from '@storybook/react';
import { CustomCursor, CustomCursorProps } from '../src';

const meta: Meta = {
  title: 'Welcome',
  component: CustomCursor,
  argTypes: {
    children: {
      control: {
        type: 'text',
      },
    },
    showDevIndicator: {
      control: {
        type: 'boolean',
      },
      description: '[Dev Only] Show red debug ring in development (no effect in production)',
    },
  },
  parameters: {
    controls: { expanded: true },
  },
};

export default meta;

const Template: StoryFn<CustomCursorProps> = (args: CustomCursorProps) => (
  <CustomCursor {...args} />
);

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({});

Default.args = {};
