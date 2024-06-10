import { BaseModel, IBaseModel } from "./BaseModel";

interface IProduct extends IBaseModel {
  title: string;
  description: string;
  price: number | null;
  qty: number;
  sku: string;
  brand: string;
  tags?: string | null;
  main_image: string;
  additional_images: string[];
  category?: string | null;
  sale_price?: number | null;
  group_id: string;
  additional_attibutes: { [key: string]: any } | null;
  [key: string]: any;
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

  async deleteProducts(query: Partial<any>): Promise<boolean | number> {
    try {
      await this.init();
      const result = await this.collection?.deleteMany(query);
      return result?.deletedCount ?? 0 > 0;
    } catch (error) {
      throw error;
    }
  }
}

export { ProductModel, IProduct };
