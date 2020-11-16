import {ILogEntryMessage, ILogger, LogManager} from "@aptos-scp/scp-component-logging";
import * as jsonValidationUtils from "@krisinc/node-rest-assured";
import {makeHttpRequest} from "@krisinc/node-rest-assured";
import {Given} from "cucumber";
import * as dotenv from "dotenv";
import * as dotenvExp from "dotenv-expand";

// tslint:disable-next-line:no-var-requires
require("../../support/hooks");

const envVars = dotenv.config({path: "./.env.qa"});
dotenvExp(envVars);
const logger: ILogger = LogManager.getLogger("stepDefinitions.services.GenerateAccessToken");
let response: any;
const baseidmurl: string = process.env.BASE_IDM_URL;
const idmUsername: string = process.env.IDM_USERNAME;
//@ts-ignore
const idmPassword: string = process.env.IDM_PASSWORD;
//@ts-ingore
//const decodedPassword: string = Base64.decode(idmPassword.toString());
const realmID: string = process.env.REALM_ID;

Given(/^create request is sent with url "([^"]*)" for generating Access Token with the input body as below$/,
    {timeout: 3 * 5000}, async (urlparams: string, inputbody: string) => {
      const entryMessage: ILogEntryMessage = logger.traceEntry(
          "POST request for Access Token sent with url along with input body as");
      urlparams = urlparams.replace("aptos-denim_default", realmID);
      const url: string = baseidmurl + urlparams;
      let requestBody: string = inputbody.replace("{username}", idmUsername);
      requestBody = requestBody.replace("{password}", "idmPassword");
      logger.info("REQUEST BODY" + requestBody);
      logger.info(() => `Url is: ${baseidmurl}`);
      const headerOptions: string = JSON.stringify({"Content-Type": "application/x-www-form-urlencoded"});
      response = await makeHttpRequest(url, JSON.parse(headerOptions), "POST", requestBody, true);
      logger.info(() => `Status code is: ${jsonValidationUtils.prettyPrintJSON(response.body)}`);
      const jsonResponseBody: object = JSON.parse(response.body);
      const authenticationToken: string[] = await jsonValidationUtils.findNodeValue(jsonResponseBody,
          "access_token");
      logger.info(() => `Access token is: ${authenticationToken.toString()}`);
      logger.info(() => `Status code: ${response.statusCode.toString()}`);
      logger.traceExit(entryMessage);
    });
