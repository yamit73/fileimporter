import { BaseModel, IBaseModel } from "./BaseModel";

interface IAttributeMapping extends IBaseModel {
  [key: string]: any;
}

class AttributeMapping extends BaseModel<IAttributeMapping> {
  protected collectionName: string = "attribute_mapping";
}

export { IAttributeMapping, AttributeMapping };
