import React from 'react';
import { Section } from '../types/Section';

interface NavigationProps {
  sections: Section[];
  activeSection: string;
  onSectionChange: (sectionId: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  sections,
  activeSection,
  onSectionChange,
}) => {
  return (
    <nav className="glass-effect border-b border-neutral-200/50">
      <div className="px-6 py-3">
        <div className="flex space-x-1">
          {sections.map(({ id, title }) => (
            <button
              key={id}
              onClick={() => onSectionChange(id)}
              className={`
                relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200
                ${
                  activeSection === id
                    ? 'text-primary-600 bg-primary-50 shadow-sm'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                }
              `}
            >
              {title}
              {activeSection === id && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1 w-1 h-1 bg-primary-500 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}; 