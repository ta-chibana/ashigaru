#! /usr/bin/env /usr/local/bin/node
const puppeteer = require('puppeteer');
const Jimp = require('jimp');

const MENU_URL = 'http://bento-shogun.jp/menu/today/';

const fetchItems = async browser => {
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

  return items;
};

const fetchImage = async url => {
  const image = await Jimp.read(url);
  return await image.resize(390, 300)
    .getBuffer(Jimp.MIME_JPEG, (_, buffer) => (
      Buffer.from(buffer).toString('base64')
    ));
};

const printItems = async items => {
  items.forEach(async item => {
    const image = await fetchImage(item.imageUrl);
    console.log(item.name);
    console.log(`--| image=${image}`);
  });
};

(async () => {
  const browser = await puppeteer.launch();

  console.log(':bento:');
  console.log('---');

  try {
    const items = await fetchItems(browser);
    printItems(items);
  } catch (e) {
    console.error(e);
  } finally {
    console.log('refresh | color=red refresh=true')
    await browser.close();
  }
})();
