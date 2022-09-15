const Image = require("@11ty/eleventy-img");

module.exports = {
    add: (eleventyConfig) => {
        eleventyConfig.addNunjucksAsyncShortcode("resI", async (src, alt, widths) => {
            let metadata = await Image(src, {
                widths: widths,
                formats: ["webp", "jpeg"],
                urlPath: '/images',
                outputDir: 'www/images',
                useCache: false,
                cacheOptions: {
                    duration: '1d',
                    directory: 'www/.cache',
                        removeUrlQueryParams: false,

                }
            });

            let imageAttributes = {
                alt,
                sizes: widths,
                loading: "lazy",
                decoding: "async",
            };

            // You bet we throw an error on missing alt in `imageAttributes` (alt="" works okay)
            let lowsrc = metadata.jpeg[0];
            let highsrc = metadata.jpeg[metadata.jpeg.length - 1];

            return `<picture>
              ${Object.values(metadata).map(imageFormat => {
                return `  <source type="${imageFormat[0].sourceType}" srcset="${imageFormat.map(entry => entry.srcset).join(", ")}" sizes="100vw">`;
              }).join("\n")}
                <img
                  src="${lowsrc.url}"
                  width="${highsrc.width}"
                  height="${highsrc.height}"
                  alt="${alt}"
                  loading="lazy"
                  decoding="async">
              </picture>`;
        });
    }
};
