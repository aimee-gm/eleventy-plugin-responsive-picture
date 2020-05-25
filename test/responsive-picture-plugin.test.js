const { expect } = require("chai");
const sinon = require("sinon");

const plugin = require("../.eleventy");

const stubs = {
  addShortcode: sinon.stub(),
  addPairedShortcode: sinon.stub(),
};

const eleventy = { addPlugin: (p, config) => p.configFunction(stubs, config) };

const defaultConfig = {
  fallback: sinon.stub(),
  resize: sinon.stub(),
  ratios: [2, 1],
  sources: [
    { media: "(min-width: 1024px)", size: 824 },
    { media: "(min-width: 768px)", size: 696 },
    { media: "(min-width: 420px)", size: 568 },
    { size: 348 },
  ],
};

describe("eleventy-responsive-picture-plugin", () => {
  beforeEach(() => {
    sinon.reset();
  });

  describe("setup", () => {
    it("should register the shortcodes", () => {
      eleventy.addPlugin(plugin, defaultConfig);
      expect(stubs.addShortcode.callCount).to.equal(2);
      expect(stubs.addShortcode.firstCall.args[0]).to.equal("resize");
      expect(stubs.addShortcode.secondCall.args[0]).to.equal("fallback");
    });

    it("should register the pairedShortcode", () => {
      eleventy.addPlugin(plugin, defaultConfig);
      expect(stubs.addPairedShortcode.callCount).to.equal(1);
      expect(stubs.addPairedShortcode.firstCall.args[0]).to.equal("responsive");
    });
  });

  describe("responsive", () => {
    it("should output the correct picture tag", () => {
      eleventy.addPlugin(plugin, {
        ...defaultConfig,
        fallback: (src) => `${src}?w=1000`,
        resize: (src, width) => `${src}?w=${width}`,
      });

      const responsive = stubs.addPairedShortcode.firstCall.args[1];

      expect(
        responsive(`<img src="./image.jpg" alt="My super cool image">`)
      ).to.equal(
        `<picture>
            <source media="(min-width: 1024px)" srcset="./image.jpg?w=1648 2x, ./image.jpg?w=824 1x" />
            <source media="(min-width: 768px)" srcset="./image.jpg?w=1392 2x, ./image.jpg?w=696 1x" />
            <source media="(min-width: 420px)" srcset="./image.jpg?w=1136 2x, ./image.jpg?w=568 1x" />
            <source srcset="./image.jpg?w=696 2x, ./image.jpg?w=348 1x" />
            <img src="./image.jpg?w=1000" alt="My super cool image">
          </picture>`.replace(/\n\s+/g, "")
      );
    });
  });
});
