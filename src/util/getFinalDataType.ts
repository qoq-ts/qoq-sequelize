import { DataType, ModelAttributeColumnOptions } from 'sequelize';
import { AdvancedColumn } from '../columns/AdvancedColumn';

export const getFinalDataType = (obj: AdvancedColumn | DataType | ModelAttributeColumnOptions) => {
  if (obj instanceof AdvancedColumn) {
    return obj.collect();
  } else {
    // For original model like `SequelizeMeta`
    return obj;
  }
};
