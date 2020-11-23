import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
import { getLeague } from '../../businessLogic/leagues'

const logger = createLogger('http')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  const leagueId = event.pathParameters.leagueId

  logger.info("HTTP: requesting league " + leagueId)

  const item = await getLeague(leagueId)

  if (item !== undefined && item !== null) {

  logger.info("HTTP: league retrieved")
  
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*' // Required for CORS support to work
      },
      body: JSON.stringify({
        item: item
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
