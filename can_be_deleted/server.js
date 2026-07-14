const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3010;

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.json': 'application/json',
  '.svg': 'image/svg+xml'
};

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

const server = http.createServer((req, res) => {
  // Decode URL to handle spaces or special characters in folder names/paths
  let decodedUrl = decodeURIComponent(req.url);
  
  // Resolve the requested file path
  let filePath = path.join(__dirname, decodedUrl === '/' ? 'home.html' : decodedUrl);
  
  const extname = path.extname(filePath);
  let contentType = MIME_TYPES[extname] || 'application/octet-stream';

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 Not Found</h1>', 'utf-8');
      } else {
        res.writeHead(500);
        res.end(`Server Error: ${error.code}`);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.on('error', (err) => {
  console.error('Server Error:', err);
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
