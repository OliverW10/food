import { parse, stringify } from "flatted";

export const flattedTransformer = {
  serialize: (object: unknown) => stringify(object),
  deserialize: (object: unknown) => parse(object as string),
};
