import { mongoConfig } from '../../config';
import { IProduct, Product } from '../../mongo/models/product';

const productModel = new Product(mongoConfig);

export class ProductService {

  public async getProducts(query: IProduct) {
    const latestProduct = await productModel.getOne({}, { sort: { batchId: -1 } });
    if (!latestProduct || !latestProduct.batchId) {
      return [];
    }
    const products = await productModel.get({ batchId: latestProduct.batchId });
    return { products };
  }
}
