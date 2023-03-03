const LimitSizeStream = require('./LimitSizeStream');
const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  // Путь к файлу, который пользователь создаёт на сервере
  const filepath = path.join(__dirname, 'files', pathname);

  // Создаём стрим с трансформером и проверкой, что файл не превышает 1Мб
  const limitedStream = new LimitSizeStream({limit: 1048576});

  // Смотрим на сервере - если такой файл существует,
  // то выкидываем ошибку и завершаем res.
  if (fs.existsSync(filepath)) {
    res.statusCode = 409;
    return res.end('Such file already exists');
  }

  // Создаём файл на сервере
  const outStream = fs.createWriteStream(filepath);

  // Обрабатываем пост-запрос на сервер
  switch (req.method) {
    case 'POST':
      // Получаем запрос в req, отправляем в limitedStream,
      // оттуда записываем данные в файл на сервере
      req.pipe(limitedStream).pipe(outStream);

      // Обрабатываем ошибки
      limitedStream.on('error', (error) => {
        if (error.code === 'LIMIT_EXCEEDED') {
          fs.unlinkSync(filepath);
          res.statusCode = 413;
          return res.end('File is too big');
        }
      });

      outStream.on('error', (error) => {
        if (error.code === 'ENOENT') {
          if (pathname.includes('/')) {
            res.statusCode = 400;
            return res.end('Nested folders are not supported');
          } else {
            res.statusCode = 404;
            return res.end('File not found');
          }
        } else {
          res.statusCode = 500;
          return res.end('Something wrong');
        }
      });
      req.on('aborted', () => {
        fs.unlinkSync(filepath);
        outStream.destroy();
        limitedStream.destroy();
        return res.end('Uploading is aborted');
      });
      outStream.on('finish', () => {
        res.statusCode = 201;
        return res.end('Everything is fine');
      });
      break;
    default:
      res.statusCode = 501;
      return res.end('Not implemented');
  }
});

module.exports = server;
