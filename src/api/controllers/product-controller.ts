import { IRouterContext } from 'koa-router';
import { IProductQuery } from '../routes/product';
import { DownloadService } from '../services/download-service';
import { ProductService } from '../services/product-service';

const productService = new ProductService();

export class ProductController {
  public static async get(ctx: IRouterContext) {
    const query: IProductQuery = ctx.request.query;
    ctx.body = await productService.getProducts(query);
  }

  public static async download(ctx: IRouterContext) {
    const query: IProductQuery = ctx.request.query;
    const { products } = await productService.getProducts(query);
    ctx.set('Content-disposition', `attachment; filename=export.csv`);
    ctx.set('Content-type', 'MimeType');
    ctx.body = await DownloadService.downloadExcel(products);
  }

  public static async post(ctx: IRouterContext) {
    await productService.manualScrapeProducts();
    ctx.body = 'Scrapping product!';
  }

}
