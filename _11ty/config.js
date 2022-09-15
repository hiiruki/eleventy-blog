const fs = require("fs");

const pluginRss = require('@11ty/eleventy-plugin-rss');
const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');
const lazyImagesPlugin = require('eleventy-plugin-lazyimages');
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");
const markdownItEmoji = require('markdown-it-emoji');
const path = require('path');
const sitemap = require("@quasibit/eleventy-plugin-sitemap");
const readingTime = require('eleventy-plugin-reading-time');
const pluginSEO = require("eleventy-plugin-seo");
const markdownItContainer = require('markdown-it-container')
const markdownItFootnote = require('markdown-it-footnote');
const markdownItAttributes = require('markdown-it-attrs');
const markdownItAbbr = require('markdown-it-abbr');
const markdownItSpan = require('markdown-it-span');
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const mdfigcaption = require("markdown-it-image-figures");

const globalFilters = require('./filters');
const globalShortCodes = require('./shortcodes');
const nunjucksShortCodes = require('../src/_includes/nunjucks/sortcodes');
const nunjucksFilters = require('../src/_includes/nunjucks/filters');
const site = require('../src/_data/site');

module.exports = function (eleventyConfig) {

    eleventyConfig.setDataDeepMerge(true);

    // Filters
    Object.keys(globalFilters).forEach(filterName => {
        eleventyConfig.addFilter(filterName, globalFilters[filterName]);
    });

    // Shortcodes
    Object.keys(globalShortCodes).forEach(shortcodeName => {
        let val = globalShortCodes[shortcodeName];
        let fn = val.isPaired ? 'addPairedShortcode' : 'addShortcode';
        eleventyConfig[fn](shortcodeName, val.fn);
    });

    // Plugins
    // RSS Generator
    eleventyConfig.addPlugin(pluginRss);
    // Syntax Highlighting
    eleventyConfig.addPlugin(syntaxHighlight);
    // LazyImage
    eleventyConfig.addPlugin(lazyImagesPlugin, {
        transformImgPath: src => isAbsolutePath(src) ? src : path.join(__dirname, '../www', src)
    });
    eleventyConfig.addPlugin(sitemap, {
        sitemap: {
        hostname: "https://hiiruki.dev",
        },
    });

    eleventyConfig.addPlugin(readingTime);
    eleventyConfig.addPlugin(pluginSEO, {
        title: site.title,
        description: site.description,
        url: site.url,
        author: site.author,
        twitter: '0xHiiruki',
        options: {
            twitterCardType: "summary_large_image",
        }
    });
    eleventyConfig.addPlugin(eleventyNavigationPlugin);

    // Collections
    const livePosts = post => post.date <= new Date() && !post.data.draft;
    eleventyConfig.addCollection('posts', collection => {
        return collection.getFilteredByGlob('**/posts/**/*.md').filter(livePosts).reverse();
    });

    // Transforms
    eleventyConfig.addTransform('htmlmin', globalFilters.htmlmin);

    /* Markdown Overrides */
    let markdownLibrary = markdownIt({
        html: true,
        breaks: true,
        linkify: true
    }).use(markdownItAnchor, {
        permalink: true,
        permalinkBefore: true,
        permalinkSymbol: ""
    }).use(markdownItEmoji)
    .use(markdownItContainer, 'info')
    .use(markdownItContainer, 'lead')
    .use(markdownItContainer, 'success')
    .use(markdownItContainer, 'warning')
    .use(markdownItContainer, 'error')
    .use(markdownItFootnote)
    .use(markdownItAbbr)
    .use(markdownItAttributes)
    .use(markdownItSpan)
    .use(mdfigcaption, {
      figcaption: true
    });

    eleventyConfig.setLibrary("md", markdownLibrary);

    nunjucksFilters.add(eleventyConfig);
    nunjucksShortCodes.add(eleventyConfig);

    eleventyConfig
        .addPassthroughCopy({ 'src/_includes/assets': 'assets' })
        .addPassthroughCopy('src/manifest.json')
        .addPassthroughCopy('src/_redirects')
        .addPassthroughCopy('src/images')
        .addPassthroughCopy('src/.well-known');

    
    // Override Browsersync defaults (used only with --serve)
    eleventyConfig.setBrowserSyncConfig({
        callbacks: {
        ready: function(err, browserSync) {
            const content_404 = fs.readFileSync('www/404.html');

            browserSync.addMiddleware("*", (req, res) => {
            // Provides the 404 content without redirect.
            res.writeHead(404, {"Content-Type": "text/html; charset=UTF-8"});
            res.write(content_404);
            res.end();
            });
        },
        },
        ui: false,
        ghostMode: false
    });

    return {
        templateFormats: ['njk', 'md', 'html', '11ty.js'],
        dir: {
            input: 'src',
            includes: '_includes',
            data: '_data',
            output: 'www',
        },
        markdownTemplateEngine: 'njk',
        htmlTemplateEngine: 'njk',
        dataTemplateEngine: 'njk',
        passthroughFileCopy: true,
    };
};

function isAbsolutePath(src) {
    if (typeof src !== 'string') {
        throw new TypeError(`Expected a \`string\`, got \`${typeof src}\``);
    }

    if (/^[a-zA-Z]:\\/.test(src)) {
        return false;
    }

    return /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(src);
};