import { IProduct } from '../../mongo/models/product';

export class ProductFactory {

  public async getProduct (productContent: Cheerio): Promise<IProduct> {
    const product: IProduct = {};
    product.isDaTaoKe = await this.getIsDaTaoKe();
    product.isTaoKeYi = await this.getIsTaoKeYi();
    product.productId = await this.getProductId();
    product.TaoBaoProductId = await this.getTaoBaoProductId();
    product.detailUrl = await this.getDetailUrl();
    product.title = await this.getTitle();
    product.subTitle = await this.getSubTitle();
    product.image = await this.getImage();
    return;
  }

  private async getIsDaTaoKe(): Promise<boolean> {
    return;
  }

  private async getIsTaoKeYi(): Promise<boolean> {
    return;
  }

  private async getProductId(): Promise<number> {
    return;
  }

  private async getTaoBaoProductId(): Promise<number> {
    return;
  }

  private async getDetailUrl(): Promise<string> {
    return;
  }

  private async getTitle(): Promise<string> {
    return;
  }

  private async getSubTitle(): Promise<string> {
    return;
  }

  private async getImage(): Promise<string> {
    return;
  }

  private async getCategoryId(): Promise<number> {
    return;
  }

  private async getPrice(): Promise<number> {
    return;
  }

  private async getIsTianMao(): Promise<boolean> {
    return;
  }

  private async getSalesVolume(): Promise<number> {
    return;
  }

  private async getScore(): Promise<number> {
    return;
  }

  private async getVendorId(): Promise<number> {
    return;
  }

  private async getPlannedCommission(): Promise<number> {
    return;
  }

  private async getXxxxxxCommission(): Promise<number> {
    return;
  }

  private async getPlanUrl(): Promise<string> {
    return;
  }

  private async getPlanStatus(): Promise<boolean> {
    return;
  }

  private async getCopywriting(): Promise<string> {
    return;
  }

  private async getCouponPage() {
    return;
  }

  private async getCouponId(): Promise<string> {
    return;
  }

  private async getCouponPrice(): Promise<number> {
    return;
  }

  private async getCouponDiscontnPrice(): Promise<number> {
    return;
  }

  private async getCouponEndTime(): Promise<Date> {
    return;
  }

  private async getCouponRemainingAmount(): Promise<number> {
    return;
  }

  private async getCouponReceivedAmount(): Promise<number> {
    return;
  }

  private async getCouponConditionPrice(): Promise<number> {
    return;
  }

  private async getCouponPhoneShortLink(): Promise<string> {
    return;
  }

  private async getCouponPhoneLink(): Promise<string> {
    return;
  }
}
