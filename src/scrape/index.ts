import { mongoConfig } from '../config';
import { Logger } from '../lib/logger';
import { Queue } from '../mongo/models/queue';
import { Scrape } from './scrape';

export const runScrape = async(operator = 'Scrape program') => {
  let logger: Logger;
  try {
    logger = new Logger(false);
    const queueModel = new Queue(mongoConfig);
    const insertKey = 'scrape_task';
    const key = `${insertKey}_${new Date().getTime()}`;
    await queueModel.insertOne({
      key,
      createdBy: operator,
    });
    const scrape = new Scrape();
    await scrape.SyncProducts();
    await queueModel.deleteOne({key});
  } catch (error) {
    console.log(error);
    if (logger) { logger.error('run scrape error', error); }
  }
};
