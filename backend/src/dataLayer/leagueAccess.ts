import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
const XAWS = AWSXRay.captureAWS(AWS)
import { League } from '../models/League'
import { LeagueUpdate } from '../models/LeagueUpdate'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'

const logger = createLogger('http')

export class LeagueAccess {

    constructor(
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly leaguesTable = process.env.LEAGUES_TABLE) {
    }

    async getLeagues(): Promise<League[]> {

        logger.info('Access: Getting leagues from table: ' + this.leaguesTable)

        const result = await this.docClient.scan({
            TableName: this.leaguesTable
          }).promise()
        
        logger.info("Access: leagues retrieved")

        const items = result.Items
        return items as League[]
    }

    async getLeague(leagueId: string): Promise<League> {

      logger.info('Access: Getting league ' + leagueId + ' from table: ' + this.leaguesTable)

      const result = await this.docClient.get({
          TableName: this.leaguesTable,
          Key: {
            leagueId: leagueId
          }
        }).promise()
      
      logger.info("Access: league retrieved")

      return result.Item as League
    }

    async leagueExists(leagueId: string): Promise<boolean> {

      const result = await this.docClient.get({
          TableName: this.leaguesTable,
          Key: {
            leagueId: leagueId
          }
        }).promise()
      
      if (result.Item !== undefined && result.Item !== null) {
        return true
      } else {
        return false
      }
    }

    async createLeague(newLeague: League): Promise<League> {

        logger.info("Access: creating new league: " + newLeague + ' in table: ' + this.leaguesTable)

        await this.docClient.put({
            TableName: this.leaguesTable,
            Item: newLeague
          }).promise()

        logger.info("Access: new league created")

        return newLeague
    }

    async deleteLeague(leagueId: string): Promise<void> {

        logger.info("Access: deleting league: " + leagueId + " from " + this.leaguesTable)

        await this.docClient.delete({
            TableName: this.leaguesTable,
            Key: { leagueId }
          }).promise()

        logger.info("league deleted")
    }

    async updateLeague(leagueId: string, updatedLeague: LeagueUpdate): Promise<void> {

        logger.info("Access: update leagueId: " + leagueId + " with update: " + updatedLeague + ' in table: ' + this.leaguesTable)

        await this.docClient.update({
            TableName: this.leaguesTable,
            Key: { leagueId },
            UpdateExpression: "set #name=:leagueName, modifiedAt=:modifiedAt, modifiedBy=:modifiedBy",
            ExpressionAttributeValues:{
                ":leagueName":updatedLeague.name,
                ":modifiedAt":updatedLeague.modifiedAt,
                ":modifiedBy":updatedLeague.modifiedBy
            },
            ExpressionAttributeNames:{
              "#name": "name"
            }
          }).promise()
        
        logger.info("item updated")
    }
}