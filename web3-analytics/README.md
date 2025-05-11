# Web3 Analytics Smart Contract - Medical Blockchain

This directory contains a small smart contract used to perform simulated transactions for calculating metrics like throughput and latency which helps to measure system's performance under various loads.

## Deployment Instructions

Follow these steps to deploy the analytics contract locally using Hardhat:

### 1. Navigate to the web3-analytics directory

```bash
cd web3-analytics
```

### 2. Compile the contract

```bash
npx hardhat compile
```

### 3. Deploy the Contract

Run the following command to deploy the contract:

```bash
npx hardhat ignition deploy ignition/modules/Analytics.js --network localhost
```

### 4. Save the Contract Address and ABI

After successful deployment, a **contract address** will be displayed in the terminal.
Also, the ABI (Application Binary Interface) will be generated automatically inside the artifacts directory (`abi` section in `artifacts/contracts/Analytics.sol/Analytics.json`) during compilation.

Make sure to save this address and abi — it will be required later in the frontend (`server`) to interact with the smart contract.
