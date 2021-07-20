// import express, { Application } from 'express';
// import { createServer, Server, ServerOptions } from 'http';
// import {
//   createServer as createHttpsServer,
//   Server as HTTPSServer,
//   ServerOptions as HTTPSServerOptions
// } from 'https';
// import { ListenOptions } from 'net';

// export default class NHLApi {
//   private server: Server;
//   public app: Application;

//   constructor() {
//     this.app = express();
//   }

//   public start(port: number): Promise<Server>;
//   public start(
//     portOrListenOptions: number | ListenOptions,
//     serverOptions?: ServerOptions
//   ): Promise<Server>;
//   public start(
//     portOrListenOptions: number | ListenOptions,
//     httpsServerOptions?: HTTPSServerOptions
//   ): Promise<HTTPSServer>;
//   public start(
//     portOrListenOptions: number | ListenOptions,
//     serverOptions: ServerOptions | HTTPSServerOptions = {}
//   ): Promise<Server | HTTPSServer> {
//     let createServerFn: typeof createServer | typeof createHttpsServer = createServer;

//     this.server = createServerFn(serverOptions, this.app);

//     return new Promise((resolve, reject) => {
//       if (this.server === undefined) {
//       }

//       this.server.on('error', (error) => {
//         if (this.server === undefined) {
//         }

//         this.server.close();
//         reject(error);
//       });

//       this.server.on('close', () => {
//         this.server = undefined;
//       });

//       this.server.listen('', () => {
//         if (this.server === undefined) {
//         }

//         resolve(this.server);
//       });
//     });
//   }

//   public stop(): Promise<void> {
//     return new Promise((resolve, reject) => {
//       if (this.server === undefined) {
//         return reject('The receiver cannot be stopped because it was not started.');
//       }
//       this.server.close((error) => {
//         if (error !== undefined) {
//           return reject(error);
//         }

//         this.server = undefined;
//         resolve();
//       });
//     });
//   }
// }
