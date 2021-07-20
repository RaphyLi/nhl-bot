import { PATH_METADATA } from '../../core/injector/constants';
import { isUndefined, isString } from '../../core/utils/shared.utils';

export function Controller(prefix?: string): ClassDecorator {
  const defaultPath = '/';

  const path = isUndefined(prefix) ? defaultPath : prefix;

  return (target: Object) => {
    Reflect.defineMetadata(PATH_METADATA, path, target);
    // container.addController(target);
  };
}
