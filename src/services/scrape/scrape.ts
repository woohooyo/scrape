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
    const batchId = await this.getNextBatchId();
    this.productFactory.setBatchId(batchId);
    await this.getProducts();
    await this.fillIsSellerCoupon();
    await this.pushMongo();
  }

  private async pushMongo() {
    const productBulk =  await this.productModel.initBulkOps();
    for (const product of this.products) {
      product.createdBy = 'scrape services';
      product.createdAt = new Date();
      await productBulk.insert(product);
    }
    await productBulk.execute();
  }

  private async getNextBatchId(): Promise<number> {
    const allProduct = await this.productModel.get({}, null, 'batchId', -1);
    if (!allProduct[0] || !allProduct[0].batchId) { return 1; }
    return allProduct[0].batchId + 1;
  }

  private async getProducts() {
    const pages = await this.httpClient.fetch();
    for (const page of pages) {
      const $ = Cheerio.load(page);
      const productList = $('.goods-item-content');
      if (productList && productList.length !== 0) {
        const productTasks = [];
        productList.each(async (index, product) => {
          productTasks.push(this.fillProduct($, product));
        });
        await Promise.all(productTasks);
      }
    }
  }

  private async fillProduct($: CheerioStatic, productContent: CheerioElement) {
    const $el = $(productContent);
    const scrappedProduct = await this.productFactory.getProduct($el);
    const couponUrl = await this.getCouponUrl(scrappedProduct.productId);
    scrappedProduct.sellerId = await this.getSellerId(couponUrl);
    scrappedProduct.isTaoKeYi = await this.getIsTaoKeYi(couponUrl);
    this.products.push(scrappedProduct);
  }

  private async getSellerId(couponUrl: string): Promise<string> {
    return couponUrl.match(/sellerId=(\d+)/i)[1];
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

  private fillIsSellerCoupon() {
    const groupedProducts = _.groupBy(this.products, (product) => product.sellerId);
    const sellerCouponProductIds: string[] = [];
    _.forIn(groupedProducts, (value, key) => {
      if (value.length > 1) {
        value.forEach((product) => sellerCouponProductIds.push(product.productId));
      }
    });
    this.products.forEach((value) => {
      if (sellerCouponProductIds.includes(value.productId)) {
        value.isSellerCoupon = true;
      } else {
        value.isSellerCoupon = false;
      }
    });
  }
}
