import React, { Component } from 'react';
import { Card, Grid, Button } from 'semantic-ui-react';
import { Link } from '../../routes';
import Layout from '../../components/Layout';
import Campaign from '../../eth/campaign';
import web3 from '../../eth/web3';
import ContriubteForm from '../../components/ContributeForm';

class CampaignShow extends Component {
  static async getInitialProps(props) {
    const campaign = Campaign(props.query.address);
    const summary = await campaign.methods.getSummary().call();

    return {
      address: props.query.address,
      minimumContribution: summary[0],
      balance: summary[1],
      requestsCount: summary[2],
      approversCount: summary[3],
      manager: summary[4]
    };
  }

  renderCards() {
    const {
      balance,
      manager,
      minimumContribution,
      requestsCount,
      approversCount
    } = this.props;

    const items = [
      {
        header: manager,
        meta: 'Address of manager',
        description: 'Manager created this campaign and can create requests',
        style: { overflowWrap: 'break-word' }
      },
      {
        header: minimumContribution,
        meta: 'Minimum contribuation (wei)',
        description: 'You must proved at least this much wei.'
      },
      {
        header: requestsCount,
        meta: 'Number of Requests',
        description: 'A request tries to width draw money from the campaign'
      },
      {
        header: approversCount,
        meta: 'Number of Approvers',
        description: 'Number of people who have already donated to the campaign'
      },
      {
        header: web3.utils.fromWei(balance, 'ether'),
        meta: 'Campaign Balance (ether)',
        description: 'The balance of how much money this campaign has left to spend'
      }
    ];

    return <Card.Group items={items} />;
  }

  render() {
    return (
      <Layout>
        <h3>Campaign Show</h3>
        <Grid>
          <Grid.Row>
            <Grid.Column width={10}>
              {this.renderCards()}
            </Grid.Column>
            <Grid.Column width={6}>
              <ContriubteForm address={this.props.address} />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <Link route={`/campaigns/${this.props.address}/requests`}>
                <a>
                  <Button primary>View Requests</Button>
                </a>
              </Link>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Layout>
    );
  }
}

export default CampaignShow;