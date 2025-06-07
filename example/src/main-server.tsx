import express, { Request, Response } from 'express';
import { renderToString } from 'react-dom/server';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import React from 'react';
import App from './App';

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();

// Serve static files
app.use('/assets', express.static(resolve(__dirname, 'assets')));

app.get('*', (req: Request, res: Response) => {
  const template = readFileSync(resolve(__dirname, '../index.html'), 'utf-8');
  
  const appHTML = renderToString(React.createElement(App));
  
  const html = template
    .replace('<!--ssr-outlet-->', appHTML)
    .replace('<div id="root"></div>', `<div id="root">${appHTML}</div>`);
  
  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(html);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
}); 