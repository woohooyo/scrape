import { mongoConfig } from '../config';
import { IProduct, Product } from '../mongo/models/product';

export class ProductService {
  private productModel = new Product(mongoConfig);

  public async getProducts(query: IProduct) {
    const products = await this.productModel.get({});
    return {
      products,
    };
  }
}
