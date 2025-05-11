# Medical Blockchain

> Secure Sharing and Storing of Electronic Health Records (EHR) using Smart Contracts

## Description

This project presents a blockchain-based decentralized application (dApp) designed to securely manage and share Electronic Health Records (EHR). It uses Smart Contracts to manage and automate the sharing of EHR data between patients, doctors, and healthcare providers. All medical records are stored using the Inter Planetary File System (IPFS), ensuring secure and efficient access. The system ensures that only authorized entities can access patient data, and all actions are recorded immutably on the blockchain.

## Project Structure

```text
.
├── client             # Frontend interface
├── server             # Python backend for analytics logging
├── web3               # Core smart contract
└── web3-analytics     # Smart contract for analytics logging
```

## Prerequisites

Ensure the following are installed on your system:

- [Node.js](https://nodejs.org/)
- [Python 3.x](https://www.python.org/)
- [MetaMask](https://metamask.io/)
- [Pinata API Key](https://app.pinata.cloud/developers/api-keys)

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/medical-blockchain
cd medical-blockchain # This is the project root
```

### 2. Install Dependencies  

```bash
# Frontend
cd client
npm install

# Main smart contract
cd ../web3
npm install

# Analytics smart contract
cd ../web3-analytics
npm install

# Python analytics server
cd ../server
pip install -r requirements.txt
```

### 3. Start the Hardhat Node

Open a new terminal in the project root (medical-blockchain) and run:

```bash
cd web3
npx hardhat node
```

> This will start a local Ethereum network at `http://127.0.0.1:8545` with pre-funded accounts.

**Note:** Keep this terminal open. Closing it will stop the local Ethereum network.

### 4. Connect MetaMask  

- Import any of the Hardhat private keys into MetaMask.
- In MetaMask, add a custom network with the following details:
  - **Network Name**: Localhost 8545
  - **New RPC URL**: `http://127.0.0.1:8545`
  - **Chain ID**: `31337` (for Hardhat's local network)
  - **Currency Symbol**: `ETH`
  - **Block Explorer URL**: (optional) Leave blank
- Switch MetaMask to `Localhost 8545` network.

### 5. Import Hardhat Accounts into Metamask

When the Hardhat node starts, it displays a list of accounts along with their private keys.  
You'll need to import at least one account into MetaMask for the following roles:

- **Admin** – Only one specific account
- **Doctor** – Any account other than Admin and Patient
- **Patient** – Any account other than Admin and Doctor

**Important**: Remember which account you assign to the **Admin** role, as it will be required when deploying the contract. Doctor and Patient can be any of the remaining accounts.

#### How to Import an Account

1. In MetaMask, click the profile icon → **Import Account**.
2. Paste one of the private keys from the Hardhat terminal output.
3. (Optional) Label it based on the role (Admin, Doctor, or Patient).
4. Repeat the steps to import other accounts for Doctor and Patient roles.

### 6. Generate Pinata API Key and Gateway URL

To interact with IPFS using Pinata, you will need a **Pinata API Key** and **Gateway URL**. Follow these steps to generate it:

1. Visit [Pinata](https://www.pinata.cloud/).
2. Sign up or log in if you already have an account.
3. Once logged in, go to the **API Keys** section in the dashboard.
4. Click **Create API Key** and provide a name for your key.
5. Make sure to **enable all permissions** for the  API key (this includes permissions like uploading files to IPFS, pinning files, and accessing file details).
6. After creating the API key, make sure to **copy your JWT token**. You will need this token for the frontend (`client`) configuration.
7. Navigate to the **Gateways** section. If a gateway URL hasn't been created, create one and copy the URL — you'll also need this for the frontend (`client`) configuration.

### 7. Deploy the Web3 Smart Contract

Follow the instructions in - [**web3 README**](./web3/README.md).

### 8. Deploy the Web3 Analytics Smart Contract

Follow the instructions in - [**web3-analytics README**](./web3-analytics/README.md).

### 9. Start the Python Analytics Server

Follow the instructions in - [**server README**](./server/README.md).

### 10. Run the Frontend Client

Follow the instructions in - [**client README**](./client/README.md).

---

## License

This project is licensed under the [Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)](https://creativecommons.org/licenses/by-nc/4.0/).
