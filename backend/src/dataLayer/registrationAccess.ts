import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
const XAWS = AWSXRay.captureAWS(AWS)
import { Registration } from '../models/Registration'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'

const logger = createLogger('http')

export class RegistrationAccess {

    constructor(
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly registrationsTable = process.env.REGISTRATIONS_TABLE) {
    }

    async getRegistrationsByLeague(leagueId: string): Promise<Registration[]> {

        logger.info('Access: Getting registrations for user: ' + leagueId + ' from table: ' + this.registrationsTable)

        const result = await this.docClient.query({
          TableName: this.registrationsTable,
          IndexName: 'leagueIndex',
          KeyConditionExpression: 'leagueId = :leagueId',
          ExpressionAttributeValues: {
            ':leagueId': leagueId
          }
        }).promise()
         
        const items = result.Items
        
        return items as Registration[]
    }
    
    async addLeagueRegistration(newRegistration: Registration): Promise<Registration> {

        logger.info("Access: creating new item: " + newRegistration + ' in table: ' + this.registrationsTable)

        await this.docClient.put({
            TableName: this.registrationsTable,
            Item: newRegistration
          }).promise()

        logger.info("Access: registration added")

        return newRegistration
    }

    async deleteRegistration(registrationId: string): Promise<void> {
      
      logger.info("Access: deleting registrationId: " + registrationId + " from " + this.registrationsTable)

      await this.docClient.delete({
          TableName: this.registrationsTable,
          Key: { registrationId }
        }).promise()

      logger.info("Access: registration deleted")

    }

    async registrationExists(registrationId: string): Promise<boolean> {

      const result = await this.docClient.get({
          TableName: this.registrationsTable,
          Key: {
            registrationId: registrationId
          }
        }).promise()
      
      if (result.Item !== undefined && result.Item !== null) {
        return true
      } else {
        return false
      }

    }

    async deleteRegistrationsByLeague(leagueId: string): Promise<void> {
      
      logger.info("Access: deleting registrations for leagueId: " + leagueId + " from " + this.registrationsTable)

      const registrations: Registration[] = await this.getRegistrationsByLeague(leagueId)

      logger.info("Access: numRegistrations: " + registrations.length);

      if (registrations !== undefined && registrations !== null) {
        logger.info("Access: deleting " + registrations.length + " registrations");
        for (let registration of registrations) {
          await this.deleteRegistration(registration.registrationId)
        }
      } else {
        logger.info("Access: No registrations to delete");
      }

      logger.info("Access: registrations deleted")
    }
}