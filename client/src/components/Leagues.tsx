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

import { createLeague, deleteLeague, getLeagues, patchLeague } from '../api/leagues-api'
import Auth from '../auth/Auth'
import { League } from '../types/League'

interface LeaguesProps {
  auth: Auth
  history: History
}

interface LeaguesState {
  leagues: League[]
  newLeagueName: string
  loadingLeagues: boolean
}

export class Leagues extends React.PureComponent<LeaguesProps, LeaguesState> {
  state: LeaguesState = {
    leagues: [],
    newLeagueName: '',
    loadingLeagues: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newLeagueName: event.target.value })
  }

  onEditButtonClick = (leagueId: string) => {
    this.props.history.push(`/leagues/${leagueId}/edit`)
  }

  onNameClick = (leagueId: string) => {
    this.props.history.push(`/leagues/${leagueId}`)
  }

  onLeagueCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      const newLeague = await createLeague(this.props.auth.getIdToken(), {
        name: this.state.newLeagueName
      })
      this.setState({
        leagues: [...this.state.leagues, newLeague],
        newLeagueName: this.state.newLeagueName
      })
    } catch {
      alert('League creation failed')
    }
  }

  onLeagueDelete = async (leagueId: string) => {
    try {
      await deleteLeague(this.props.auth.getIdToken(), leagueId)
      this.setState({
        leagues: this.state.leagues.filter(league => league.leagueId != leagueId)
      })
    } catch {
      alert('League deletion failed')
    }
  }
  
  async componentDidMount() {
    try {
      const leagues = await getLeagues(this.props.auth.getIdToken())
      this.setState({
        leagues,
        loadingLeagues: false
      })
    } catch (e) {
      alert(`Failed to fetch league: ${e.message}`)
    }
  }

  render() {
    if (this.props.auth.isAuthenticated()) {
      return (
        <div>
          <Header as="h1">League List</Header>

          {this.renderCreateLeagueInput()}

          {this.renderLeagues()}
        </div>
      )
    } else {
      return (
        <div>
          <Header as="h1">League List</Header>
          
          {this.renderLeagues()}
        </div>
      )
    }
  }

  renderCreateLeagueInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            action={{
              color: 'teal',
              labelPosition: 'left',
              icon: 'add',
              content: 'New league',
              onClick: this.onLeagueCreate
            }}
            fluid
            actionPosition="left"
            placeholder="Please enter league name..."
            onChange={this.handleNameChange}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderLeagues() {
    if (this.state.loadingLeagues) {
      return this.renderLoading()
    }

    return this.renderLeaguesList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading Leagues
        </Loader>
      </Grid.Row>
    )
  }

  renderLeaguesList() {
    if (this.state.leagues.length>0) {
      return (
        <Grid padded>
          {this.buildHeader()}
          {this.state.leagues.map((league, pos) => {
            if (this.props.auth.isAuthenticated()) {
              return (
                <Grid.Row key={league.leagueId}>
                  <Grid.Column width={10} verticalAlign="middle">
                    <a href="#" onClick={() => this.onNameClick(league.leagueId)}>{league.name}</a>
                  </Grid.Column>
                  <Grid.Column width={4} verticalAlign="middle">
                    {dateFormat(league.modifiedAt)}
                  </Grid.Column>
                  <Grid.Column width={1} floated="right">
                    <Button
                      icon
                      color="blue"
                      onClick={() => this.onEditButtonClick(league.leagueId)}
                    >
                      <Icon name="pencil" />
                    </Button>
                  </Grid.Column>
                  <Grid.Column width={1} floated="right">
                    <Button
                      icon
                      color="red"
                      onClick={() => this.onLeagueDelete(league.leagueId)}
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
                <Grid.Row key={league.leagueId}>
                  <Grid.Column width={12} verticalAlign="middle">
                    <a href="#" onClick={() => this.onNameClick(league.leagueId)}>{league.name}</a>
                  </Grid.Column>
                  <Grid.Column width={4} verticalAlign="middle">
                    {dateFormat(league.modifiedAt)}
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
            No Leagues Available
          </Grid.Column>
        </Grid.Row>
      )
    }
  }

  buildHeader() {
    if (this.props.auth.isAuthenticated()) {
      return (
        <Grid.Row key="header">
          <Grid.Column width={10} verticalAlign="middle">Name</Grid.Column>
          <Grid.Column width={4} floated="right">Modified Date</Grid.Column>
          <Grid.Column width={1} floated="right">Edit</Grid.Column>
          <Grid.Column width={1} floated="right">Delete</Grid.Column>
        </Grid.Row>
      )
    } else {
      return (
        <Grid.Row key="header">
          <Grid.Column width={12} verticalAlign="middle">Name</Grid.Column>
          <Grid.Column width={4} floated="right">Modified Date</Grid.Column>
        </Grid.Row>
      )
    }
  }

}
