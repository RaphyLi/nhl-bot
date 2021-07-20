require('module-alias/register');
import { NHLApplication } from './nhl-application';

export default class NHLApi {
  private nhlApplication: NHLApplication;

  constructor() {}

  start() {
    this.nhlApplication = new NHLApplication();
    this.nhlApplication.init();
  }
}

export const nhlApi = new NHLApi();

nhlApi.start();
