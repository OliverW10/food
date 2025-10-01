import { parse, stringify } from "flatted";

export const flattedTransformer = {
  serialize: (object: any) => stringify(object),
  deserialize: (object: string) => parse(object),
};
