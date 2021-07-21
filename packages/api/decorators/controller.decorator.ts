import { isUndefined, PATH_METADATA } from '@nhl/core';

export function Controller(prefix?: string): ClassDecorator {
  const defaultPath = '/';

  const path = isUndefined(prefix) ? defaultPath : prefix;

  return (target: Object) => {
    Reflect.defineMetadata(PATH_METADATA, path, target);
    // container.addController(target);
  };
}
