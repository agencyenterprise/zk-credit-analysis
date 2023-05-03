import { ethers } from 'hardhat';
import { ZkCreditScore } from '../typechain-types'

async function main() {
    const [ deployer ] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);
    console.log("Account balance:", (await deployer.getBalance()).toString());

    const ZkCreditScore = await ethers.getContractFactory('ZkCreditScore')
    const zkCreditScore: ZkCreditScore = await ZkCreditScore.deploy()
    console.log('Deploying...');
    
    await zkCreditScore.deployed()
    console.log('Contract deployed at:', zkCreditScore.address);
}

main().catch((error) => {
    console.log(error);
    process.exitCode = 1;
});