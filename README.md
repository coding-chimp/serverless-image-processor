# serverless-image-processor

Resizes and/or blurs images on the fly using Amazon S3, AWS Lambda, and Amazon
API Gateway.

## Deploy

First install serverless with `npm i -g serverless` and install all the node
modules with `npm i`.

`npm install` for the `sharp` package has to occur on the same platform as the
runtime, since it's building binaries. This can be done with Docker.
[[source](http://sharp.dimens.io/en/stable/install/#aws-lambda)]

```
rm -rf node_modules/sharp
docker run -v "$PWD":/var/task lambci/lambda:build-nodejs6.10 npm install
```

After that's done deploy with `serverless deploy`. This will also output the
URL of the function.

The deploy will also create a AWS role for the lambda function. Just give this
role the read rights for S3 and you're set.

## Usage

Calling the endpoint with the bucket and image name will return the original
image.

```
https://whatever.amazonaws.com/dev/process-image?bucket=bucketName&file=fancy-image.jpg
```

You can also define height and width in pixels and blur the wanted sigma.

```
https://whatever.amazonaws.com/dev/process-image?bucket=bucketName&file=fancy-image.jpg&height=200&blur=8
```
