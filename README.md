# online-banners

![](https://media.giphy.com/media/3o6Mbmg6AchRmB4ylO/giphy.gif)

### Online banners for Doubleclick
This tool was created to allow online marketers and creatives to publish online banners.
- **As a online marketer**, I can add and edit the banner details on a [Google Sheet](https://docs.google.com/spreadsheets/d/1WTqvEYtfxTTAxat7yuplbz5kMKPJupRzOsWtw4CxE2A/edit?usp=sharing).
- **As a creative**, I can get the banner details, add the creative image to the appropriate banner and prepare the production zip files.
- **As a online marketer**, I can upload these created zip files on Google DCM so that they get published.
- **As a online marketer**, I can upload the dynamic banners (prospective & retargeting) with a visual preview.
- **As a creative director**, I can QA the banners before they go on production.
- **As a frontend developer**, I can use the same design system patterns to generate online banners.
- **As a user**, the banners are optimized so that they render fast even on mobile and on different screen resolutions.

## Requirements
- [Latest Node.js installed](https://nodejs.org)
- [Git client installed](http://google.com)
- Unix OS (developed for macOS)
- Access to the Google Sheet [Google Sheet](https://docs.google.com/spreadsheets/d/1WTqvEYtfxTTAxat7yuplbz5kMKPJupRzOsWtw4CxE2A/edit?usp=sharing)
- `client_secret.json` file in the project root for enabling the OAuth with the [Google Sheet API](https://developers.google.com/sheets/api/).

## Install instructions
1. Install Github Desktop
2. Connect to your Github account
3. Clone this repository
4. Navigate to the **01_Quickstart** folder
5. Run **01_installer.command**
6. If you get no error and a message like `All set-up! On est pas bien là?`you're good to go!

## Start server
To preview dynamic banner you need to run a server locally.
1. Run **02_start** to start the server
2. It will open a browser window with all the generated banners

## Synchronize with Google Sheet
On the Google Sheet named `Manual Creative Input Sheet` you can add new banners.
Each row has a unique ID which is automatically created when you do add a new banner

To synchronize the banner:
1. Navigate to the **01_Quickstart** folder
2. Run **03_synch.command**

### First time synch
If it's the first time you run it, it will prompt you to visit a page on the terminal.
Follow the steps decribed there by visiting the page, copy/paste the access key.
It will save the credentials on your computer.
Run again **03_synch.command** to finally sync the sheet data.

### Update static banner creative (merchant deal, product deal, voucher deal)
You can update a specific banner with its ID
1. Run **04_update.command**
2. It will prompt you for the banner type, select the right one by entering the right number
3. It will prompt you for the banner ID, copy/paste it from Google Sheet
4. The task will render the selected banner.
5. You can preview it in your browser using the window opened by the ***03

## Update banners styling
The banners are prototyped in Kvasir:
- [Merchant Deal](http://styleguide.siroop.design/components/detail/b-merchant-deal)
- [Product Deal](http://styleguide.siroop.design/components/detail/b-product-deal)
- [Voucher Deal](http://styleguide.siroop.design/components/detail/b-voucher-deal)
- [Retargeting](http://styleguide.siroop.design/components/detail/b-retargeting)
- [Prospective](http://styleguide.siroop.design/components/detail/b-prospective)

If the CSS needs to be updates, you can copy the following CSS: 
[kvasir-banners.css](http://styleguide.siroop.design/css/kvasir-banners.css)
and save it under `source/css/`




