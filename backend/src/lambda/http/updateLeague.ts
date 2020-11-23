import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { UpdateLeagueRequest } from '../../requests/UpdateLeagueRequest'
import { updateLeague, leagueExists } from '../../businessLogic/leagues'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'

const logger = createLogger('http')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  const leagueId = event.pathParameters.leagueId
  logger.info("HTTP: requesting update of leagueId: " + leagueId)

  const doesExist = await leagueExists(leagueId);

  if (doesExist) {

    const updatedLeagueRequest: UpdateLeagueRequest = JSON.parse(event.body)  
    logger.info("HTTP: requestiong update with " + updatedLeagueRequest)

    const userId = getUserId(event)

    await updateLeague(leagueId, updatedLeagueRequest, userId)

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
      body:"League does not exist"
    }

  }
}
