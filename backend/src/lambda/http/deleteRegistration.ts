import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { deleteRegistration, registrationExists} from '../../businessLogic/registrations'
import { createLogger } from '../../utils/logger'

const logger = createLogger('http')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  const registrationId = event.pathParameters.registrationId

  logger.info("HTTP: requesting removal of registrationId: " + registrationId)

  const doesExist = await registrationExists(registrationId)

  if (doesExist) {

    await deleteRegistration(registrationId)
    
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body:""
    }
  } else {

    return {
      statusCode: 404,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body:"Registration does not exist"
    }

  }
}
