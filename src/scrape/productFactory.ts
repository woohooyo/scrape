import { IProduct } from '../mongo/models/product';

export class ProductFactory {
  private batchId: number;

  public setBatchId(batchId: number) {
    this.batchId = batchId;
  }

  public getProduct (rawContent: Cheerio): IProduct {
    try {
      const product: IProduct = {
        coupon: {},
      };
      product.title = this.getTitle(rawContent);
      product.batchId = this.batchId;
      product.discountPrice = this.getDiscountPrice(rawContent);
      product.salesVolume = this.getSalesVolume(rawContent);
      product.commissionPercent = this.getCommissionPercent(rawContent);
      product.productId = this.getProductId(rawContent);
      product.isTmall = this.getIsTmall(rawContent);
      product.coupon.couponPrice = this.getCouponPrice(rawContent);
      product.coupon.remainingAmount = this.getRemainingAmount(rawContent);
      product.coupon.totalAmount = this.getTotalAmount(rawContent);
      product.coupon.receivedAmount = product.coupon.totalAmount - product.coupon.remainingAmount;
      product.price = product.discountPrice + product.coupon.couponPrice;
      return product;
    } catch (error) {
      console.log(error);
    }
  }

  private getTitle(rawContent: Cheerio): string {
    return rawContent.find('.goods-tit a').attr('title').trim();
  }

  private getDiscountPrice(rawContent: Cheerio): number {
    const dataConfig = rawContent.find('.goods-img a').attr('data-config').trim();
    return Number(dataConfig.match(/price\:\'(\d+(\.\d+)*)\'/i)[1]);
  }

  private getSalesVolume(rawContent: Cheerio): string {
    return rawContent.find('.goods-info span.fl b').text().trim();
  }

  private getCommissionPercent(rawContent: Cheerio): string {
    return rawContent.find('.goods-yj p').text().trim();
  }

  private getProductId(rawContent: Cheerio): string {
    return rawContent.find('span[data-page="quanPage"]').attr('data-gid').trim();
  }

  private getCouponPrice(rawContent: Cheerio): number {
    const dataConfig = rawContent.find('.goods-img a').attr('data-config').trim();
    return Number(dataConfig.match(/coupon\:\'(\d+(\.\d+)*)\'/i)[1]);
  }

  private getRemainingAmount(rawContent: Cheerio): number {
    return Number(rawContent.find('.margin-num b').text().trim());
  }

  private getTotalAmount(rawContent: Cheerio): number {
    const text = rawContent.find('span[class="margin-num"]').text().trim();
    return Number(text.match(/\/(\d+)$/)[1]);
  }

  private getIsTmall(rawContent: Cheerio): boolean {
    return !!rawContent.find('.tag-tmall').attr('title');
  }
}
