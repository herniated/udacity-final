import { apiEndpoint } from '../config'
import { League } from '../types/League';
import { CreateLeagueRequest } from '../types/CreateLeagueRequest';
import Axios from 'axios'
import { Registration } from '../types/Registration';
import { RegistrationRequest } from '../types/RegistrationRequest';
import { UpdateLeagueRequest } from '../types/UpdateLeagueRequest';

export async function getLeagues(idToken: string): Promise<League[]> {
  console.log('Fetching leagues')

  const response = await Axios.get(`${apiEndpoint}/leagues`, {
    headers: {
      'Content-Type': 'application/json'
    },
  })
  console.log('Leagues:', response.data)
  return response.data.items
}

export async function getLeague(idToken: string, leagueId: string): Promise<League> {
  console.log('Fetching league')

  const response = await Axios.get(`${apiEndpoint}/leagues/` + leagueId, {
    headers: {
      'Content-Type': 'application/json'
    },
  })
  console.log('League:', response.data)
  return response.data.item
}

export async function createLeague(
  idToken: string,
  newLeague: CreateLeagueRequest
): Promise<League> {
  const response = await Axios.post(`${apiEndpoint}/leagues`,  JSON.stringify(newLeague), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.item
}

export async function patchLeague(
  idToken: string,
  leagueId: string,
  updatedLeague: UpdateLeagueRequest
): Promise<void> {
  await Axios.patch(`${apiEndpoint}/leagues/${leagueId}`, JSON.stringify(updatedLeague), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function deleteLeague(
  idToken: string,
  leagueId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/leagues/${leagueId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function getLeagueRegistrations(
  idToken: string,
  leagueId: string
): Promise<Registration[]> {
  const response = await Axios.get(`${apiEndpoint}/leagues/${leagueId}/registrations`, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
  return response.data.items
}

export async function createLeagueRegistration(
  idToken: string,
  leagueId: string,
  registrationRequest: RegistrationRequest
): Promise<Registration> {
  const response = await Axios.post(`${apiEndpoint}/leagues/${leagueId}/registrations`, JSON.stringify(registrationRequest), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })   
  return response.data.item
}

export async function deleteRegistration(
  idToken: string,
  leagueId: string,
  userId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/registrations/${userId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}
