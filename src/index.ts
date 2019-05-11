import { runApi } from './api';
import { runScrape } from './scrape';

(async () => {
  await runApi();
  await runScrape();
})();
