# Sorogit

A decentralized application (dApp) that enables users to post GitHub issues with a reward for users who bid on the issue. 

## Getting Started

From the workspace root:

1. Cloning the repository:
   ```sh
   git clone https://github.com/aggreyeric/sorogit.git
   ```
2. Building the contracts:
   ```sh
   soroban contract build
   ```
3. Running Tests:
   ```sh
   cargo test -- --nocapture
   ```
4. Deploying to testnet:
   ```sh
   stellar contract deploy --wasm target/wasm32-unknown-unknownrelease/gitissuebidding.wasm \
  --source book 
  --network testnet
```
   ```sh
   output > CONTRACT_ID
   ```
5. Initialize admin:
   ```sh
    stellar contract invoke --idCONTRACT_ID   --source ACCOUNT   --network testnet -- initialize --admin ACCOUNT --commission 10

   ```