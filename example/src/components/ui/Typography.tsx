import React from 'react';

interface TypographyProps {
  children?: React.ReactNode;
  className?: string;
}

interface TitleProps extends TypographyProps {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

interface TextProps extends TypographyProps {
  type?: 'default' | 'secondary' | 'success' | 'warning' | 'danger';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
}

export const Title: React.FC<TitleProps> = ({ 
  level = 1, 
  children, 
  className = '' 
}) => {
  const baseClasses = 'font-bold text-neutral-900 leading-tight';
  
  const levelClasses = {
    1: 'text-4xl lg:text-5xl',
    2: 'text-3xl lg:text-4xl',
    3: 'text-2xl lg:text-3xl',
    4: 'text-xl lg:text-2xl',
    5: 'text-lg lg:text-xl',
    6: 'text-base lg:text-lg',
  };

  const Component = `h${level}` as keyof JSX.IntrinsicElements;
  const classes = `${baseClasses} ${levelClasses[level]} ${className}`;

  return React.createElement(Component, { className: classes }, children);
};

export const Text: React.FC<TextProps> = ({ 
  type = 'default',
  size = 'md',
  weight = 'normal',
  children, 
  className = '' 
}) => {
  const typeClasses = {
    default: 'text-neutral-900',
    secondary: 'text-neutral-600',
    success: 'text-green-600',
    warning: 'text-amber-600',
    danger: 'text-red-600',
  };

  const sizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  };

  const weightClasses = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  };

  const classes = `${typeClasses[type]} ${sizeClasses[size]} ${weightClasses[weight]} ${className}`;

  return <span className={classes}>{children}</span>;
};

export const Paragraph: React.FC<TypographyProps> = ({ 
  children, 
  className = '' 
}) => (
  <p className={`text-neutral-700 leading-relaxed ${className}`}>
    {children}
  </p>
);

// Namespace object for compatibility with Ant Design import patterns
export const Typography = {
  Title,
  Text,
  Paragraph,
}; 