// next.config.js

const rehypePrism = require("@mapbox/rehype-prism");

const withMDX = require('@next/mdx')({
    options: {
      remarkPlugins: [],
      rehypePlugins: [rehypePrism],
    },
  })
  module.exports = withMDX({
      pageExtensions: ["tsx", "ts", "mdx"]
  })