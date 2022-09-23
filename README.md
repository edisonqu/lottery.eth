# Chainlink Lottery

#### [Link to the project](https://lottery-eth.vercel.app/)

### Welcome!

This is a project in which people can join a lottery by paying a ticket price with ether accumulating a prize. The winner is declared based on a randomly-generated number thanks to the [Chainlink VRF](https://docs.chain.link/docs/chainlink-vrf/)

### Table of contents

- [Preview](#preview)
- [Frontend](#frontend)
- [Smart contract](#smart-contract)
- [About the project](#about-the-project)

### Preview

#


<p align="center">
<img src="https://cdn.discordapp.com/attachments/954213773676273685/987783858466476052/lottery-demo-1.PNG" width="300" />
<img src="https://cdn.discordapp.com/attachments/954213773676273685/987783858743279636/lottery-demo-2.PNG" width="300" />
<img src="https://cdn.discordapp.com/attachments/954213773676273685/987783859032711198/lottery-demo-3.PNG" width="300" />
<img src="https://cdn.discordapp.com/attachments/954213773676273685/987783859280158730/lottery-demo-4.PNG" width="300" />
<img src="https://cdn.discordapp.com/attachments/954213773676273685/987783859565375488/lottery-demo-5.PNG" width="300" />
<img src="https://cdn.discordapp.com/attachments/782465358191525959/987785879844192316/unknown.png" width="300" />
</p>

## Frontend

### Installation and usage

Use the package manager [Yarn](https://yarnpkg.com/) to install the frontend

```bash
yarn install
```

Then you can just run the project

```bash
yarn dev
```

##### Your server should be up in your _localhost_ port 3000!

### Support

If you want to run your own contract in this app you need to go to the `constants` folder and update the `contract.js` file and update it based on the deployment you want in the `smartcontract/deployments/{network}` folder and export it:

```js
module.exports = {
  address: "CONTRACT_ADDRESS",
  appChainId: CHAIN_ID,
  abi: [
    // Lots of stuff going on here :P
  ]
```

##### Now everything is ready to go (yay!). I've deployed it using the [Vercel CLI](https://vercel.com/cli). It's really easy to deploy with Vercel btw.

## Smart contract

### Prerequisites

Besides having the package manager [npm](https://www.npmjs.com/) installed, you want to get an [_Alchemy API Key_](https://www.alchemy.com/) to deploy your project to a testnet. You should also (if you don't have) create a [Metamask](https://metamask.io/) (or any other wallet) and get your private keys to put them in your `.env` file. This [article](https://metamask.zendesk.com/hc/en-us/articles/360015289632-How-to-export-an-account-s-private-key) might be of help in case you don't know how to export your private keys

You should also get some **fake ETH** and **fake LINK** in order to deploy this contract (Why LINK? We'll talk about this later). If you are using Rinkeby network I recommend using the [Chainlink faucet](https://faucets.chain.link/rinkeby)

We're now ready to go! Excited? Me too!

### Installation and usage

##### Quickstart

```bash
npm install
npx hardhat deploy --network rinkeby
npx hardhat fund-link --contract "A real long contract address" --network rinkeby
npx hardhat test
```

Note: The integration test take some time (like 5 mins). So be patient please :)

## About the project

### Project status

I'm actively working in this project, there are lots of things to work in, principally the frontend, it lacks of good UI and UX and there are lots of things to be improved.

### Contributing

Are you interested in adding new features to this project? Your ideas are always welcome, for any change you want to do just make a pull request or for major changes try making an issue.

### Authors and acknowledgement

This project was based on the [Jonathan Burmester](https://dev.to/johbu) Creating a Lottery with Hardhat and Chainlink tutorial. You can find it at [dev.to](https://dev.to/johbu/creating-a-lottery-with-hardhat-and-chainlink-385f)

### License

[MIT](https://choosealicense.com/licenses/mit/)
