import { Scrape } from './scrape';

export const runScrape = async() => {
  try {
    const scrape = new Scrape();
    await scrape.SyncProducts();
  } catch (error) {
    console.log(error);
  }
};
