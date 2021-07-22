import { Logger } from '@nhl/common';
import { INJECTABLE_METADATA, PARAMTYPES_METADATA, SELF_DECLARED_DEPS_METADATA } from './constants';
import { Type } from './interfaces/type.interface';

export class Injector {
  private readonly logger = new Logger('Injector');

  public loadInstance<T>(type: Type<T>, instances: Map<Type, any>) {
    this.instantiateClass(type, instances);
  }

  private instantiateClass<T>(type: Type<T>, instances: Map<Type, T>) {
    const params = this.resolveConstructorParams(type);
    const injections = params.map((param) => this.instantiateClass(param, instances));

    const instance = instances.get(type);
    if (instance) {
      return instance;
    }

    const newInstance = new type(...injections);
    if (Reflect.hasMetadata(INJECTABLE_METADATA, type)) {
      instances.set(type, newInstance);
    }

    this.logger.verbose(`create class ${newInstance.constructor.name}`);

    return newInstance;
    // } else {
    //   throw new Error(
    //     `[DI]: can't inject class ${dependence.name} bacause it doen't have a Decorator @Injectable`
    //   );
    // }
  }

  private resolveConstructorParams<T>(type: Type<T>): Type<T>[] {
    return this.reflectConstructorParams(type);
  }

  private reflectConstructorParams<T>(type: Type<T>): Type<T>[] {
    const paramtypes = Reflect.getMetadata(PARAMTYPES_METADATA, type) || [];
    const selfParams = this.reflectSelfParams<T>(type);

    selfParams.forEach(({ index, param }) => (paramtypes[index] = param));
    return paramtypes;
  }

  private reflectSelfParams<T>(type: Type<T>): any[] {
    return Reflect.getMetadata(SELF_DECLARED_DEPS_METADATA, type) || [];
  }
}
