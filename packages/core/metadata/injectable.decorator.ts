import { INJECTABLE_METADATA } from '../injector/constants';
import { Type } from '../injector/interfaces/type.interface';

export const Injectable = (options?): ((target: Type<any>) => void) => {
  return (target: Type<any>) => {
    Reflect.defineMetadata(INJECTABLE_METADATA, options, target);
    // container.registerInjectable(target);
  };
};
