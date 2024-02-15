export const convertCamelToSnakeCase = (obj: any): any => {
  if (typeof obj !== 'object' || obj === null || obj instanceof File) {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(convertCamelToSnakeCase);
  }
  return Object.keys(obj).reduce((acc, current) => {
    const key = camelToSnakeCase(current);
    const value = convertCamelToSnakeCase(obj[current]);
    acc[key] = value;
    return acc;
  }, {} as any);
};

export const convertSnakeToCamelCase = (obj: any): any => {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(convertSnakeToCamelCase);
  }
  return Object.keys(obj).reduce((acc, current) => {
    const key = snakeToCamelCase(current);
    const value = convertSnakeToCamelCase(obj[current]);
    acc[key] = value;
    return acc;
  }, {} as any);
};

const camelToSnakeCase = (str: string): string => {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
};

const snakeToCamelCase = (str: string): string => {
  return str.replace(/(_\w)/g, k => k[1].toUpperCase());
};
