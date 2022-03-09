import adapter from '@sveltejs/adapter-auto';
import preprocess from 'svelte-preprocess';
import path from 'path';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: preprocess(),

  kit: {
    adapter: adapter(),
    // inline all stylesheets smaller than 1kb
    inlineStyleThreshold: 1024,
    methodOverride: {
      allowed: ['PUT', 'PATCH', 'DELETE']
    },
    vite: {
      resolve: {
        alias: {
          $styles: path.resolve('./src/styles')
        }
      }
    }
  }
};

export default config;
