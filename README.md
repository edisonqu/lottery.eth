# Chainlink Lottery

#### [Link to the project](https://rockttery.vercel.app/)

### Welcome!

This is a project in which people can join a lottery by paying a ticket price with ether accumulating a prize. The winner is declared based on a randomly-generated number thanks to the [Chainlink VRF](https://docs.chain.link/docs/chainlink-vrf/)

### Table of contents

- [Preview](#preview)
- [Frontend](#frontend)
- [Smart contract](#smart-contract)
- [About the project](#about-the-project)

### Preview

#

<img src="https://cdn.discordapp.com/attachments/954213773676273685/987783858466476052/lottery-demo-1.PNG" width="1200" />
<img src="https://cdn.discordapp.com/attachments/954213773676273685/987783858743279636/lottery-demo-2.PNG" width="1200" />
<img src="https://cdn.discordapp.com/attachments/954213773676273685/987783859032711198/lottery-demo-3.PNG" width="1200" />
<img src="https://cdn.discordapp.com/attachments/954213773676273685/987783859280158730/lottery-demo-4.PNG" width="1200" />
<img src="https://cdn.discordapp.com/attachments/954213773676273685/987783859565375488/lottery-demo-5.PNG" width="1200" />

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

So... There are many things going on here so let's try to break them in as small parts as possible.

At first let's install the packages of our project with our good [npm](https://www.npmjs.com/)

```bash
npm install
```

Great! So, let's understand how this project is working...

1. Contract is deployed and the deployer is setted as the admin, our admin can both create lotteries and finish them
2. The admin creates some lotteries with different end dates and ticket prices
3. People join the lottery buying a ticket and a prize pool starts raising
4. Once the end date was reached the admin can finish the lottery and the winner is randomly selected based on a random number

Well, it wasn't that complex right? We create a lottery, people participate, lottery ends and our winner is randomly selected, but... How we make it random? Easy! We use our `Math.random()` function! Or not...

I lied, there isn't something like that in Solidity, and randomness generation isn't very easy to achieve in blockchain because it's **deterministic**, so we can just create pseudorandom numbers. Am I going to explain it? Of course not! But this [article](https://www.sitepoint.com/solidity-pitfalls-random-number-generation-for-ethereum/#:~:text=Solidity%20is%20not%20capable%20of,more%20basic%20solutions%20are%20used.) does it pretty well.

Now that we know that we can't create really randomness with Solidity, what do we do? Cry? Maybe, but, as in most other problems, it was already solved by other people, this is where our **LINK** tokens join the game.

I'd really like to write a lot about descentralized oracles but let's avoid that for the moment, you can anyways start reading about it in the [Chainlink page](https://chain.link/). Let's go on setting up our project

Let's deploy the contract! Run:

```bash
npx hardhat deploy --network rinkeby
```

You did it! Now you'll be able to see your deployment in the `deployments/rinkeby` folder and send a screenshot to your friends. You might have seen that terminal sent someting like

```bash
Run the following command to fund contract with LINK:
npx hardhat fund-link --contract "A real long contract address" --network rinkeby
```

So let'so do what our computer tell us to, why not? Thanks to this we'll be able to request randomness to the Chainlink VRF, read more about it [Here](https://docs.chain.link/docs/chainlink-vrf/?_ga=2.221503640.1285041741.1655241044-1458478499.1655241044)

Run:

```bash
npx hardhat fund-link --contract "A real long contract address" --network rinkeby
```

And there you're! Everything should be working fine, if you want to make sure you can run the tests:

```bash
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
