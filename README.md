<h1>eleventy-plugin-responsive-picture</h1>

A plugin that provides shortcodes for converting images to responsive `<picture>` elements.

- [Installation](#installation)
- [Usage](#usage)
  - [Options](#options)
    - [ratios](#ratios)
    - [sources](#sources)
    - [resize()](#resize)
    - [fallback()](#fallback)
- [Example](#example)
- [License](#license)

## Installation

```sh
# npm
npm i eleventy-plugin-responsive-picture

# yarn
yarn add eleventy-plugin-responsive-picture
```

## Usage

Register the plugin in you `.eleventy.js` file:

```js
const eleventyResponsivePicturePlugin = require("eleventy-plugin-responsive-picture");

module.exports = (eleventyConfig) => {
  eleventyConfig.addPlugin(eleventyResponsivePicturePlugin, { ...options });
});
```

In your layout, wrap an `<img>` tag with `{% responsive %}`.

For example:

```nunjucks
{% responsive %}
<img src="/profile-picture.jpg">
{% endresponsive %}
```

The `<img>` will be wrapped with a `<picture>` element as specified in the configuration options

### Options

#### ratios

**Required**. Type: `number[]`

An array of pixel density ratios for the `srcset` of each `<source>`. They are applied in the order supplied.

_Example:_

```javascript
{
  ratio: [2, 1];
}
```

#### sources

**Required**. Type: `{ size: number, media?: string, type?: string }[]`

A list of `<source>`s to generate, with the following properties:

- `media` (string) an optional media query, e.g. `(min-width: 1024px)`
- `size` (number) image size in pixels for the corresponding media query, e.g. `824`
- `type` (string) an optional mime type, e.g. `image/jpeg`

The order of sources is unchanged by the plugin.

#### resize()

**Required**. Type: `(src: string, size: number, type: string) => string`

A function that will return a URL for a resized version of the image.

_Example:_

```javascript
{
  resize: (src, size) => `${src}?w=${size}`;
}
```

#### fallback()

Optional. Type: `(src: string) => string`.

A function that returns the URL of the image to use in the "fallback" `<img>` element. This allows you to serve a resized image by default, rather than a full-size image.

_Example:_

```javascript
{
  resize: (src) => `${src}?w=1000`;
}
```

## Example

Plugin registration

```javascript
eleventyConfig.addPlugin(eleventyNavigationPlugin, {
  ratios: [2, 1],
  sources: [
    { media: "(min-width: 1024px)", size: 824 },
    { media: "(min-width: 768px)", size: 696 },
    { media: "(min-width: 420px)", size: 568 },
    { size: 348 },
  ],
  fallback: (src) => `${src}?w=1000`,
  resize: (src, width) => `${src}?w=${size}`,
});
```

Template use

```html
{% responsive %}
<img src="./image.jpg" alt="My super cool image" />
{% endresponsive %}
```

Output:

```html
<picture>
  <source
    media="(min-width: 1024px)"
    srcset="./image.jpg?w=1648 2x, ./image.jpg?w=824 1x"
  />
  <source
    media="(min-width: 768px)"
    srcset="./image.jpg?w=1392 2x, ./image.jpg?w=696 1x"
  />
  <source
    media="(min-width: 420px)"
    srcset="./image.jpg?w=1136 2x, ./image.jpg?w=568 1x"
  />
  <source srcset="./image.jpg?w=696 2x, ./image.jpg?w=348 1x" />
  <img src="./image.jpg?w=1000" alt="My super cool image" />
</picture>
```

_Actual output does not include line breaks_

## License

This software is released under the [MIT License](./LICENSE).
