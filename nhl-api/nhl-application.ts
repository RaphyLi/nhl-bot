import { CronManager, DatabaseService, Logger, ScheduleService } from '@nhl/common';
import { NHLContainer } from '@nhl/core';
import { RouterResolver } from './router/router.resolver';
import { HttpAdapter } from './express/http-adapter';
import { FranchiseController } from './franchise/franchise.controller';

export class NHLApplication {
  private readonly logger = new Logger('NHLApplicationAPI');
  private readonly nhlContainer = new NHLContainer();
  private readonly cronManager: CronManager;
  private readonly routesResolver: RouterResolver;
  private httpServer: any;
  private httpAdapter: HttpAdapter;
  private appOptions: any;

  constructor() {
    this.httpAdapter = new HttpAdapter();
    this.nhlContainer.registerInjectables([DatabaseService, ScheduleService]);
    this.nhlContainer.registerControllers([FranchiseController]);
    this.cronManager = new CronManager(this.nhlContainer);

    this.registerHttpServer();

    this.routesResolver = new RouterResolver(this.nhlContainer);
  }

  public async init(): Promise<this> {
    await this.registerRoutes();

    this.logger.log('NHL API application successfully started');

    return this;
  }

  private registerHttpServer() {
    this.httpServer = this.createServer();
  }

  private createServer<T = any>() {
    this.httpAdapter.initHttpServer(this.appOptions);
    return this.httpAdapter.getHttpServer();
  }

  private async registerRoutes() {
    this.routesResolver.resolve(this.httpAdapter);
  }
}
