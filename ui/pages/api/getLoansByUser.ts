import type { NextApiRequest, NextApiResponse } from "next";
import { ethers } from "ethers";
import ZkCreditScore from "../../public/ZkCreditScore.json";


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("req.body")
  console.log(req.body)

  const { userAddress } = JSON.parse(req.body);

  const alchemyApiKey = process.env.ALCHEMY_API_KEY;
  const zkCreditScoreContractAddress = process.env
    .NEXT_PUBLIC_ZK_CREDIT_SCORE_CONTRACT_ADDRESS as string;
  const provider = new ethers.providers.JsonRpcProvider(
    `https://polygon-mumbai.g.alchemy.com/v2/${alchemyApiKey}`
  );

  const zkCreditScoreContract = new ethers.Contract(
    zkCreditScoreContractAddress,
    ZkCreditScore.abi,
    provider
  );

  const allLoanRequests = await zkCreditScoreContract.getLoanRequests();

  const userLoanRequests = allLoanRequests.filter((loanRequest: any) => {
    if (loanRequest[0].toLowerCase() === userAddress.toLowerCase()) return true;
    return false;
  })
  
  console.log(userLoanRequests.length)

  res.status(200).json({ userLoanRequests });
}
