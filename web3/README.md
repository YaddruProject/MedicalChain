# Web3 Smart Contract - Medical Blockchain

This directory contains the core Smart Contract used to manage Electronic Health Records (EHR) on the blockchain.

## Deployment Instructions

Follow these steps to deploy the contract locally using Hardhat:

### 1. Navigate to the web3 directory

```bash
cd web3
```

### 2. Configure Admin Details

Before deployment, update the admin info in `ignition/modules/MedicalChain.js`:

- `ADDRESS` - Admin account public address
- `NAME` - Name for the admin
- `EMAIL` - Email of admin
- `CONTACT` - Contact number of admin

Make sure the `ADDRESS` matches the account you're assigning as the **Admin**.

### 3. Compile the contract

```bash
npx hardhat compile
```

### 4. Deploy the Contract

```bash
npx hardhat ignition deploy ignition/modules/MedicalChain.js --network localhost
```

---

### 4. Save the Contract Address and ABI

After successful deployment, a **contract address** will be displayed in the terminal.
Also, the ABI (Application Binary Interface) will be generated automatically inside the artifacts directory (`abi` section in `artifacts/contracts/MedicalChain.sol/MedicalChain.json`) during compilation.

Make sure to save this address and abi — it will be required later in the frontend (`client`) to interact with the smart contract.
