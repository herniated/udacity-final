import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
import { getLeagues } from '../../businessLogic/leagues'

const logger = createLogger('http')

export const handler: APIGatewayProxyHandler = async (): Promise<APIGatewayProxyResult> => {

  logger.info("HTTP: get leagues")

  const items = await getLeagues()

  logger.info("HTTP: leagues retrieved")
  
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*' // Required for CORS support to work
    },
    body: JSON.stringify({
      items: items
    }, null, 2),
  };

}
