import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { AddRegistrationRequest } from '../../requests/AddRegistrationRequest'
import { addLeagueRegistration } from '../../businessLogic/registrations'
import { leagueExists } from '../../businessLogic/leagues'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'

const logger = createLogger('http')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  const leagueId = event.pathParameters.leagueId
  logger.info("requesting update of todoId: " + leagueId)

  const doesExist = await leagueExists(leagueId);

  if (doesExist) {

    const addRegistrationRequest: AddRegistrationRequest = JSON.parse(event.body)  
    logger.info("requestiong update with " + addRegistrationRequest)

    const userId = getUserId(event)

    const newRegistration = await addLeagueRegistration(leagueId, addRegistrationRequest, userId)

    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        item: newRegistration
      })
    }

  } else {

    return {
      statusCode: 404,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body:"League does not exist"
    }
    
  }
}
