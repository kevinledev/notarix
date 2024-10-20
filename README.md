built with Polygon dApp launchpad:
https://docs.polygon.technology/tools/dApp-development/launchpad/intro/

repo:
https://github.com/0xPolygon/dapp-launchpad

- added Dynamic labs wallet connect


## Starting a dev environment
1. install dapp-launchpad globally:
`npm install -g @polygonlabs/dapp-launchpad`

2. run the command
`dapp-launchpad dev`


## Smart Contract Development

### Overview of the NotaryPayment Contract:
The smart contract, **NotaryPayment.sol**, was developed to handle payments in USDC. The contract allows users to pay a fee in USDC, which is required for the notarization of their documents. The core functions of the contract include:
- **payFee()**: Enables users to transfer USDC from their wallet to the contract in exchange for the notarization service.
- **withdrawFunds()**: Allows the owner to withdraw all collected USDC from the contract.


### Deployment Process:
The smart contract was deployed using **Hardhat**, on the **Polygon Amoy testnet**. The deployment process involved:
1. Writing and compiling the contract in Solidity.
2. Creating deployment scripts to automate the deployment on the Polygon Amoy testnet.
3. Verifying the contract’s functionality by interacting with it via the frontend application.

### Choice of Polygon Network:
Polygon was selected due to its low transaction fees and high scalability, which are essential for consumer-facing applications like Notarix, as users can interact with the smart contract without encountering high fees typical on the Ethereum network.

### Integration of USDC for Payments:
USDC (Circle) is the primary currency collected from users in the notary service. By using USDC, the contract ensures a consistent payment experience for users. The **NotaryPayment.sol** contract collects fees directly in USDC from users when they submit documents for notarization.
