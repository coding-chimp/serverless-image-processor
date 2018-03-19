const app = require('express')();
const bodyParser = require('body-parser');
const Sharp = require('sharp');
const PORT = 3000;
const ImageFetcher = require('./src/image-fetcher');
const ImageProcessor = require('./src/image-processor');

app.use(bodyParser.json());

const displayStatus = () => ({
  status: `OK`, });

app.get('/status', (req, res) => {
  res.status(200).send(displayStatus());
});

app.get('/fetch-image', (req, res) => {
  const imageFetcher = new ImageFetcher(process.env.BUCKET);
  const fileName = req.query && req.query.f;

  return imageFetcher
    .fetchImage(fileName)
    .then(data => {
      const img = new Buffer(data.image.buffer, 'base64');
      res.writeHead(200, {
        'Content-Type': data.contentType
      });
      res.end(img);
    })
    .catch(error => {
      console.error(error);
      res.status(400).send(error.message || error);
    });
});

app.get('/resize-image', (req, res) => {
  const imageFetcher = new ImageFetcher(process.env.BUCKET);
  const imageProcessor = new ImageProcessor(Sharp);
  const fileName = req.query && req.query.f;
  const quality = req.query && +req.query.q || 100;
  const size = {
    w: req && +req.query.w || null,
    h: req && +req.query.h || null,
  };
  const blur = req && +req.query.blur || false;

  return imageFetcher
    .fetchImage(fileName)
    .then(data => imageProcessor.resize(data.image, size, quality))
    .then(data => blur ? imageProcessor.blur(data.image, blur) : data)
    .then(data => {
      const img = new Buffer(data.image.buffer, 'base64');
      res.writeHead(200, {
        'Content-Type': data.contentType
      });
      res.end(img);
    })
    .catch(error => {
      console.error(error);
      res.status(400).send(error.message || error);
    });
});

const server = app.listen(PORT, () =>
  console.log('Listening on ' +
    `http://localhost:${server.address().port}`));
