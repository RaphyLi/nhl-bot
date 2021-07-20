import express from 'express';
import * as http from 'http';
import * as https from 'https';

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
export class HttpAdapter {
  private instance: any;
  private httpServer: https.Server | http.Server;

  constructor() {
    this.instance = express();
  }

  public listen(port: string | number) {
    return this.httpServer.listen(port);
  }

  public close() {
    if (!this.httpServer) {
      return undefined;
    }
    return new Promise((resolve) => this.httpServer.close(resolve));
  }

  public initHttpServer(options: NhlApplicationOptions) {
    const isHttpsEnabled = options && options.httpsOptions;
    if (isHttpsEnabled) {
      this.httpServer = https.createServer(options.httpsOptions, this.instance);
      return;
    }
    this.httpServer = http.createServer(this.instance);
  }

  public getHttpServer() {
    return this.httpServer;
  }
}
