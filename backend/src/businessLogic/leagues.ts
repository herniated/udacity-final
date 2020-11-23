import { League } from '../models/League'
import { LeagueUpdate } from '../models/LeagueUpdate'
import { LeagueAccess } from '../dataLayer/leagueAccess'
import { RegistrationAccess } from '../dataLayer/registrationAccess'
import { CreateLeagueRequest } from '../requests/CreateLeagueRequest'
import { UpdateLeagueRequest } from '../requests/UpdateLeagueRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'

const logger = createLogger('http')

const leagueAccess = new LeagueAccess()

const registrationAccess = new RegistrationAccess()

export async function getLeagues(): Promise<League[]> {

    logger.info("Logic: get leagues")
    return leagueAccess.getLeagues()

}

export async function getLeague(leagueId: string): Promise<League> {

    logger.info("Logic: get leagueId: " + leagueId)
    return leagueAccess.getLeague(leagueId)

}

export async function createLeague(createLeague: CreateLeagueRequest, userId: string): Promise<League> {

    logger.info("Logic: creating league: " + createLeague + " by user " + userId)

    const leagueId = uuid.v4()
    const createdAt = new Date().toISOString()
    
    const newLeague: League = {
        leagueId,
        createdBy: userId, 
        createdAt,
        modifiedAt: createdAt,
        modifiedBy: userId, 
        ...createLeague
      }

    return leagueAccess.createLeague(newLeague)

}

export async function leagueExists(leagueId: string): Promise<boolean> {

    return leagueAccess.leagueExists(leagueId)
}

export async function deleteLeague(leagueId: string): Promise<void> {

    logger.info("Logic: delete league id: " + leagueId)

    await leagueAccess.deleteLeague(leagueId)

    // also need to delete registrations
    await registrationAccess.deleteRegistrationsByLeague(leagueId)

}

export async function updateLeague(leagueId: string, updateLeagueRequest: UpdateLeagueRequest, userId: string): Promise<void> {

    logger.info("Logic: updating todo: " + leagueId + " with update " + updateLeagueRequest)

    const modifiedAt = new Date().toISOString()

    const updateLeague: LeagueUpdate = {
        modifiedAt,
        modifiedBy: userId, 
        ...updateLeagueRequest
      }

    return await leagueAccess.updateLeague(leagueId, updateLeague)

}