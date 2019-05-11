import * as cors from '@koa/cors';
import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import { errorHandlerInterceptor } from './interceptors/catch-errors';
import { jwtAuth } from './interceptors/jwt-auth';

import { router } from './routes';

process.on('unhandledRejection', e => { throw e; });

export const runApi = async() => {
  try {
    const PORT = Number(process.env.PORT) || 8080;
    const app = new Koa();
    app.use(bodyParser());
    app.use(cors());
    app.use(async (ctx, next) => {
      console.info(`request details - : ${JSON.stringify(ctx.request)}`);
      await next();
    });
    app.use(errorHandlerInterceptor);
    app.use(jwtAuth);
    app.use(router.routes());

    app.on('error', async (error) => await console.error(`[Koa on error]: ${error.message}`));
    app.listen(PORT, () => console.log(`Checklist API listening on port: ${PORT}`));
    router.stack.map((i) => {
      console.log(`${i.methods}: ${i.path}`);
    });
  } catch (error) {
    console.log(error);
  }
};
