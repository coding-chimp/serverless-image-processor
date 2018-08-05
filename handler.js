const Sharp = require('sharp');
const Path = require('path');
const ImageFetcher = require('./src/image-fetcher');
const ImageProcessor = require('./src/image-processor');

module.exports.processImage = (event, context, callback) => {
  const bucket = decodeURIComponent(event.pathParameters.bucket);
  const imageFetcher = new ImageFetcher(bucket);
  const imageProcessor = new ImageProcessor(Sharp);
  const file = decodeURIComponent(event.pathParameters.file);
  const quality = event.queryStringParameters && +event.queryStringParameters.quality || 100;
  const size = {
    width: event.queryStringParameters && +event.queryStringParameters.width || null,
    height: event.queryStringParameters && +event.queryStringParameters.height || null,
  };
  const blur = event.queryStringParameters && +event.queryStringParameters.blur || false;
  const webp = event.queryStringParameters && event.queryStringParameters.webp || false;

  return imageFetcher
    .fetchImage(file)
    .then(data => imageProcessor.resize(data.image, size, quality))
    .then(data => blur ? imageProcessor.blur(data.image, blur) : data)
    .then(data => webp ? imageProcessor.webp(data.image) : data)
    .then(data => {
      const contentType = data.contentType;
      const img = new Buffer(data.image.buffer, 'base64');
      const fileName = Path.parse(file).base;

      callback(null, {
        statusCode: 200,
        headers: {
          'Content-Type': contentType,
          'Content-Disposition': 'inline; filename="' +  fileName + '"'
        },
        body: img.toString('base64'),
        isBase64Encoded: true,
      });
    })
    .catch(error => {
      console.error('Error:', error);
      callback(null, error);
    });
};
