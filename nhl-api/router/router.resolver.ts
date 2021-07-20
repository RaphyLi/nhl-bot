import {
  addLeadingSlash,
  Controller,
  isUndefined,
  NHLContainer,
  PATH_METADATA,
  Type
} from '@nhl/core';
import { HttpAdapter } from '../express/http-adapter';

export class RouterResolver {
  constructor(private nhlContainer: NHLContainer) {}

  public resolve(httpAdapter: HttpAdapter) {
    const controllers = this.nhlContainer.controllers;
    controllers.forEach((controller) => {
      this.registerRouters(controller, httpAdapter);
    });
  }

  private registerRouters<T>(controller: Controller, httpAdapter: HttpAdapter) {
    const routes = this.extractRouterPaths(controller as any);
    // Création des controllers
  }

  private extractRouterPaths(metatype: Type<Controller>, prefix = ''): string[] {
    let path = Reflect.getMetadata(PATH_METADATA, metatype);

    if (isUndefined(path)) {
      throw new Error(
        'An invalid controller has been detected. Perhaps, one of your controllers is missing @Controller() decorator.'
      );
    }

    if (Array.isArray(path)) {
      path = path.map((p) => prefix + addLeadingSlash(p));
    } else {
      path = [prefix + addLeadingSlash(path)];
    }

    return path.map((p) => addLeadingSlash(p));
  }
}
