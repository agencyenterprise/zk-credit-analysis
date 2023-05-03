import type { NextApiRequest, NextApiResponse } from "next";
import {
  DefenderRelaySigner,
  DefenderRelayProvider,
} from "defender-relay-client/lib/ethers";
import { ethers } from "ethers";
import ZkCreditScore from "../../public/ZkCreditScore.json";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { requesterAddress, proofs, score } = req.body;

  const credentials = {
    apiKey: process.env.OZ_RELAY_API_KEY as string,
    apiSecret: process.env.OZ_RELAY_API_SECRET as string,
  };
  const provider = new DefenderRelayProvider(credentials);
  const signer = new DefenderRelaySigner(credentials, provider, {
    speed: "fast",
  });

  const zkCreditScoreContract = new ethers.Contract(
    process.env.NEXT_PUBLIC_ZK_CREDIT_SCORE_CONTRACT_ADDRESS as string,
    ZkCreditScore.abi,
    signer
  );

  const response = await zkCreditScoreContract[
    "addLoanRequest(address,string[],uint256)"
  ](requesterAddress, proofs, score);

  res.status(200).json({ response });
}
