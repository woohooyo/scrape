import { mongoConfig } from '../../config';
import { IProduct, Product } from '../../mongo/models/product';
import { Queue } from '../../mongo/models/queue';
import { runScrape } from '../../scrape';

const productModel = new Product(mongoConfig);
const queueModel = new Queue(mongoConfig);

export class ProductService {

  public async getProducts(query: IProduct) {
    const latestProduct = await productModel.getOne({}, { sort: { batchId: -1 } });
    if (!latestProduct || !latestProduct.batchId) {
      return [];
    }
    const products = await productModel.get({ batchId: latestProduct.batchId });
    return { products };
  }

  public async manualScrapeProducts() {
    const queues = await queueModel.get({});
    if (queues.length > 0) { return; }
    runScrape('manual scrape');
  }
}
