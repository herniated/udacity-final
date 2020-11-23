import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
import { getRegistrationsByLeague } from '../../businessLogic/registrations'
import { leagueExists } from '../../businessLogic/leagues'

const logger = createLogger('http')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  const leagueId = event.pathParameters.leagueId

  logger.info("HTTP: requesting league " + leagueId)

  const doesExist = await leagueExists(leagueId);

  if (doesExist) {

    const items = await getRegistrationsByLeague(leagueId)

    logger.info("HTTP: registrations retrieved")
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*' // Required for CORS support to work
      },
      body: JSON.stringify({
        items: items
      }, null, 2)
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
