const getSrc = (el) => {
  const src = /src="([^"]+)"/.exec(el);

  if (src && src.length) {
    return src[1];
  }

  throw new Error(`Cannot find image src attribute in ${el}`);
};

const makeSource = (config, source, src) => {
  const srcset = config.ratios
    .map(
      (ratio) =>
        `${config.resize(src, source.size * ratio, source.type)} ${ratio}x`
    )
    .join(", ");

  const media = source.media ? `media="${source.media}" ` : "";
  const type = source.type ? `type="${source.type}" ` : "";

  return `<source ${media}${type}srcset="${srcset}" />`;
};

const responsive = (config, el) => {
  const src = getSrc(el);

  const sources = config.sources
    .map((source) => makeSource(config, source, src))
    .join("");
  const img = el.replace(src, config.fallback ? config.fallback(src) : src);

  return `<picture>${sources}${img}</picture>`;
};

module.exports = {
  configFunction: function (eleventyConfig, config = {}) {
    eleventyConfig.addPairedShortcode(`responsive`, (...args) =>
      responsive(config, ...args)
    );
    eleventyConfig.addShortcode("resize", config.resize);
    eleventyConfig.addShortcode("fallback", config.fallback);
  },
};
