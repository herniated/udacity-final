import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { deleteLeague, leagueExists } from '../../businessLogic/leagues'
import { createLogger } from '../../utils/logger'

const logger = createLogger('http')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  const leagueId = event.pathParameters.leagueId

  logger.info("HTTP: requesting delete of " + leagueId)

  let doesExist = await leagueExists(leagueId)

  if (doesExist) {

    await deleteLeague(leagueId)
    
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


