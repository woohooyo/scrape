import { mongoConfig } from '../../config';
import { IProduct, Product } from '../../mongo/models/product';

export class ProductService {
  private productModel = new Product(mongoConfig);

  public async getProducts(query: IProduct) {
    const latestProduct = await this.productModel.getOne({}, { sort: { batchId: -1 } });
    if (!latestProduct || !latestProduct.batchId) {
      return [];
    }
    const products = await this.productModel.get({ batchId: latestProduct.batchId });
    return { products };
  }
}
