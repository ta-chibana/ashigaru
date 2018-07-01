const puppeteer = require('puppeteer');

const BASE_URL = 'http://bento-shogun.jp/menu';
// const TODAY_MENU_URL = `${BASE_URL}/today/`;
const WEEK_MENU_URL = `${BASE_URL}/week/`;

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(WEEK_MENU_URL, {
    waitUntil: 'networkidle0'
  });

  const imageUrls = await page.$$eval('.item-image', images => {
    return Array.prototype.map.call(images, image => (
      image
        .getAttribute('style')
        .match(/background-image:url\(([\w|:|\/\-|\.|\.\?]+)\);/)[1]
    ));
  });

  console.log(imageUrls);

  await browser.close();
})();
