import express from 'express';
import * as http from 'http';
import * as https from 'https';
import { RequestHandler } from './http-server.interface';

export interface HttpsOptions {
  pfx?: any;
  key?: any;
  passphrase?: string;
  cert?: any;
  ca?: any;
  crl?: any;
  ciphers?: string;
  honorCipherOrder?: boolean;
  requestCert?: boolean;
  rejectUnauthorized?: boolean;
  NPNProtocols?: any;
  SNICallback?: (servername: string, cb: (err: Error, ctx: any) => any) => any;
}

export interface NhlApplicationOptions {
  cors?: boolean;
  httpsOptions?: HttpsOptions;
}

export class HttpServer<TServer = any, TRequest = any, TResponse = any> {
  private instance: any;

  constructor(instance?: any) {
    this.instance = instance || express();
  }

  public use(...args: any[]) {
    return this.instance.use(...args);
  }

  public get(handler: RequestHandler);
  public get(path: any, handler: RequestHandler);
  public get(...args: any[]) {
    return this.instance.get(...args);
  }

  public post(handler: RequestHandler);
  public post(path: any, handler: RequestHandler);
  public post(...args: any[]) {
    return this.instance.post(...args);
  }

  public head(handler: RequestHandler);
  public head(path: any, handler: RequestHandler);
  public head(...args: any[]) {
    return this.instance.head(...args);
  }

  public delete(handler: RequestHandler);
  public delete(path: any, handler: RequestHandler);
  public delete(...args: any[]) {
    return this.instance.delete(...args);
  }

  public put(handler: RequestHandler);
  public put(path: any, handler: RequestHandler);
  public put(...args: any[]) {
    return this.instance.put(...args);
  }

  public patch(handler: RequestHandler);
  public patch(path: any, handler: RequestHandler);
  public patch(...args: any[]) {
    return this.instance.patch(...args);
  }

  public all(handler: RequestHandler);
  public all(path: any, handler: RequestHandler);
  public all(...args: any[]) {
    return this.instance.all(...args);
  }

  public options(handler: RequestHandler);
  public options(path: any, handler: RequestHandler);
  public options(...args: any[]) {
    return this.instance.options(...args);
  }

  public listen(port: string | number, callback?: () => void);
  public listen(port: string | number, hostname: string, callback?: () => void);
  public listen(port: any, hostname?: any, callback?: any) {
    return this.instance.listen(port, hostname, callback);
  }

  public getHttpServer(): TServer {
    return this.instance as TServer;
  }

  public setHttpServer(httpServer: TServer) {
    this.instance = httpServer;
  }

  public close() {
    if (!this.instance) {
      return undefined;
    }
    return new Promise((resolve) => this.instance.close(resolve));
  }

  public set(...args: any[]) {
    return this.instance.set(...args);
  }

  public enable(...args: any[]) {
    return this.instance.enable(...args);
  }

  public disable(...args: any[]) {
    return this.instance.disable(...args);
  }

  public engine(...args: any[]) {
    return this.instance.engine(...args);
  }

  public getRequestHostname(request: any): string {
    return request.hostname;
  }

  public getRequestMethod(request: any): string {
    return request.method;
  }

  public getRequestUrl(request: any): string {
    return request.originalUrl;
  }

  public initHttpServer(options: NhlApplicationOptions) {
    const isHttpsEnabled = options && options.httpsOptions;
    if (isHttpsEnabled) {
      this.instance = https.createServer(options.httpsOptions, this.instance);
      return;
    }
    this.instance = http.createServer(this.instance);
  }
}
