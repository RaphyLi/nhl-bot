import { RequestMethod } from '@nhl/api';
import {
  addLeadingSlash,
  Controller,
  isUndefined,
  NHLContainer,
  PATH_METADATA,
  Type,
  isFunction,
  isConstructor,
  METHOD_METADATA,
  isString
} from '@nhl/core';
import { RouterMethodFactory } from './router-method-factory';
import { HttpServer } from '../http/http-server';

export type RouterProxyCallback = <TRequest, TResponse>(
  req?: TRequest,
  res?: TResponse,
  next?: () => void
) => void;

export interface RouteDefinition {
  path: string[];
  requestMethod: RequestMethod;
  targetCallback: RouterProxyCallback;
  methodName: string;
}

export class RouterResolver {
  private routerMethodFactory = new RouterMethodFactory();
  constructor(private nhlContainer: NHLContainer) {}

  public resolve(httpServer: HttpServer) {
    const controllers = this.nhlContainer.controllers;
    controllers.forEach((controller: any) => {
      this.registerRouters(controller, httpServer);
    });
  }

  private registerRouters<T>(controller: Type<Controller>, httpServer: HttpServer) {
    const routes = this.extractRouterPaths(controller as any);
    const instance = new controller();
    const routerPaths = this.scanForPaths(instance);
    // Création des controllers
    this.applyPathsToRouter(httpServer, routerPaths, instance);
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

  private scanForPaths(instance: Controller): Array<RouteDefinition> {
    const instancePrototype = Object.getPrototypeOf(instance);
    return this.exploreMethodsMetadata(instance, instancePrototype);
  }

  private exploreMethodsMetadata(instance: Controller, prototype: object): Array<RouteDefinition> {
    const routeDefinitions = Array<RouteDefinition>();
    const methodNames = Object.getOwnPropertyNames(prototype).filter(
      (prop) => !isConstructor(prop) && isFunction(instance[prop])
    );
    methodNames.forEach((methodName) => {
      const instanceCallback = instance[methodName];
      const prototypeCallback = prototype[methodName];
      const routePath = Reflect.getMetadata(PATH_METADATA, prototypeCallback);
      const requestMethod: RequestMethod = Reflect.getMetadata(METHOD_METADATA, prototypeCallback);
      const path = isString(routePath)
        ? [addLeadingSlash(routePath)]
        : routePath.map((p: string) => addLeadingSlash(p));
      routeDefinitions.push({
        path,
        requestMethod,
        targetCallback: instanceCallback,
        methodName
      });
    });
    return routeDefinitions;
  }

  private applyPathsToRouter(
    httpServer: HttpServer,
    routeDefinitions: Array<RouteDefinition>,
    instance: Controller
  ) {
    routeDefinitions.forEach((routeDefinition) => {});
  }

  private createRequestHandler() {}
}
