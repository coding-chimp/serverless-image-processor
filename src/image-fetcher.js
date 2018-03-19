const AWS = require('aws-sdk');

const getS3 = (s3, bucketName, fileName) =>
  new Promise((res, rej) => {
    s3.getObject({
      Bucket: bucketName,
      Key: fileName
    },
      (err, data) => {
        if (err) {
          return rej(err);
        }

        const contentType = data.ContentType;
        const image = data.Body;
        return res({ image, contentType });
      });
  });

class ImageFetcher {
  constructor(bucketName) {
    this.S3 = new AWS.S3();
    this.bucketName = bucketName;
  }

  fetchImage(fileName) {
    if (!fileName) {
      return Promise.reject('Filename not specified');
    }

    return Promise.resolve(
      getS3(this.S3, this.bucketName, fileName)
    );
  }
}

module.exports = ImageFetcher;
