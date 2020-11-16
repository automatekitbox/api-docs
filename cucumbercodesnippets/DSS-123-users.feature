Feature: DAOP-1213-users - CRUD operations for users



  Background: Generating access token
    Given create request is sent with url "/auth/realms/openid-connect/tokens" for generating Access Token with the input body as below
      """
       {
        "grant_type":"password",
        "username":"{username}",
        "password":"{password}",
        "client_id":"localhost-dev"
       }
      """



  Scenario Outline:  POST - Create a new user - By all mandatory parameters
    When create request is sent with the url "<url>" for user service to create new user along with request body as file "<filepath>" with below dynamic data
      | json_path_parameter    | json_path_parameter_value     |
      | firstName              | {user_firstName}              |
      | username               | {user_name}                   |
      | lastName               | {user_lastName}               |
      | securityRoleId         | {user_securityRoleId}         |
      | externalSecurityRoleId | {user_externalSecurityRoleId} |
    Then the status code should be "<statuscode>"
    And validate user service response includes the following along with random data
      | json_path_parameter         | json_path_parameter_value |
      | firstName                   | {user_firstName}          |
      | lastName                    | {user_lastName}           |
      | accountStatus               | Active                    |
      | typeCode                    | home                      |
      | phoneNumber                 | 122-333-333               |
      | securityRole.securityRoleId | {user_securityRoleId}     |
      | emailAddresses[*].address   | testuser1@gmail.com       |

    Examples:
      | url             | statuscode | filepath                                |
      | /users/v2/users | 200        | ./data/user/v2/request/userservice.json |

  Scenario Outline: C216921 POST - Create a new login
    When create request is sent with the url "<url>" for user service to to login
    """
      {
        "username": "{user_name}",
        "password": "mypwd@1234"
      }
    """
    Then the status code should be "<statuscode>"
    And validate user service response includes the following along with random data
      | json_path_parameter | json_path_parameter_value |
      | id                  | {user_id}                 |
      | username            | {user_name}               |

    Examples:
      | url             | statuscode |
      | /users/v2/login | 200        |

  Scenario Outline: C216926 PATCH - updates a user
    When patch update request is sent with url "<url>" for user service to update existing user
    """
    {
      "firstName": "{user_firstName}",
      "lastName": "{user_lastName}",
      "emailAddresses": [
       {
         "address": "abc@gmail.com",
         "typeCode": "home"
       }
      ]
    }
    """
    Then the status code should be "<statuscode>"
    And validate user service response includes the following along with random data
      | json_path_parameter         | json_path_parameter_value |
      | firstName                   | {user_firstName}          |
      | lastName                    | {user_lastName}           |
      | accountStatus               | Active                    |
      | typeCode                    | home                      |
      | phoneNumber                 | 122-333-333               |
      | securityRole.securityRoleId | {user_securityRoleId}     |
      | emailAddresses[*].address   | abc@gmail.com             |

    Examples:
      | url                       | statuscode |
      | /users/v2/users/{user_id} | 200        |
