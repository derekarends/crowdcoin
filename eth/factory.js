import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  '0x718a2C1b59E42cA1B60b9bB65629cbeCCb9A4529'
);

export default instance;
