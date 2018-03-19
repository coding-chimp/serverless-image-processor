class ImageProcessor {
  constructor(Sharp) {
    this.sharp = Sharp;
  }

  resize(image, size, quality) {
    if (!image) throw new Error('An Image must be specified');
    if (!size) throw new Error('Image size must be specified');

    return new Promise((res, rej) => {
      this.sharp(new Buffer(image.buffer))
        .resize(size.w, size.h)
        .jpeg({quality: quality})
        .toBuffer()
        .then(data => {
          return res({
            image: data,
            contentType: 'image/jpeg',
          });
        })
        .catch(err => rej(err))
    });
  }

  blur(image, sigma) {
    return new Promise((res, rej) => {
      this.sharp(new Buffer(image.buffer))
        .blur(sigma)
        .toBuffer()
        .then(data => {
          return res({
            image: data,
            contentType: 'image/jpeg',
          });
        })
        .catch(err => rej(err))
    });
  }
}

module.exports = ImageProcessor;
