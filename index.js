#! /usr/bin/env /usr/local/bin/node
const puppeteer = require('puppeteer');
const Jimp = require('jimp');

const MENU_URL = 'http://bento-shogun.jp/menu/today/';

(async () => {
  const browser = await puppeteer.launch();
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

  const fetchImage = async url => {
    const image = await Jimp.read(url);
    return await image.resize(390, 300)
      .getBuffer(Jimp.MIME_JPEG, (_, buffer) => (
        encodedImage = Buffer.from(buffer).toString('base64')
      ));
  }

  console.log('🍱');
  console.log('---');

  for (let item of items) {
    const image = await fetchImage(item.imageUrl);
    console.log(item.name);
    console.log(`--| image=${image}`);
  }
})();
