import * as Cheerio from 'cheerio';
import * as _ from 'lodash';
import { mongoConfig } from '../../config';
import { IProduct, Product } from '../../mongo/models/product';
import { HttpClient } from './http-client';
import { ProductFactory } from './productFactory';

export class Scrape {
  private productModel = new Product(mongoConfig);
  private httpClient = new HttpClient();
  private productFactory = new ProductFactory();
  private products: IProduct[] = [];

  public async SyncProducts() {
    await this.getProducts();
    await this.pushMongo();
    return;
  }

  private async pushMongo() {
    return;
  }

  private async getProducts() {
    const pages = await this.httpClient.fetch();
    for (const page of pages) {
      const $ = Cheerio.load(page);
      const productList = $('.goods-item-content');
      if (productList && productList.length !== 0) {
        productList.each(async (index, product) => {
          const $el = $(product);
          this.productFactory.setRawContent($el);
          const scrappedProduct = await this.productFactory.getProduct();
          const couponUrl = await this.getCouponUrl(scrappedProduct.productId);
          scrappedProduct.isTaoKeYi = await this.getIsTaoKeYi(couponUrl);
          this.products.push(scrappedProduct);
        });
      }
    }
  }

  private async getCouponUrl(productId: string): Promise<string> {
    const copywritingPage = await this.httpClient.getCopywritingPage(productId);
    const $ = Cheerio.load(copywritingPage);
    return $('a').first().text().trim();
  }

  private async getIsTaoKeYi(couponUrl: string): Promise<boolean> {
    const taoKeYiData = await this.httpClient.getTaoKeYiData(couponUrl);
    return _.includes(taoKeYiData, '大淘客');
  }
}
