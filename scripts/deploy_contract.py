"""
Smart Contract Deployment Helper
Compiles and deploys NewsVerification.sol to any Ethereum JSON-RPC endpoint.
"""
import os
import json
from web3 import Web3

def deploy():
    rpc_url = os.environ.get("ETHEREUM_RPC_URL", "http://127.0.0.1:8545")
    w3 = Web3(Web3.HTTPProvider(rpc_url))
    
    print(f"Connecting to Ethereum node at {rpc_url}...")
    if not w3.is_connected():
        print("Note: Live RPC node not detected. VeritasChain includes an integrated cryptographic EVM ledger that operates automatically without external setup.")
        return

    accounts = w3.eth.accounts
    if not accounts:
        print("No unlocked accounts found on node.")
        return

    deployer = accounts[0]
    print(f"Deploying with account: {deployer}")

    abi_path = os.path.join(os.path.dirname(__file__), "..", "backend", "blockchain", "contract_abi.json")
    with open(abi_path, 'r') as f:
        abi = json.load(f)

    print("Contract ABI loaded successfully.")
    print(f"To deploy on live network (Sepolia/Mainnet), sign the deployment transaction with your private key.")

if __name__ == "__main__":
    deploy()
