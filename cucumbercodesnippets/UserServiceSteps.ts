import {ILogEntryMessage, ILogger, LogLevel, LogManager} from "@aptos-scp/scp-component-logging";
import * as jsonValidationUtils from "@krisinc/node-rest-assured";
import {makeHttpRequest} from "@krisinc/node-rest-assured";
import {Then, When} from "cucumber";
import {TableDefinition} from "cucumber";
import * as dotenv from "dotenv";
import * as dotenvExp from "dotenv-expand";
import {world} from "../../support/world";
import {RandomStringUtils} from "../../utils/RandomStringUtils";
import {UserServiceUtils} from "../../utils/services/UserServiceUtils";
// tslint:disable-next-line:no-var-requires
require("../../support/hooks");

const envVars = dotenv.config({path: "./.env.qa"});
dotenvExp(envVars);
LogManager.setFilterLevel(LogLevel.ALL);
const logger: ILogger = LogManager.getLogger("stepDefinitions.services.UserServiceSteps");
const baseapiurl: string = process.env.BASE_API_URL;
const timeoutMS: number = 3 * 5000;
let response: any;

Then(/^validate user service response includes the following along with random data$/,
    async (responseFields: TableDefinition) => {
      const entryMessage: ILogEntryMessage = logger.traceEntry("validate user service r" +
          "esponse includes the following along with random data");
      const responsemap: Map<string, string> = await UserServiceUtils.readCompleteFeatureDataTable(responseFields);
      jsonValidationUtils.validJsonPathWithRegularExpressionForMap(world.responseBody, responsemap);
      logger.traceExit(entryMessage);
    });

// tslint:disable-next-line:max-line-length
When(/^create request is sent with the url "([^"]*)" for user service to create new user along with request body as file "([^"]*)" with below dynamic data$/,
    {timeout: timeoutMS}, async (urlparams: string, jsonfilepath: string, responseFields: TableDefinition) => {
      const entryMessage: ILogEntryMessage = logger.traceEntry(
          "POST request is sent with url along with input body as");
      const url: string = baseapiurl.toString() + urlparams;
      logger.info(() => `Post Url is: ${url}`);
      world.userServiceConstants.nameExisting = world.userServiceConstants.name;
      const randomUserName: string = RandomStringUtils.generateRandomStringWithOnlyAlphabets();
      world.userServiceConstants.defaultUsername = randomUserName;
      world.userServiceConstants.name = randomUserName;
      world.userServiceConstants.firstName = randomUserName + "first";
      world.userServiceConstants.lastName = randomUserName + "last";
      //{dynamicvariables} with actual value example : {username} replace with random string and send it in map
      const responseMap: Map<string, string> = await UserServiceUtils.readCompleteFeatureDataTable(responseFields);
      //dynamic variables replaces with actual values on file object of request json file
      //Note : mutation performed on object not on actual json file
      const resultString: string = await jsonValidationUtils.postRequestParametersFromMap(jsonfilepath, responseMap);
      logger.info(() => `Post Input Request body is: ${resultString}`);
      const headerOptions: string = JSON.stringify({"Authorization": world.accessTokenConstants.authToken});
      response = await makeHttpRequest(url, JSON.parse(headerOptions), "POST", resultString);
      world.responseBody = JSON.parse(response.body);
      logger.info(() => `Post Response is: ${jsonValidationUtils.prettyPrintJSON(world.responseBody)}`);
      if (world.responseBody.hasOwnProperty("id")) {
        const id: string[] = await jsonValidationUtils.findNodeValue(world.responseBody,
            "id");
        const userId: string = id[0].toString();
        world.userServiceConstants.userid = userId;
      }
      world.accessTokenConstants.statusCode = response.statusCode.toString();
      logger.traceExit(entryMessage);
    });

