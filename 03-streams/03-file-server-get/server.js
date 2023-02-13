const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  const stream = fs.createReadStream(filepath);

  switch (req.method) {
    case 'GET':
      stream.pipe(res);

      stream.on('error', (error) => {
        if (error.code === 'ENOENT') {
          if (error.path.slice(error.path.indexOf('files')).split('\\').length > 2) {
            res.statusCode = 400;
            res.end('Nested folders are not supported');
          } else {
            res.statusCode = 404;
            res.end('File not found');
          }
        } else {
          res.statusCode = 500;
          res.end('Common error');
        }
      });

      req.on('aborted', () => {
        stream.destroy();
      });
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
