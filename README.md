# WARNING:

This fork is meant to be built and ran locally. Docker compose has been edited to support a local build.

Steps:
1. Clone the repo
2. Run `docker-compose up --build`
3. Service is up and running, you can follow further instructions below.

ALTERNATIVE-Coolify:
1. Go to Projects -> Environment (pick yours) -> + New -> Public Repository -> Select Server and Destination -> Insert URL of this repository
2. Setup Build Pack to Docker Compose. 
3. Edit "Domains for Api" with your domain. 
4. If necessary, edit your environment variables (look .env.example for allowed values).
5. Deploy.

# Next.js Image Transformation

An open-source & self-hostable image optimization service, a drop-in replacement for Vercel's Image Optimization.

## Cloud with free global CDN

The cloud version, with free global CDN and simple pricing available here: https://images.coollabs.io

## Try it out 

- Change the `width` query parameter to see the image resize on the fly.
- Add the `height` query parameter to see the image crop on the fly.
- Add the `quality` query parameter to see the image quality change on the fly.

https://image.coollabs.io/image/https://cdn.coollabs.io/images/image1.jpg?width=500

## Includes
1. Next Image Transformation API.
   - A simple API written in Bun that transforms the incoming request to Imgproxy format and forwards it to the Imgproxy service.
2. Imgproxy service.
   - A powerful and fast image processing service that can resize, crop, and transform images on the fly.

## How to deploy with Coolify
1. Login to your [Coolify](https://coolify.io) instance or the [cloud](https://app.coolify.io).
2. Close this repo from git and use Docker Compose for build.
3. Optional: Set the `ALLOWED_REMOTE_DOMAINS` environment variable to the domain of your images (e.g. `example.com,coolify.io`). By default, it is set to `*` which allows any domain.
4. Optional: Set the `ALLOWED_WIDTHS` and/or `ALLOWED_HEIGHTS` environment variable to the allowed widths for your resized images (e.g. `0,100,500,1000,1500,2000`). By default, it is set to `*` which allows any width.
5. Optional: Set the `ALLOWED_QUALITIES` environment variable to the allowed qualities for your optimized images (e.g. `50,75,80,100`). By default, it is set to `*` which allows any quality.
4. Set Domains for Api to your `domain`.
5. Deploy your service.

## How to use in Next.js
1. In `next.config.js` add the following:
```javascript
module.exports = {
  images: {
    loader: 'custom',
    loaderFile: './loader.js',
  },
}
```
2. Create a file called `loader.js` in the root of your project and add the following:
```javascript
'use client'

export default function myImageLoader({ src, width, quality }) {
    const isLocal = !src.startsWith('http');
    const query = new URLSearchParams();

    const imageOptimizationApi = '<image-optimization-domain>';
    // Your NextJS application URL
    const baseUrl = '<your-nextjs-app-domain>';

    const fullSrc = `${baseUrl}${src}`;

    if (width) query.set('width', width);
    if (quality) query.set('quality', quality);

    if (isLocal && process.env.NODE_ENV === 'development') {
        return src;
    }
    if (isLocal) {
        return `${imageOptimizationApi}/${fullSrc}?${query.toString()}`;
    }
    return `${imageOptimizationApi}/${src}?${query.toString()}`;
}
```

- Replace `<image-optimization-domain>` with the URL of what you set on the `Next Image Transformation API`.
- Replace `<your-nextjs-app-domain>` with the URL of your Nextjs application.

## Currently supported transformations
- width
- height
- quality
