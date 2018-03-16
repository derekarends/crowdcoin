import React, { Component } from 'react';
import { Table, Button } from 'semantic-ui-react';
import { Router } from '../routes';
import web3 from '../eth/web3';
import Campaign from '../eth/campaign';

class RequestRow extends Component {
  state = {
    loading: false
  };

  onApprove = async () => {
    this.setState({ loading: true });
    const campaign = Campaign(this.props.address);
    try {
      const accounts = await web3.eth.getAccounts();
      await campaign.methods.approveRequest(this.props.id).send({
        from: accounts[0]
      });

      Router.replaceRoute(`/campaigns/${this.props.address}/requests`);
    } catch (err) {

    }
    this.setState({ loading: false });
  }

  onFinalize = async () => {
    this.setState({ loading: true });
    const campaign = Campaign(this.props.address);
    try {
      const accounts = await web3.eth.getAccounts();
      await campaign.methods.finalizeRequest(this.props.id).send({
        from: accounts[0]
      });

      Router.replaceRoute(`/campaigns/${this.props.address}/requests`);
    } catch (err) {

    }
    this.setState({ loading: false });
  }

  render() {
    const { Row, Cell } = Table;
    const { id, request, approversCount } = this.props;
    const readyToFinalize = request.approvalCount > approversCount / 2;

    return (
      <Row disabled={request.complete} positive={readyToFinalize && !request.complete}>
        <Cell>{id}</Cell>
        <Cell>{request.description}</Cell>
        <Cell>{web3.utils.fromWei(request.value, 'ether')}</Cell>
        <Cell>{request.recipent}</Cell>
        <Cell>{request.approvalCount}/{approversCount}</Cell>
        <Cell>
          {request.complete ? null : (
            <Button
              onClick={this.onApprove}
              loading={this.state.loading}
              color="green"
              basic>Approve</Button>
          )}
        </Cell>
        <Cell>
          {request.complete ? null : (
            <Button
              disabled={!readyToFinalize}
              onClick={this.onFinalize}
              loading={this.state.loading}
              color="teal"
              basic>Finalize</Button>
          )}
        </Cell>
      </Row>
    );
  }
}

export default RequestRow;