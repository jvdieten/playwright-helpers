import { Page } from "@playwright/test";
import path from "path";
import fs from 'fs';


export class MockHelper {

  page: Page;
  rootDirectory: string;
  dataType: 'xml' | 'json';

  /**
   * 
   * @param page reference to the playwright page
   * @param rootDirectory the base directory of th mock files
   * @param datatype currently json and xml reponspe types are supported default is json
   */
  constructor(page: Page, rootDirectory: string, dataType?: 'xml' | 'json') {
    this.page = page;
    this.rootDirectory = rootDirectory;
    this.dataType = dataType ?? 'json';
  }

  /**
   * Method to mock an endpoint and return a <scenario>.json placed in the rootdir
   * 
   * 
   * @param endpoint 
   *
   */
  async mockEndpoint(endpoint: MockEndpoint) {

    const responseBody = this.getResponseBody(endpoint);
    await this.page.route(new RegExp(endpoint.url), route =>
      route.fulfill({
        headers: { 'content-type': `application/${this.dataType}`, 'access-control-allow-origin': '*' },
        body: responseBody ?? '',
        status: endpoint.statusCode ?? 200
      }));
  }

  private getResponseBody(endpoint: MockEndpoint): string {
    if (endpoint.scenario && endpoint.mockDir){
      const bodyPath = path.resolve(this.rootDirectory, endpoint.mockDir, `${endpoint.scenario}.${this.dataType}`);
      return fs.readFileSync(bodyPath, 'utf-8');
    } else {
      return '';
    }

  }

}


/**
 *  url regex of the server url to mock
 *  mockDir directory containing the mock scenarios optional
 *  scenario name of the reponse file optional
 *  statusCode reponse code optional
 * 
 */
export interface MockEndpoint {
  url: string,
  mockDir?: string,
  scenario?: string,
  statusCode?: number
}

