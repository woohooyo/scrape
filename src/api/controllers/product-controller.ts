import { IRouterContext } from 'koa-router';
import { IProductQuery } from '../routes/product';
import { ProductService } from '../services/product-service';

const productService = new ProductService();

export class ProductController {
  public static async get(ctx: IRouterContext) {
    const query: IProductQuery = ctx.request.query;
    ctx.body = await productService.getProducts(query);
  }

  public static async post(ctx: IRouterContext) {
    await productService.manualScrapeProducts();
    ctx.body = 'Scrapping product!';
  }

}
