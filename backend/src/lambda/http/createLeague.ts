import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { CreateLeagueRequest } from '../../requests/CreateLeagueRequest'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'
import { createLeague } from '../../businessLogic/leagues'

const logger = createLogger('http')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  const newLeague: CreateLeagueRequest = JSON.parse(event.body)

  logger.info("HTTP: requesting to create" + newLeague)

  const userId = getUserId(event)

  const newTodoItem = await createLeague(newLeague, userId)

  logger.info("HTTP: league created")

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      item: newTodoItem
    })
  }
}
