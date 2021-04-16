import 'reflect-metadata';
import { constructor } from './type/constructor';

class DependencyContainer extends Map {
  public resolve<T>(target: constructor<T>): T {
    const params: constructor<T>[] = Reflect.getMetadata('design:paramtypes', target) || [];
    const injections = params.map((param) => this.resolve(param));

    const instance = this.get(target);
    if (instance) {
      return instance;
    }

    const newInstance = new target(...injections);
    this.set(target, newInstance);

    console.log(`[DI]: create class ${newInstance.constructor.name}`);

    return newInstance;
  }

  public release(): void {
    for (const value of this.values()) {
      if (typeof value['release'] === 'function') {
        value['release']();
      }
    }

    this.clear();
  }
}

export const container = new DependencyContainer();
