import { convertCamelToSnakeCase, convertSnakeToCamelCase } from "./utils";

export const clientFormatToServerFormat = (clientData: any): any => {
  return convertCamelToSnakeCase(clientData);
};

export const serverFormatToClientFormat = (serverData: any): any => {
  return convertSnakeToCamelCase(serverData);
};
