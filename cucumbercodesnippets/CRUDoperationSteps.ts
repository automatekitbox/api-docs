
import * as jsonValidationUtils from "@krisinc/node-rest-assured";
import * as assert from "assert";
import {TableDefinition} from "cucumber";
import {Then, When} from "cucumber";
import * as dotenv from "dotenv";
import * as dotenvExp from "dotenv-expand";
import {world} from "../../support/world";

// tslint:disable-next-line:no-var-requires
require("../../support/hooks");

const envVars = dotenv.config({path: "./.env.qa"});
dotenvExp(envVars);
const timeoutMS: number = 3 * 5000;
let response: any;
const baseapiurl: string = process.env.BASE_API_URL;
const logger: ILogger = LogManager.getLogger("stepDefinitions.services.CRUDoperationSteps");

When(/^fetch the data by sending the url "([^"]*)"$/, {timeout: 3 * 5000}, async (urlparams: string) => {
  const entryMessage: ILogEntryMessage = logger.traceEntry("GET request is sent with url ");
  const url: string = baseapiurl.toString() + urlparams;
  const headerOptions: string = JSON.stringify({"Authorization": world.accessTokenConstants.authToken});
  logger.info(() => `Get URL is: ${url}`);
  response = await world.makeHttpRequest(url, JSON.parse(headerOptions));
  world.responseBody = JSON.parse(response.body);
  logger.info(() => `Get Response: ${jsonValidationUtils.prettyPrintJSON(world.responseBody)}`);
  world.accessTokenConstants.statusCode = response.statusCode.toString();
  logger.traceExit(entryMessage);
});

When(/^create request is sent with the url "([^"]*)" along with the input body as below$/, {timeout: 3 * 5000},
    async (urlparams: string, inputbody: string) => {
      const entryMessage: ILogEntryMessage = logger.traceEntry(
          "POST request is sent with url along with input body as");
      const url: string = baseapiurl.toString() + urlparams;
      logger.info(() => `Input Request Body: ${inputbody}`);
      const headerOptions: string = JSON.stringify({"Authorization": world.accessTokenConstants.authToken});
      logger.info(() => `Post URL is: ${url}`);
      response = await world.makeHttpRequest(url, JSON.parse(headerOptions), "POST", inputbody);
      world.responseBody = JSON.parse(response.body);
      logger.info(() => `Post Response is: ${jsonValidationUtils.prettyPrintJSON(world.responseBody)}`);
      world.accessTokenConstants.statusCode = response.statusCode.toString();
      logger.traceExit(entryMessage);
    });

When(/^update request is sent with the url "([^"]*)" along with input body as below$/, {timeout: 3 * 5000},
    async (urlparams: string, inputbody: string) => {
      const entryMessage: ILogEntryMessage = logger.traceEntry(
          "PUT request is sent with url along with input body as");
      const url: string = baseapiurl.toString() + urlparams;
      logger.info(() => `Input Request Body: ${inputbody}`);
      const headerOptions: string = JSON.stringify({"Authorization": world.accessTokenConstants.authToken});
      logger.info(() => `Put Url is: ${url}`);
      response = await world.makeHttpRequest(url, JSON.parse(headerOptions), "PUT", inputbody);
      world.responseBody = JSON.parse(response.body);
      logger.info(() => `Put Response is: ${jsonValidationUtils.prettyPrintJSON(world.responseBody)}`);
      world.accessTokenConstants.statusCode = response.statusCode.toString();
      logger.traceExit(entryMessage);
    });

When(/^patch update request is sent with url "([^"]*)" along with input body as below$/, {timeout: 3 * 5000},
    async (urlparams: string, inputbody: string) => {
      const entryMessage: ILogEntryMessage = logger.traceEntry(
          "PATCH request is sent with url along with input body as");
      logger.info(() => `Request Input Body: ${inputbody}`);
      const url: string = baseapiurl.toString() + urlparams;
      const headerOptions: string = JSON.stringify({"Authorization": world.accessTokenConstants.authToken});
      logger.info(() => `Patch Url is: ${url}`);
      response = await world.makeHttpRequest(url, JSON.parse(headerOptions), "PATCH", inputbody);
      world.responseBody = JSON.parse(response.body);
      logger.info(() => `Patch Resonse is: ${jsonValidationUtils.prettyPrintJSON(world.responseBody)}`);
      world.accessTokenConstants.statusCode = response.statusCode.toString();
      logger.traceExit(entryMessage);
    });

When(/^delete request is sent with the url "([^"]*)"$/, {timeout: 3 * 5000}, async (urlparams: string) => {
  const entryMessage: ILogEntryMessage = logger.traceEntry(
      "DELETE request is sent with url along with input body as");
  const headerOptions: string = JSON.stringify({"Authorization": world.accessTokenConstants.authToken});
  const url: string = baseapiurl.toString() + urlparams;
  logger.info(() => `Delete Url is: ${url}`);
  response = await world.makeHttpRequest(url.toString(), JSON.parse(headerOptions), "DELETE");
  world.responseBody = JSON.parse(response.body);
  logger.info(() => `Delete Response is: ${jsonValidationUtils.prettyPrintJSON(world.responseBody)}`);
  world.accessTokenConstants.statusCode = response.statusCode.toString();
  logger.traceExit(entryMessage);
});

When(/^create request is sent with the url "([^"]*)" along with request body as file "([^"]*)"$/, {timeout: timeoutMS},
    async (urlparams: string, jsonfilepath: string, responseFields: TableDefinition) => {
      const entryMessage: ILogEntryMessage = logger.traceEntry(
          "POST request is sent with url along with input body as");
      const url: string = baseapiurl.toString() + urlparams;
      logger.info(() => `Post Url is: ${url}`);
      const readFeatureDataTable: string[][] = responseFields.rows();
      const responsemap: Map<string, string> = readFeatureDataTable
          .reduce((map: Map<string, string>, v: string[]) => {
            map.set(v[0], v[1]);
            return map;
          }, new Map());
      const resultString: string = await jsonValidationUtils.postRequestParametersFromMap(jsonfilepath, responsemap);
      logger.info(() => `Post Input Request body is: ${resultString}`);
      const headerOptions: string = JSON.stringify({"Authorization": world.accessTokenConstants.authToken});
      response = await world.makeHttpRequest(url, JSON.parse(headerOptions), "POST", resultString);
      world.responseBody = JSON.parse(response.body);
      logger.info(() => `Post Response is: ${jsonValidationUtils.prettyPrintJSON(world.responseBody)}`);
      world.accessTokenConstants.statusCode = response.statusCode.toString();
      logger.traceExit(entryMessage);
    });

Then(/^the status code should be "([^"]*)"$/, async (statusCode: string) => {
  assert.strictEqual(world.accessTokenConstants.statusCode, statusCode, statusCode +
      "Status code is not equal" + world.accessTokenConstants.statusCode);
});

Then(/^validate service response includes the following$/, async (responseFields: TableDefinition) => {
  jsonValidationUtils.validateJsonPathWithRegularExpression(world.responseBody, responseFields);
});

Then(/^validate service response followed by parent node "([^"]*)"$/,
    async (parentNode: string, responseFields: TableDefinition) => {
      jsonValidationUtils.validateJsonDataTableFollowedByParentIndex(parentNode, world.responseBody, responseFields)
      ;
    });

Then(/^validate service response does not include the following$/,
    async (responseFields: TableDefinition) => {
      jsonValidationUtils.invalidJsonPathWithRegularExpression(world.responseBody, responseFields);
    });
