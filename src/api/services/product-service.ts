import * as _ from 'lodash';
import { mongoConfig } from '../../config';
import { Product } from '../../mongo/models/product';
import { Queue } from '../../mongo/models/queue';
import { runScrape } from '../../scrape';
import { IProductQuery } from '../routes/product';

const productModel = new Product(mongoConfig);
const queueModel = new Queue(mongoConfig);

export class ProductService {

  public async getProducts(query: IProductQuery) {
    const latestProduct = await productModel.getOne({}, { sort: { batchId: -1 } });
    if (!latestProduct || !latestProduct.batchId) {
      return [];
    }
    const filterWhere = this.getFilterWhere(query);
    filterWhere.batchId = latestProduct.batchId;
    const filterProducts = await productModel.get(filterWhere);
    const products = _.sortBy(filterProducts, (product) => Number(product.sellerId));
    const page = Number(query.page);
    const limit = Number(query.limit);
    return {
      totalProductsAmount: products.length,
      products: products.slice((page - 1) * limit, (page * limit)),
    };
  }

  public async manualScrapeProducts() {
    const queues = await queueModel.get({});
    if (queues.length > 0) { return; }
    runScrape('manual scrape');
  }

  private getFilterWhere(filterCondition: IProductQuery) {
    const where: any = {};
    if (filterCondition.productName) { where.title = new RegExp(filterCondition.productName, 'gi'); }
    if (filterCondition.isTaoKeYi) { where.isTaoKeYi = (filterCondition.isTaoKeYi === 'true'); }
    if (filterCondition.isSellerCoupon) { where.isSellerCoupon = (filterCondition.isSellerCoupon === 'true'); }
    if (filterCondition.maxDiscountPrice) {
      if (!where.discountPrice) { where.discountPrice = {}; }
      where.discountPrice.$lte = Number(filterCondition.maxDiscountPrice);
    }
    if (filterCondition.minDiscountPrice) {
      if (!where.discountPrice) { where.discountPrice = {}; }
      where.discountPrice.$gte = Number(filterCondition.minDiscountPrice);
    }
    if (filterCondition.maxCouponPrice) {
      if (!where['coupon.couponPrice']) { where['coupon.couponPrice'] = {}; }
      where['coupon.couponPrice'].$lte = Number(filterCondition.maxCouponPrice);
    }
    if (filterCondition.minCouponPrice) {
      if (!where['coupon.couponPrice']) { where['coupon.couponPrice'] = {}; }
      where['coupon.couponPrice'].$gte = Number(filterCondition.minCouponPrice);
    }
    if (filterCondition.maxReceivedCouponAmount) {
      if (!where['coupon.receivedAmount']) { where['coupon.receivedAmount'] = {}; }
      where['coupon.receivedAmount'].$lte = Number(filterCondition.maxReceivedCouponAmount);
    }
    if (filterCondition.minReceivedCouponAmount) {
      if (!where['coupon.receivedAmount']) { where['coupon.receivedAmount'] = {}; }
      where['coupon.receivedAmount'].$gte = Number(filterCondition.minReceivedCouponAmount);
    }
    return where;
  }

}
