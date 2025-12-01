#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Track background processes
HARDHAT_PID=""
PYTHON_PID=""
CLIENT_PID=""

# Cleanup function
cleanup() {
    echo -e "\n${YELLOW}Shutting down services...${NC}"
    
    if [ ! -z "$CLIENT_PID" ]; then
        echo -e "${BLUE}Stopping client...${NC}"
        kill $CLIENT_PID 2>/dev/null
        wait $CLIENT_PID 2>/dev/null
    fi
    
    if [ ! -z "$PYTHON_PID" ]; then
        echo -e "${BLUE}Stopping Python server...${NC}"
        kill $PYTHON_PID 2>/dev/null
        wait $PYTHON_PID 2>/dev/null
    fi
    
    if [ ! -z "$HARDHAT_PID" ]; then
        echo -e "${BLUE}Stopping Hardhat node...${NC}"
        kill $HARDHAT_PID 2>/dev/null
        wait $HARDHAT_PID 2>/dev/null
    fi
    
    # Extra cleanup to ensure all processes are killed
    pkill -f "vite" 2>/dev/null
    pkill -f "python3 main.py" 2>/dev/null
    pkill -f "hardhat node" 2>/dev/null
    
    echo -e "${GREEN}Cleanup complete!${NC}"
    exit 0
}

# Set up trap to catch CTRL+C and other exit signals
trap cleanup SIGINT SIGTERM EXIT

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  MedicalChain Local Deployment${NC}"
echo -e "${GREEN}========================================${NC}\n"

# Step 1: Start Hardhat Node
echo -e "${BLUE}[1/5] Starting Hardhat node...${NC}"
cd web3
npx hardhat node > ../hardhat.log 2>&1 &
HARDHAT_PID=$!
cd ..

echo -e "${YELLOW}Waiting for Hardhat node to start...${NC}"
sleep 5

# Check if Hardhat is running
if ! kill -0 $HARDHAT_PID 2>/dev/null; then
    echo -e "${RED}Failed to start Hardhat node!${NC}"
    cat hardhat.log
    exit 1
fi
echo -e "${GREEN}✓ Hardhat node running (PID: $HARDHAT_PID)${NC}\n"

# Step 2: Deploy MedicalChain Contract
echo -e "${BLUE}[2/5] Deploying MedicalChain contract...${NC}"
cd web3
DEPLOY_OUTPUT=$(npx hardhat ignition deploy ./ignition/modules/MedicalChain.js --network localhost 2>&1)
DEPLOY_STATUS=$?

if [ $DEPLOY_STATUS -ne 0 ]; then
    echo -e "${RED}Failed to deploy MedicalChain contract!${NC}"
    echo "$DEPLOY_OUTPUT"
    exit 1
fi

# Extract contract address from deployment output
MEDICAL_CHAIN_ADDRESS=$(echo "$DEPLOY_OUTPUT" | grep -oE '0x[a-fA-F0-9]{40}' | head -1)

if [ -z "$MEDICAL_CHAIN_ADDRESS" ]; then
    echo -e "${RED}Could not extract MedicalChain contract address!${NC}"
    echo "$DEPLOY_OUTPUT"
    exit 1
fi

echo -e "${GREEN}✓ MedicalChain deployed at: $MEDICAL_CHAIN_ADDRESS${NC}\n"
cd ..

# Step 3: Deploy Analytics Contract
echo -e "${BLUE}[3/5] Deploying Analytics contract...${NC}"
cd web3-analytics
ANALYTICS_OUTPUT=$(npx hardhat ignition deploy ./ignition/modules/Analytics.js --network localhost 2>&1)
ANALYTICS_STATUS=$?

if [ $ANALYTICS_STATUS -ne 0 ]; then
    echo -e "${RED}Failed to deploy Analytics contract!${NC}"
    echo "$ANALYTICS_OUTPUT"
    exit 1
fi

# Extract contract address from deployment output
ANALYTICS_ADDRESS=$(echo "$ANALYTICS_OUTPUT" | grep -oE '0x[a-fA-F0-9]{40}' | head -1)

if [ -z "$ANALYTICS_ADDRESS" ]; then
    echo -e "${RED}Could not extract Analytics contract address!${NC}"
    echo "$ANALYTICS_OUTPUT"
    exit 1
fi

echo -e "${GREEN}✓ Analytics deployed at: $ANALYTICS_ADDRESS${NC}\n"
cd ..

# Update server config.env with Analytics contract address
echo -e "${BLUE}Updating server configuration...${NC}"
sed -i.bak "s|^CONTRACT_ADDRESS.*|CONTRACT_ADDRESS = \"$ANALYTICS_ADDRESS\"|g" server/config.env
echo -e "${GREEN}✓ Server config updated${NC}\n"

# Step 4: Start Python Server
echo -e "${BLUE}[4/5] Starting Python server...${NC}"
cd server
python3 main.py > ../server.log 2>&1 &
PYTHON_PID=$!
cd ..

echo -e "${YELLOW}Waiting for Python server to start...${NC}"
sleep 3

# Check if Python server is running
if ! kill -0 $PYTHON_PID 2>/dev/null; then
    echo -e "${RED}Failed to start Python server!${NC}"
    cat server.log
    exit 1
fi
echo -e "${GREEN}✓ Python server running (PID: $PYTHON_PID)${NC}\n"

# Step 5: Start Client
echo -e "${BLUE}[5/5] Starting React client...${NC}"
cd client

# Check if .env exists, if not create from sample.env
if [ ! -f .env ]; then
    echo -e "${YELLOW}Creating .env from sample.env...${NC}"
    cp sample.env .env
fi

# Update client .env with MedicalChain contract address
echo -e "${BLUE}Updating client configuration...${NC}"
if grep -q "^VITE_CONTRACT_ADDRESS=" .env; then
    sed -i.bak "s|^VITE_CONTRACT_ADDRESS=.*|VITE_CONTRACT_ADDRESS=$MEDICAL_CHAIN_ADDRESS|g" .env
else
    echo "VITE_CONTRACT_ADDRESS=$MEDICAL_CHAIN_ADDRESS" >> .env
fi

npm run dev > ../client.log 2>&1 &
CLIENT_PID=$!
cd ..

echo -e "${YELLOW}Waiting for client to start...${NC}"
sleep 3

# Check if Client is running
if ! kill -0 $CLIENT_PID 2>/dev/null; then
    echo -e "${RED}Failed to start client!${NC}"
    cat client.log
    exit 1
fi

echo -e "${GREEN}✓ Client running (PID: $CLIENT_PID)${NC}\n"

# Display summary
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  All Services Running!${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e "${YELLOW}MedicalChain Contract: ${NC}$MEDICAL_CHAIN_ADDRESS"
echo -e "${YELLOW}Analytics Contract:    ${NC}$ANALYTICS_ADDRESS"
echo -e "${YELLOW}Hardhat Node:          ${NC}http://127.0.0.1:8545"
echo -e "${YELLOW}Python Server:         ${NC}http://127.0.0.1:5000 (check server.log for actual port)"
echo -e "${YELLOW}React Client:          ${NC}http://localhost:5173 (check client.log for actual port)"
echo -e "${GREEN}========================================${NC}\n"
echo -e "${BLUE}Press CTRL+C to stop all services${NC}\n"

# Keep script running
wait
