import { Logger } from '@nhl/common';
import 'reflect-metadata';
import { PARAMTYPES_METADATA, SELF_DECLARED_DEPS_METADATA, INJECTABLE_METADATA } from './constants';
import { Controller } from './interfaces/controller.interface';
import { Type } from './interfaces/type.interface';
import { Injectable } from '../metadata/injectable.decorator';
import { Injector } from './injector';

export class NHLContainer {
  private readonly _injectables = new Map<string, Type>();
  private readonly _controllers = new Map<string, Type>();
  private readonly _instances = new Map<Type, any>();
  private readonly logger = new Logger('NHLContainer');
  private readonly injector = new Injector();

  constructor() {}

  get controllers(): Map<string, Controller> {
    return this._controllers;
  }

  public get<T>(type: Type<T>) {
    return this._instances.get(type);
  }

  public registerInjectables<T>(injectables: Array<Type>) {
    injectables.forEach((injectable) => {
      this._injectables.set(injectable.name, injectable);
      this.injector.loadInstance(injectable, this._instances);
    });
  }

  public registerControllers(controllers: Array<Controller>) {
    controllers.forEach((controller) =>
      this._controllers.set((controller as Type<any>).name, controller as Type)
    );
  }

  public loadController(controller: Controller) {
    this._controllers.get((controller as Type).name);
    this.injector.loadInstance(controller as Type, this._instances);
  }
}
