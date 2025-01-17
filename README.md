# Decentratwitter

## Technology Stack & Tools

- Solidity (Writing Smart Contract)
- Javascript (React & Testing)
- [Ethers](https://docs.ethers.io/v5/) (Blockchain Interaction)
- [Hardhat](https://hardhat.org/) (Development Framework)
- [Ipfs](https://ipfs.io/) (Metadata storage)
- [React routers](https://v5.reactrouter.com/) (Navigational components)

## Requirements For Initial Setup
- Install [NodeJS](https://nodejs.org/en/), should work with any node version below 16.5.0
- Install [Hardhat](https://hardhat.org/)
- Create an account [Pinata](https://www.pinata.cloud/) Generate a new API_KEY along with a SECRET_KEY. Create a file as ".env" in the     same folder and store both the details as:
  ```
  REACT_APP_PINATA_API_KEY="your api key"
  REACT_APP_PINATA_API_SECRET="your secret key"
  
  ```

## Setting Up
### 1. Clone/Download the Repository

### 2. Install Dependencies:
```
$ cd decentratwitter
$ npm install
```
### 3. Boot up local development blockchain
```
$ cd decentratwitter
$ npx hardhat node
```

### 4. Connect development blockchain accounts to Metamask
- Copy private key of the addresses and import to Metamask
- Connect your metamask to hardhat blockchain, network 127.0.0.1:8545.
- If you have not added hardhat to the list of networks on your metamask, open up a browser, click the fox icon, then click the top center dropdown button that lists all the available networks then click add networks. A form should pop up. For the "Network Name" field enter "Hardhat". For the "New RPC URL" field enter "http://127.0.0.1:8545". For the chain ID enter "31337". Then click save.  


### 5. Run deploy script to migrate smart contracts
`$ npx hardhat run scripts/deploy.js --network localhost`

### 6. Run Tests
`$ npx hardhat test`

### 7. Launch Frontend
`$ npm run start`

License
----
MIT

