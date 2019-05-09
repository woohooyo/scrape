import { IProduct } from '../../mongo/models/product';

export class ProductFactory {

  public async getProduct (productContent: Cheerio): Promise<IProduct> {
    const product: IProduct = {};
    product.title = await this.getTitle();
    product.price = await this.getPrice();
    product.salesVolume = await this.getSalesVolume();
    product.commissionPercent = await this.getCommissionPercent();
    return;
  }

  private async getTitle(): Promise<string> {
    return;
  }

  private async getPrice(): Promise<number> {
    return;
  }

  private async getSalesVolume(): Promise<number> {
    return;
  }

  private async getCommissionPercent(): Promise<number> {
    return;
  }
}
