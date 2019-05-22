import { runApi } from './api';
import { mongoConfig } from './config';
import { Queue } from './mongo/models/queue';
import { runScrape } from './scrape';

const timedScrape = async () => {
  const queueModel = new Queue(mongoConfig);
  while (1) {
    const queues = await queueModel.get({});
    if (!queues.length) {
      runScrape();
    }
    await new Promise(resolve => setTimeout(resolve, 1000 * 60 * 60 * 4));
  }
};

(async () => {
  await runApi();
  await timedScrape();
})();
