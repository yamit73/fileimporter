import { AnyBulkWriteOperation } from "mongodb";
import { IProduct, ProductModel } from "./models/ProductModel";

class Products {
  model: ProductModel;
  mainAttributes: { [key: string]: boolean } = {
    title: true,
    description: true,
    price: true,
    qty: true,
    sku: true,
    brand: true,
    tags: false,
    main_image: true,
    additional_images: true,
    category: true,
    sale_price: true,
    group_id: true,
  };

  mappedAtr: { [key: string]: string } = {
    title: "title",
    description: "description",
    price: "price",
    item_group_id: "group_id",
    brand: "brand",
    tags: "tags",
    image_link: "main_image",
    quantity_to_sell_on_facebook: "qty",
    additional_image_link: "additional_images",
    id: "sku",
    sale_price: "sale_price",
    google_product_category: "category",
  };

  constructor() {
    this.model = new ProductModel();
  }

  async createProducts(data: any[]): Promise<boolean | number> {
    try {
      const bulkQuery: AnyBulkWriteOperation[] = [];
      data.forEach((product, key) => {
        let formattedProduct: IProduct = this.formatProduct(product);
        const query: AnyBulkWriteOperation = {
          updateOne: {
            filter: { sku: formattedProduct.sku },
            update: { $set: formattedProduct },
            upsert: true,
          },
        };
        bulkQuery.push(query);
      });
      await this.model.init();
      const result = await this.model.bulkWrite(bulkQuery);
      return result;
    } catch (error) {
      throw error;
    }
  }

  formatProduct(data: any): IProduct {
    const product: Partial<IProduct> = {
      title: "",
      description: "",
      price: null,
      qty: 0,
      sku: "",
      brand: "",
      tags: "",
      main_image: "",
      additional_images: [],
      category: "",
      sale_price: null,
      group_id: "",
      additional_attibutes: null,
    };

    let additionalDetails: { [key: string]: any } = {};
    Object.keys(data).forEach((key: string) => {
      const attr = this.mappedAtr[key];
      if (this.mainAttributes[attr]) {
        product[attr] = this.formatDataTypes(key, data[key]);
      } else {
        additionalDetails[key] = data[key] ?? null;
      }
    });
    product.additional_attibutes = additionalDetails;
    return product as IProduct;
  }

  private formatDataTypes(key: string, value: any) {
    let newValue;
    switch (key) {
      case "price":
        newValue = Number(value.split(" ")[0]);
        break;
      case "quantity_to_sell_on_facebook":
        newValue = parseInt(value);
        break;
      case "sale_price":
        if (value !== "" || value !== null) {
          newValue = Number(value);
        }
        break;
      case "additional_image_link":
        if (value !== "" || value !== null) {
          newValue = value.split(",") ?? [];
        }
        break;
      default:
        newValue = value;
    }

    return newValue;
  }
}

export default Products;
