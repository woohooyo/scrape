import { Scrape } from './scrape';

(async () => {
  try {
    const scrape = new Scrape();
    await scrape.SyncProducts();
  } catch (error) {
    console.log(error);
  }
})();
