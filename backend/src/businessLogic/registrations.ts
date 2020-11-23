import { Registration } from '../models/Registration'
import { RegistrationAccess } from '../dataLayer/registrationAccess'
import { AddRegistrationRequest } from '../requests/AddRegistrationRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'

const logger = createLogger('http')

const registrationAccess = new RegistrationAccess()

export async function getRegistrationsByLeague(leagueId: string): Promise<Registration[]> {

    logger.info("Logic: get registrations for league: " + leagueId)
    return registrationAccess.getRegistrationsByLeague(leagueId)

}

export async function addLeagueRegistration(leagueId: string, addRegistration: AddRegistrationRequest, userId: string): Promise<Registration> {

    logger.info("Logic: adding registration: " + addRegistration + " to league " + leagueId)

    const registrationId = uuid.v4()

    const createdAt = new Date().toISOString()
    
    const newReg: Registration = {
        registrationId,
        leagueId,
        ...addRegistration,
        createdAt,
        createdBy: userId
      }

    return registrationAccess.addLeagueRegistration(newReg)

}

export async function deleteRegistration(registrationId: string): Promise<void> {

    logger.info("Logic: delete registrationId: " + registrationId)
    return registrationAccess.deleteRegistration(registrationId)

}

export async function registrationExists(registrationId: string): Promise<boolean> {

    return registrationAccess.registrationExists(registrationId)

}