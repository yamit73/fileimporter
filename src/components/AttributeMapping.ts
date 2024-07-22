import { Request, Response } from "express";
import {
  AttributeMapping as AttributeModel,
  IAttributeMapping,
} from "../models/AttributeMapping";
import { Document } from "mongodb";

class AttributeMapping {
  productAttributes: { [key: string]: boolean } = {
    title: true,
    description: true,
    price: true,
    qty: true,
    sku: true,
    brand: true,
    tags: true,
    main_image: true,
    additional_images: true,
    category: true,
    sale_price: true,
    group_id: true
  };
  async getAttributes(req: Request, res: Response) {
    const attributes = [
      "title",
      "description",
      "price",
      "qty",
      "sku",
      "brand",
      "tags",
      "main_image",
      "additional_images",
      "category",
      "sale_price",
      "group_id"
    ];
    return res.status(200).send({ success: true, data: attributes });
  }
  async mapAttribute(req: Request, res: Response) {
    const rawData = req.body;
    const response = this.validateData(rawData);

    if (!response.success) {
      return res.status(400).send(response);
    }

    response.success = true;
    let mappedAttributes: { [key: string]: string } = {};
    for (let [key, value] of Object.entries(rawData)) {
      mappedAttributes[key] = String(value);
    }
    if (Object.entries(mappedAttributes).length > 0) {
      const attributeModel = new AttributeModel();
      await attributeModel.init();
      const result = await attributeModel.update(
        {},
        mappedAttributes as Document,
        true
      );

      if (!result) {
        response.success = false;
        response.errors =
          "Attributes mapping was not updated. Kindly send valid attributes!";
        return res.status(400).send(response);
      }
    } else {
      response.success = false;
      response.errors =
        "Attributes were not mapped. Kindly send valid attributes!";
      return res.status(400).send(response);
    }

    response.data = "Attributes are mapped successfully";
    return res.status(200).send(response);
  }

  private validateData(data: any): {
    success: boolean;
    errors?: string;
    data?: string | [any];
  } {
    if (!data || data.length < 1) {
      return { success: false, errors: "required data is missing" };
    }
    let response = { success: false, errors: "" };
    let invalidAttr: string[] = [];
    for (let [key, value] of Object.entries(data)) {
      if (typeof value !== "string") {
        response.errors =
          "Invalid attribute type. Attributes should be string!";
        return response;
      }
      let modValue = String(value);
      if (!this.productAttributes[modValue]) {
        invalidAttr.push(modValue);
      }
    }
    if (invalidAttr.length > 0) {
      response.errors =
        "Invalid attributes." + invalidAttr.join(",") + ": are invalid";
      return response;
    }
    return { success: true };
  }
}

export default AttributeMapping;
