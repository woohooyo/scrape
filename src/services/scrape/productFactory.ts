import { IProduct } from '../../mongo/models/product';

export class ProductFactory {
  private rawContent: Cheerio;

  public setRawContent(productContent: Cheerio) {
    this.rawContent = productContent;
  }

  public async getProduct (): Promise<IProduct> {
    const product: IProduct = {
      coupon: {},
    };
    product.title = this.getTitle();
    product.discountPrice = this.getDiscountPrice();
    product.salesVolume = this.getSalesVolume();
    product.commissionPercent = this.getCommissionPercent();
    product.productId = this.getProductId();
    product.coupon.couponPrice = this.getCouponPrice();
    product.coupon.remainingAmount = this.getRemainingAmount();
    product.coupon.totalAmount = this.getTotalAmount();
    return product;
  }

  private getTitle(): string {
    return this.rawContent.find('.goods-tit a').attr('title').trim();
  }

  private getDiscountPrice(): number {
    const dataConfig = this.rawContent.find('.goods-img a').attr('data-config').trim();
    return Number(dataConfig.match(/price\:\'(\d+(\.\d+)*)\'/)[1]);
  }

  private getSalesVolume(): string {
    return this.rawContent.find('.goods-info span.fl b').text().trim();
  }

  private getCommissionPercent(): string {
    return this.rawContent.find('.goods-yj p').text().trim();
  }

  private getProductId(): string {
    return this.rawContent.find('span[data-page="quanPage"]').attr('data-gid').trim();
  }

  private getCouponPrice(): number {
    const dataConfig = this.rawContent.find('.goods-img a').attr('data-config').trim();
    return Number(dataConfig.match(/coupon\:\'(\d+(\.\d+)*)\'/)[1]);
  }

  private getRemainingAmount(): number {
    return Number(this.rawContent.find('.margin-num b').text().trim());
  }

  private getTotalAmount(): number {
    const text = this.rawContent.find('span[class="margin-num"]').text().trim();
    return Number(text.match(/\/(\d+)$/)[1]);
  }
}
