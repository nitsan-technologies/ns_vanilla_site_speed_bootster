# vanilla-site-speed-booster

> Boostup your website without any modern FancyJS framework like ReactJS, VueJS etc., Your website will get best speed & user experiance with features like Without reloading site, Dynamically apply AJAX etc.

**Features**:

- Speed-up your website
- Light weight plugin (~5KB)
- Zero-coding
- Easy to install & configure
- Quickly launch with simple usage

**Advantages**:

- Best user-experiance to website visitors
- Just like Mobile native app
- Sped-up your website
- Get best ranking speed at Page-speed
- No more FancyJS like Reactjs

## Table of Contents

- [Demo](https://t3planet.com)
- [Install](#install)
- [Usage](#usage)
- [Browser Support](#browser-support)
- [FAQs](#faqs)
- [Contribute](#contribute)
- [Changelog](#changelog)
- [License](#license)

## Install

```sh
# You can install Speed Booster with npm
$ npm i @nitsantechnologies/vanilla-site-speed-booster

# Alternatively you can use Yarn
$ yarn add @nitsantechnologies/vanilla-site-speed-booster
```

## Usage

Then with a module bundler like rollup or webpack, use as you would anything else:

```javascript
// using ES6 modules
import VanillaSiteSpeedBooster from "@nitsantechnologies/vanilla-site-speed-booster";

// using CommonJS modules
const yourVariable = new VanillaSiteSpeedBooster({
  // If you need progress bar then enabled, We use famous nprogress.js (know more at below FAQ section)
  enableProgressBar: false,

  // Set Id's of your Bundlejs script tag (know more at below usage section)
  idBundleJs: "pageAjax",

  // Enter list of URLs which you want to exclude - Remove this speed-booster feature
  excludeUrls: "/exclude-page",

  // Enter list of CSS-selector which you want to exclude of Anchor tag - Remove this speed-booster feature
  langSwitch: ".myElement a",

  // Enter list of CSS-selector which you want to exclude from whole page - Remove this speed-booster feature
  removeUsingPageClass: ".myCustomPageClass",

  // Add Error Message
  errorMsg: "Oops! Fatal error in VanillaSiteSpeedBooster plugin",

  // CSS-class name of your site's Main div-wrapper
  mainClassName: ".site-main",

  // Enable/Disable Browser's back & forward feature
  pageBackForwardReload: true,

  // If you have remove this functionality by target specific <A> Tag class
  removeUsingTargetClass: ['exclude-ajax-link', 'lang-menu-item'],

  // If you have remove this functionality by target specific <A> Tag class
  removeWithoutReloadUsingTargetClass: ['exclude-ajax-link', 'lang-menu-item'],
});
```

```css
  /* Please import CSS from Plugin for Animations and better functionality*/  
  @import '~@nitsantechnologies/vanilla-site-speed-booster/main.css';
```

## Browser Support

Available in [latest browsers](http://caniuse.com/#feat=intersectionobserver).

## FAQs

- Please don't use `DOMContentLoaded`
- To enable Progress-bar, Please install https://www.npmjs.com/package/nprogress

- We are supporting below Modalbox/Lightbox plugins, You don't need to configure anything. We will dynamically grab it.
- Fancybox
- Bootstrap 5 Modal
- Glightbox
- Colorbox
- Darkbox

## Contribute

Interested in contributing features and fixes?

[Excited to receive your PR](https://github.com/nitsan-technologies/ns_vanilla_site_speed_bootster).

## License

[MIT](LICENSE) © [NITSAN Technologies](https://nitsantech.com)
