import { IRouterContext } from 'koa-router';
import { IProduct } from '../../mongo/models/product';
import { runScrape } from '../../scrape';
import { ProductService } from '../services/product-service';

const productService = new ProductService();

export class ProductController {
  public static async get(ctx: IRouterContext) {
    const body: IProduct = ctx.request.query;
    ctx.body = await productService.getProducts(body);
  }

  public static async post(ctx: IRouterContext) {
    await runScrape();
    ctx.body = 'Scrapping product!';
  }

}
