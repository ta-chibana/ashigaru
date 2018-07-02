#! /usr/bin/env /usr/local/bin/node
const puppeteer = require('puppeteer');

const MENU_URL = 'http://bento-shogun.jp/menu/today/';

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto(MENU_URL, {
    waitUntil: 'networkidle0'
  });

  const items = await page.$$eval('.item', items => {
    return Array.prototype.map.call(items, item => {
      const name = item.querySelector('.item-name').innerText;

      const imageUrl = item
        .querySelector('.item-image')
        .getAttribute('style')
        .match(/background-image:url\(([\w|:|\/\-|\.|\.\?]+)\);/)[1];

      return { name, imageUrl };
    });
  });

  await browser.close();

  console.log('🍤');
  console.log('---');
  for (let item of items) {
    const encodedUrl = Buffer
      .from(item.imageUrl, 'utf8')
      .toString('base64');
    console.log(`${item.name}|image=${encodedUrl}`);
    console.log('---');
  }
})();
