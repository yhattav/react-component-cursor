import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(({
  title,
  subtitle,
  children,
  className = '',
  padding = 'md',
  shadow = 'md',
  hover = false,
  ...props
}, ref) => {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
  };

  const hoverClasses = hover ? 'hover:shadow-lg hover:-translate-y-1 transition-all duration-200' : '';

  const classes = `
    bg-white rounded-xl border border-neutral-200
    ${paddingClasses[padding]}
    ${shadowClasses[shadow]}
    ${hoverClasses}
    ${className}
  `.trim();

  return (
    <div ref={ref} className={classes} {...props}>
      {(title || subtitle) && (
        <div className={`${children ? 'mb-4' : ''}`}>
          {title && (
            <h3 className="text-lg font-semibold text-neutral-900 leading-6">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className={`text-sm text-neutral-500 ${title ? 'mt-1' : ''}`}>
              {subtitle}
            </p>
          )}
        </div>
      )}
      {children}
    </div>
  );
}); 