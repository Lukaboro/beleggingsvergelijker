// frontend/craco.config.js
module.exports = {
  style: {
    postcss: {
      loaderOptions: (postcssLoaderOptions) => {
        console.log('PostCSS options:', postcssLoaderOptions);
        postcssLoaderOptions.postcssOptions = {
          plugins: [
            require('tailwindcss'),
            require('autoprefixer'),
          ],
        };
        return postcssLoaderOptions;
      },
    },
  },
};