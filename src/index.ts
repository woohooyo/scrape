import * as Koa from 'koa';

import { router } from './routes';

process.on('unhandledRejection', e => { throw e; });

(async () => {
  const PORT = process.env.PORT || 8080;
  const app = new Koa();
  app.use(router.routes());
  app.listen(PORT, () => console.log(`Checklist API listening on port: ${PORT}`));
  console.log(router.stack.map(i => i.path));
})();
