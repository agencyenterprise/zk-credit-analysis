import { config } from "@onflow/fcl";

config({
  "accessNode.api": process.env.NEXT_PUBLIC_FLOW_ACCESS_NODE_API,
  "discovery.wallet": process.env.NEXT_PUBLIC_FLOW_DISCOVERY_WALLET,
  "flow.network": process.env.NEXT_PUBLIC_FLOW_NETWORK,
  "app.detail.title": "ZK Credit",
  "fcl.limit": Number(process.env.NEXT_PUBLIC_FCL_COMPUTE_LIMIT),
  "0xScoreContract": process.env.NEXT_PUBLIC_CONTRACT_OWNER_ADDRESS,
  "0xFLOW": process.env.NEXT_PUBLIC_FLOW_TOKEN_ADDRESS,
  "0xFT": process.env.NEXT_PUBLIC_FUNGIBLE_TOKEN_ADDRESS,
});
