import { BaseModel, IBaseModel } from "./BaseModel";

interface IProduct extends IBaseModel {
  title: string;
  description: string;
  price: number;
  qty: number;
  sku: string;
  brand: string;
  tags?: string | null;
  main_image: string;
  additional_images: string[];
  category?: string | null;
  sale_price?: number;
  group_id: string;
}

class ProductModel extends BaseModel<IProduct> {
  protected collectionName: string = "product_container";

  async createMany(products: IProduct[]): Promise<boolean | number> {
    try {
      await this.init();
      const result = await this.collection?.insertMany(products);
      return result?.insertedCount ?? 0 > 0;
    } catch (error) {
      console.log("erroe while creating multiple products!!");
      throw error;
    }
  }

  async deleteProducts(query: Partial<any>): Promise<boolean> {
    try {
      await this.init();
      const result = await this.collection?.deleteMany(query);
      return true;
    } catch (error) {
      throw error;
    }
  }
}

export { ProductModel, IProduct };
