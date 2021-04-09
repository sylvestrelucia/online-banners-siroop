# Source folder

The source folder contains the templates for all banner types.
The banner templates are rendered with the logic-less template engine [Mustache.js](http://mustache.github.io)

## Types of banners

We have 2 main types of banner templates:

## Static banners

These types of banners are pre-rendered using [Gulp tasks](https://github.com/ProjectThor/online-banners/blob/master/gulpfile.js).
List of static banner templates:
- merchant-deal
- product-deal
- merchant-deal

## Dynamic banner
These types of banners are rendered client-side with an injected data feed for each user.
Mustache.js allows also to render client-side. We can demo the banners by using sample Javascript Object `devDynamicContent`.
For production it is important to switch to `dynamicContent`
List of dynamic banner templates:
- retargeting _(uses the Google Merchant Center feed)_
- prospective _(uses the ProductsUp feed)_

## Folders

### creation
Contains the default fallback images for dynamic images.
To update it, edit the `retargeting-defaults.ai` and export again the files

### css
Contains the critical css file `kvasir-banners` for styling **all banners** 
To update, replace the generated CSS from Kvasir

### data



