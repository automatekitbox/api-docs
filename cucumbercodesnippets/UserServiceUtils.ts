import {ILogEntryMessage, ILogger, LogManager} from "@aptos-scp/scp-component-logging";
import * as jsonValidationUtils from "@krisinc/node-rest-assured";
import {TableDefinition} from "cucumber";
import {world} from "../../support/world";
import {RandomStringUtils} from "../RandomStringUtils";

const logger: ILogger = LogManager.getLogger("utils.services.UserServiceUtils");


export class UserServiceUtils {

  public static readFeatureDataTable(responseFields: TableDefinition): Map<string, string> {
    const entryMessage: ILogEntryMessage = logger.traceEntry("readFeatureDataTable");
    const readFeatureDataTable: string[][] = responseFields.rows();
    const responsemap: Map<string, any> = new Map();
    for (let [key, value] of readFeatureDataTable) {
      if (value.includes("{user_id}")) {
        value = world.userServiceConstants.userid;
      } else if (value.includes("{user_username}")) {
        value = world.userServiceConstants.username;
      } else if (value.includes("{user_firstName}")) {
        value = world.userServiceConstants.firstName;
      } else if (value.includes("{user_lastName}")) {
        value = world.userServiceConstants.lastName;
      } else if (value.includes("{user_name}")) {
        value = world.userServiceConstants.name;
      } else if (value.includes("{user_securityRoleId}") || value.includes("{user_externalSecurityRoleId}")) {
        value = world.userServiceConstants.securityRoleId;
      }
      responsemap.set(key, value);
    }
    logger.traceExit(entryMessage);
    return responsemap;
  }

  //tslint:disable-next-line:cyclomatic-complexity
  public static async readCompleteFeatureDataTable(responseFields: TableDefinition): Promise<Map<string, string>> {
    const entryMessage: ILogEntryMessage = logger.traceEntry("readCompleteFeatureDataTable");
    const readFeatureDataTable: string[][] = responseFields.rows();
    const responsemap: Map<string, any> = new Map<string, any>();
    for (let [key, value] of readFeatureDataTable) {
      if (value.includes("{user_id}")) {
        value = world.userServiceConstants.userid;
      } else if (value.toString().includes("{user_username}")) {
        value = world.userServiceConstants.username;
      } else if (value.toString().includes("{user_firstName}")) {
        value = world.userServiceConstants.firstName;
      } else if (value.toString().includes("{user_lastName}")) {
        value = world.userServiceConstants.lastName;
      } else if (value.toString().includes("{user_name}")) {
        value = world.userServiceConstants.name;
      } else if (value.toString().includes("{user_password}")) {
        const pw: string[] = await jsonValidationUtils.findNodeValue(world.responseBody,
            "password");
        value = pw[0].toString();
      } else if (value.toString().includes("{user_created_at}")) {
        const created: string[] = await jsonValidationUtils.findNodeValue(world.responseBody,
            "createdAt");
        value = created[0].toString();
      } else if (value.toString().includes("{user_updated_at}")) {
        const updated: string[] = await jsonValidationUtils.findNodeValue(world.responseBody,
            "updatedAt");
        value = updated[0].toString();
      } else if (value.toString().includes("{user_external_id}")) {
        const id: string[] = await jsonValidationUtils.findNodeValue(world.responseBody,
            "externalIds[*].id");
        value = id[0].toString();
      } else if (value.toString().includes("{user_external_userid}")) {
        const id: string[] = await jsonValidationUtils.findNodeValue(world.responseBody,
            "externalIds[*].userId");
        value = id[0].toString();
      }
      responsemap.set(key, value);
    }
    logger.traceExit(entryMessage);
    return responsemap;
  }

  public static populateRequestBody(inputbody: string): string {
    const entryMessage: ILogEntryMessage = logger.traceEntry("populateRequestBody");
    let requestbody = inputbody.replace("{random_firstName}", world.userServiceConstants.firstName);
    requestbody = requestbody.replace("{random_lastName}", world.userServiceConstants.lastName);
    requestbody = requestbody.replace("{user_securityRoleId}", world.userServiceConstants.securityRoleId);
    requestbody = requestbody.replace("{securityId}", world.userServiceConstants.securityId);
    requestbody = requestbody.replace("{security_securityRoleId}", world.userServiceConstants.securityRoleId);
    requestbody = requestbody.replace("{security_securityRoleId}", world.userServiceConstants.securityRoleId);
    requestbody = requestbody.replace("{invalid_data}", RandomStringUtils.generateRandomStringWithAlphanumerics());
    logger.traceExit(entryMessage);
    return requestbody;
  }

  public static async generateResultString(responseFields: TableDefinition, jsonfilepath: string): Promise<string> {
    const entryMessage: ILogEntryMessage = logger.traceEntry("generateJsonObject");
    world.userServiceConstants.nameExisting = world.userServiceConstants.name;
    const randomUserName: string = RandomStringUtils.generateRandomStringWithOnlyAlphabets();
    logger.info("randomUserName: " + randomUserName);
    world.userServiceConstants.name = randomUserName;
    world.userServiceConstants.firstName = randomUserName + "first";
    world.userServiceConstants.lastName = randomUserName + "last";
    const responseMap: Map<string, any> = await UserServiceUtils.readCompleteFeatureDataTable(responseFields);
    const resultString: string = await jsonValidationUtils.postRequestParametersFromMap(jsonfilepath, responseMap);
    logger.traceExit(entryMessage);
    return resultString;
  }
}
