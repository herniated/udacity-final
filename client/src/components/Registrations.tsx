import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader
} from 'semantic-ui-react'

import { getLeagues, createLeagueRegistration, deleteRegistration, getLeagueRegistrations } from '../api/leagues-api'
import Auth from '../auth/Auth'
import { RegistrationRequest } from '../types/RegistrationRequest'
import { Registration } from '../types/Registration'

interface RegistrationsProps {
  match: {
    params: {
      leagueId: string
    }
  }
  auth: Auth
  history: History
}

interface RegistrationsState {
  registrations: Registration[]
  userName: string
  loadingRegistrations: boolean
}

export class Registrations extends React.PureComponent<RegistrationsProps, RegistrationsState> {
  state: RegistrationsState = {
    registrations: [],
    userName: '',
    loadingRegistrations: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ userName: event.target.value })
  }

  /*
  onEditButtonClick = (leagueId: string) => {
    this.props.history.push(`/leagues/${leagueId}/edit`)
  }
  */

  onRegister = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      const newRegistration = await createLeagueRegistration(this.props.auth.getIdToken(), this.props.match.params.leagueId, {
        userName: this.state.userName
      })
      this.setState({
        registrations: [...this.state.registrations, newRegistration],
        userName: this.state.userName
      })
    } catch {
      alert('Registration create failed')
    }
  }
  
  onRegistrationDelete = async (registrationId: string) => {
    try {
      await deleteRegistration(this.props.auth.getIdToken(), this.props.match.params.leagueId, registrationId)
      this.setState({
        registrations: this.state.registrations.filter(registration => registration.registrationId != registrationId)
      })
    } catch {
      alert('Registration delete failed')
    }
  }

  async componentDidMount() {
    try {
      const registrations = await getLeagueRegistrations(this.props.auth.getIdToken(), this.props.match.params.leagueId)
      this.setState({
        registrations,
        loadingRegistrations: false
      })
    } catch (e) {
      alert(`Failed to fetch registration: ${e.message}`)
    }
  }

  render() {
    if (this.props.auth.isAuthenticated()) {
      return (
        <div>
          <Header as="h1">Registered Players</Header>

          {this.renderNewPlayerInput()}

          {this.renderRegistrations()}
        </div>
      )
    } else {
      return (
        <div>
          <Header as="h1">Registered Players</Header>
          
          {this.renderRegistrations()}
        </div>
      )
    }
  }

  renderNewPlayerInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            action={{
              color: 'teal',
              labelPosition: 'left',
              icon: 'add',
              content: 'Register Player',
              onClick: this.onRegister
            }}
            fluid
            actionPosition="left"
            placeholder="Please enter player name..."
            onChange={this.handleNameChange}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderRegistrations() {
    if (this.state.loadingRegistrations) {
      return this.renderLoading()
    }

    return this.renderRegistrationsList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading Registrations
        </Loader>
      </Grid.Row>
    )
  }

  renderRegistrationsList() {
    if (this.state.registrations.length>0) {
      return (
        <Grid padded>
          {this.buildHeader()}
          {this.state.registrations.map((registration, pos) => {
            if (this.props.auth.isAuthenticated()) {
              return (
                <Grid.Row key={registration.registrationId}>
                  <Grid.Column width={11} verticalAlign="middle">
                    {registration.userName}
                  </Grid.Column>
                  <Grid.Column width={4} verticalAlign="middle">
                    {dateFormat(registration.createdAt)}
                  </Grid.Column>
                  <Grid.Column width={1} floated="right">
                    <Button
                      icon
                      color="red"
                      onClick={() => this.onRegistrationDelete(registration.registrationId)}
                    >
                      <Icon name="delete" />
                    </Button>
                  </Grid.Column>
                  <Grid.Column width={16}>
                    <Divider />
                  </Grid.Column>
                </Grid.Row>
              )
            } else {
              return (
                <Grid.Row key={registration.registrationId}>
                  <Grid.Column width={12} verticalAlign="middle">
                    {registration.userName}
                  </Grid.Column>
                  <Grid.Column width={4} verticalAlign="middle">
                    {dateFormat(registration.createdAt)}
                  </Grid.Column>
                  <Grid.Column width={16}>
                    <Divider />
                  </Grid.Column>
                </Grid.Row>
              )
            }
          })}
        </Grid>
      )
    } else {
      return (
        <Grid.Row>
          <Grid.Column width={16}>
            No Players Registered
          </Grid.Column>
        </Grid.Row>
      )
    }
  }

  buildHeader() {
    if (this.props.auth.isAuthenticated()) {
      return (
        <Grid.Row key="header">
          <Grid.Column width={11} verticalAlign="middle">Name</Grid.Column>
          <Grid.Column width={4} floated="right">Created Date</Grid.Column>
          <Grid.Column width={1} floated="right">Delete</Grid.Column>
        </Grid.Row>
      )
    } else {
      return (
        <Grid.Row key="header">
          <Grid.Column width={12} verticalAlign="middle">Name</Grid.Column>
          <Grid.Column width={4} floated="right">Created Date</Grid.Column>
        </Grid.Row>
      )
    }
  }
}
