import * as Cheerio from 'cheerio';
import * as _ from 'lodash';
import { mongoConfig } from '../config';
import { Logger } from '../lib/logger';
import { IProduct, Product } from '../mongo/models/product';
import { HttpClient } from './http-client';
import { ProductFactory } from './productFactory';

export class Scrape {
  private productModel = new Product(mongoConfig);
  private httpClient: HttpClient;
  private productFactory = new ProductFactory();
  private products: IProduct[] = [];
  private logger: Logger;

  constructor() {
    this.logger = new Logger(true);
    this.httpClient = new HttpClient(this.logger);
  }

  public async SyncProducts() {
    try {
      const batchId = await this.getNextBatchId();
      this.productFactory.setBatchId(batchId);
      await this.getProducts();
      await this.fillProducts();
      await this.fillIsSellerCoupon();
      await this.pushMongo();
    } catch (error) {
      console.log(error);
      await this.logger.error('Sync product error.', error);
    }
  }

  private async pushMongo() {
    if (!this.products.length) { return; }
    const productBulk =  await this.productModel.initBulkOps();
    for (const product of this.products) {
      if (!product) { return; }
      product.createdBy = 'scrape services';
      product.createdAt = new Date();
      await productBulk.insert(product);
    }
    await productBulk.execute();
  }

  private async getNextBatchId(): Promise<number> {
    const product = await this.productModel.getOne({}, {sort: {batchId: -1}});
    if (!product || !product.batchId) { return 1; }
    return product.batchId + 1;
  }

  private async getProducts() {
    do {
      const pages = await this.httpClient.fetch();
      for (const page of pages) {
        const $ = Cheerio.load(page);
        const productList = $('.goods-item-content');
        if (productList && productList.length !== 0) {
          productList.each(async (index, product) => {
            const $el = $(product);
            const extraProduct = this.productFactory.getProduct($el);
            if (extraProduct) { this.products.push(extraProduct); }
          });
        }
      }
    } while (!this.httpClient.isLastPage());
  }

  private async fillProducts() {
    const productPerBatch = 20;
    let fillTasks = [];
    for (let i = 0; i < this.products.length ; i++) {
      fillTasks.push(this.fillProduct(this.products[i]));
      if (i % productPerBatch === 0 || i === (this.products.length - 1)) {
        await Promise.all(fillTasks);
        fillTasks = [];
      }
    }
  }

  private async fillProduct(product: IProduct) {
    try {
      const copywritingPage = await this.httpClient.getCopywritingPage(product.productId);
      const $ = Cheerio.load(copywritingPage);
      product.taoBaoUrl = this.getTaoBaoUrl($);
      product.coupon.couponUrl = await this.getCouponUrl($);
      product.activityId = this.getActivityId(product.coupon.couponUrl);
      product.sellerId = this.getSellerId(product.coupon.couponUrl);
      product.isTaoKeYi = await this.getIsTaoKeYi(product.coupon.couponUrl);
    } catch (error) {
      console.log('fill product error');
      await this.logger.warn('fill product error', error);
    }
  }

  private getTaoBaoUrl($: CheerioStatic): string {
    return $('a').last().text().trim();
  }

  private getActivityId(couponUrl: string): string {
    return couponUrl.match(/activityId=(\w+)/i)[1];
  }

  private getSellerId(couponUrl: string): string {
    return couponUrl.match(/sellerId=(\d+)/i)[1];
  }

  private getCouponUrl($: CheerioStatic): string {
    return $('a').first().text().trim();
  }

  private async getIsTaoKeYi(couponUrl: string): Promise<boolean> {
    const taoKeYiData = await this.httpClient.getTaoKeYiData(couponUrl);
    return !!taoKeYiData.data.length;
  }

  private fillIsSellerCoupon() {
    const groupedProducts = _.groupBy(this.products, (product) => product.activityId);
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
