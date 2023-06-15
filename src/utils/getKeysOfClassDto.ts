import { getMetadataStorage } from 'class-validator';

export const getKeyOfClassDto = (dto: any) => {
  const metadata = getMetadataStorage();
  const propertyNames = metadata
    .getTargetValidationMetadatas(dto, '', true, true)
    .map((metadata) => metadata.propertyName);

  return propertyNames;
};
