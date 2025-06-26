import React from 'react';

function Footer() {
  return (
    <footer className="py-12 border-t border-gray-800">
      <div className="container mx-auto px-6 text-center">
        <p className="text-gray-400 mb-4">
          Built with ❤️ by{' '}
          <a 
            href="https://github.com/yhattav" 
            className="text-blue-400 hover:text-blue-300 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            Yonatan Hattav
          </a>
        </p>
        <p className="text-sm text-gray-500 max-w-2xl mx-auto">
          Open source React library for creating engaging cursor experiences. 
          Perfect for interactive websites, creative portfolios, and modern applications.
        </p>
      </div>
    </footer>
  );
}

export { Footer }; 