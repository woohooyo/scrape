import { IProduct } from '../../mongo/models/product';

export class ProductFactory {

  public async getProduct (rawContent: Cheerio): Promise<IProduct> {
    const product: IProduct = {
      coupon: {},
    };
    product.title = this.getTitle(rawContent);
    product.discountPrice = this.getDiscountPrice(rawContent);
    product.salesVolume = this.getSalesVolume(rawContent);
    product.commissionPercent = this.getCommissionPercent(rawContent);
    product.productId = this.getProductId(rawContent);
    product.coupon.couponPrice = this.getCouponPrice(rawContent);
    product.coupon.remainingAmount = this.getRemainingAmount(rawContent);
    product.coupon.totalAmount = this.getTotalAmount(rawContent);
    return product;
  }

  private getTitle(rawContent: Cheerio): string {
    return rawContent.find('.goods-tit a').attr('title').trim();
  }

  private getDiscountPrice(rawContent: Cheerio): number {
    const dataConfig = rawContent.find('.goods-img a').attr('data-config').trim();
    return Number(dataConfig.match(/price\:\'(\d+(\.\d+)*)\'/)[1]);
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
    return Number(dataConfig.match(/coupon\:\'(\d+(\.\d+)*)\'/)[1]);
  }

  private getRemainingAmount(rawContent: Cheerio): number {
    return Number(rawContent.find('.margin-num b').text().trim());
  }

  private getTotalAmount(rawContent: Cheerio): number {
    const text = rawContent.find('span[class="margin-num"]').text().trim();
    return Number(text.match(/\/(\d+)$/)[1]);
  }
}
