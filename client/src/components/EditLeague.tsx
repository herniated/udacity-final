import * as React from 'react'
import { Form, Button, Grid, Loader} from 'semantic-ui-react'
import Auth from '../auth/Auth'
import { patchLeague, getLeague } from '../api/leagues-api'
import { History } from 'history'

interface EditLeagueProps {
  match: {
    params: {
      leagueId: string
    }
  }
  auth: Auth
  history: History
}

interface EditLeagueState {
  leagueName: string
  loadingLeague: boolean
}

export class EditLeague extends React.PureComponent<
  EditLeagueProps,
  EditLeagueState
> {
  state: EditLeagueState = {
    leagueName: '',
    loadingLeague: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ leagueName: event.target.value })
  }

  handleSubmit = async (event: React.SyntheticEvent) => {
    try {
      await patchLeague(this.props.auth.getIdToken(), this.props.match.params.leagueId, { name: this.state.leagueName })

      this.props.history.push(`/`)

    } catch (e) {
      alert('Could not update league: ' + e.message)
    }
  }

  async componentDidMount() {
    try {
      const league = await getLeague(this.props.auth.getIdToken(), this.props.match.params.leagueId)
      this.setState({
        leagueName: league.name,
        loadingLeague: false
      })
    } catch (e) {
      alert(`Failed to fetch league: ${e.message}`)
    }
  }

  render() {
    if (this.state.loadingLeague) {
      return this.renderLoading()
    }
    else {
      return this.renderEditLeague()
    }
  }

  renderEditLeague() {
    return (
      <div>
        <h1>Edit League</h1>

        <Form onSubmit={this.handleSubmit}>
          <Form.Field>
            <label>League Name</label>
            <input
              placeholder="League Name"
              onChange={this.handleNameChange}
              value={this.state.leagueName}
            />
          </Form.Field>

          <Button type="submit">
            Submit
          </Button>
        </Form>
      </div>
    )
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading League
        </Loader>
      </Grid.Row>
    )
  }
}
