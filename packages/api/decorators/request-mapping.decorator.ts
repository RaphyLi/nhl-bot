import { METHOD_METADATA, PATH_METADATA } from "@nhl/core";
import { RequestMethod } from "../enums";

export interface RequestMappingMetadata {
  path?: string | string[];
  method?: RequestMethod;
}

const defaultMetadata = {
  [PATH_METADATA]: '/',
  [METHOD_METADATA]: RequestMethod.GET
};

export const RequestMapping = (
  metadata: RequestMappingMetadata = defaultMetadata
): MethodDecorator => {
  const pathMetadata = metadata[PATH_METADATA];
  const path = pathMetadata && pathMetadata.length ? pathMetadata : '/';
  const requestMethod = metadata[METHOD_METADATA] || RequestMethod.GET;

  return (target: Object, key: string | symbol, descriptor: TypedPropertyDescriptor<any>) => {
    Reflect.defineMetadata(PATH_METADATA, path, descriptor.value);
    Reflect.defineMetadata(METHOD_METADATA, requestMethod, descriptor.value);
    return descriptor;
  };
};

const createMappingDecorator =
  (method: RequestMethod) =>
  (path?: string): MethodDecorator => {
    return RequestMapping({
      [PATH_METADATA]: path,
      [METHOD_METADATA]: method
    });
  };

export const All = createMappingDecorator(RequestMethod.ALL);

export const Delete = createMappingDecorator(RequestMethod.DELETE);

export const Get = createMappingDecorator(RequestMethod.GET);

export const Head = createMappingDecorator(RequestMethod.HEAD);

export const Optios = createMappingDecorator(RequestMethod.OPTIONS);

export const Patch = createMappingDecorator(RequestMethod.PATCH);

export const Post = createMappingDecorator(RequestMethod.POST);

export const Put = createMappingDecorator(RequestMethod.PUT);
