const app = require('express')();
const bodyParser = require('body-parser');
const Sharp = require('sharp');
const PORT = 4000;
const ImageFetcher = require('./src/image-fetcher');
const ImageProcessor = require('./src/image-processor');

app.use(bodyParser.json());

app.get('/process-image', (req, res) => {
  const bucket = req.query && req.query.bucket;
  const imageFetcher = new ImageFetcher(bucket);
  const imageProcessor = new ImageProcessor(Sharp);
  const fileName = req.query && req.query.file;
  const quality = req.query && +req.query.quality || 100;
  const size = {
    width: req && +req.query.width || null,
    height: req && +req.query.height || null,
  };
  const blur = req && +req.query.blur || false;
  const webp = req && req.query.webp || false;

  return imageFetcher
    .fetchImage(fileName)
    .then(data => imageProcessor.resize(data.image, size, quality))
    .then(data => blur ? imageProcessor.blur(data.image, blur) : data)
    .then(data => webp ? imageProcessor.webp(data.image) : data)
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
