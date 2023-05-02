import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { expect } from 'chai'
import { ethers } from 'hardhat'
import { ZkCreditScore } from '../typechain-types'

describe('ZkCreditScore', () => {
  let zkCreditScore: ZkCreditScore

  let contractOwner: SignerWithAddress
  let bob: SignerWithAddress

  beforeEach(async () => {
    [ contractOwner, bob ] = await ethers.getSigners();

    const ZkCreditScore = await ethers.getContractFactory('ZkCreditScore')
    zkCreditScore = await ZkCreditScore.deploy()
    await zkCreditScore.deployed()
  })

  it('Should create loan request', async () => {
    const proofs = ["proof1", "proof2", "proof3"]
    const score = 1
    
    await zkCreditScore.addLoanRequest(bob.address, proofs, score)
    
    expect((await zkCreditScore.loanRequests(0)).requester).to.equal(bob.address)
    expect((await zkCreditScore.loanRequests(0)).score).to.equal(score)
  })
  
  it('Add loan request should fail when score is bigger than 1000000', async () => {
    const proofs = ["proof1", "proof2", "proof3"]
    await expect(zkCreditScore.addLoanRequest(bob.address, proofs, 1000001)).to.be.revertedWith("Score is bigger than 1000000")
  })
});
