#! /usr/bin/env /usr/local/bin/node
const puppeteer = require('puppeteer');

const WEEK_MENU_URL = 'http://bento-shogun.jp/menu/week/';

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

  await browser.close();

  console.log('🍤');
  console.log('---');
  for (let url of imageUrls) {
    console.log(url);
  }
})();
