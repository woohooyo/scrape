import { mongoConfig } from '../src/config';
import { Product } from '../src/mongo/models/product';
(async() => {
  const productModel = new Product(mongoConfig);
  const products = await productModel.get({batchId: 1});
  for (const product of products) {
    await productModel.deleteOne(product);
  }
  console.log('done');
})();
