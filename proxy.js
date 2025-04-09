const http = require('http');
const httpProxy = require('http-proxy');
const fs = require('fs');
const path = require('path');

// Create a proxy server
const proxy = httpProxy.createProxyServer({});

// Create an HTTP server
const server = http.createServer((req, res) => {
  if (req.url === '/') {
    // Proxy the request to Google
    const targetUrl = 'https://www.google.com';
    proxy.web(req, res, { target: targetUrl, changeOrigin: true }, (err) => {
      console.error('Proxy error:', err.message);
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Something went wrong.');
    });

    // Modify headers to allow embedding in iframe
    proxy.on('proxyRes', (proxyRes) => {
      delete proxyRes.headers['x-frame-options']; // Remove X-Frame-Options
      delete proxyRes.headers['content-security-policy']; // Remove CSP headers
    });
  } else {
    // Extract the target URL from the request
    const targetUrl = decodeURIComponent(req.url.slice(1));

    // Proxy the request to the target URL
    proxy.web(req, res, { target: targetUrl, changeOrigin: true }, (err) => {
      console.error('Proxy error:', err.message);
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Something went wrong.');
    });

    // Modify headers to allow embedding in iframe
    proxy.on('proxyRes', (proxyRes) => {
      delete proxyRes.headers['x-frame-options']; // Remove X-Frame-Options
      delete proxyRes.headers['content-security-policy']; // Remove CSP headers
    });
  }
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Proxy server is running.`);
});