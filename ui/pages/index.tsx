import type { NextPage } from "next";
import { useEffect } from "react";
import Wallet from "../components/Wallet";
import { useListen } from "../hooks/useListen";
import { useMetamask } from "../hooks/useMetamask";
import { CTA } from "../components/cta";
import ctaStyle from "../components/cta.module.css";
import ZK from "../components/zk";
import { readFile } from "fs/promises";
import getTransactions from "../utils/transactions";
import Script from "next/script";
import { initialState, stateManagement, useLoan } from "../hooks/useLoan";
const Home: NextPage = (props) => {
  const { dispatch, state } = useMetamask();
  const { state: loanState, dispatch: dispatchLoan } = useLoan();
  const listen = useListen();

  useEffect(() => {
    stateManagement(dispatchLoan, listen, dispatch);
  }, []);

  return (
    <>
      <Script src="/snarkjs.min.js" strategy="beforeInteractive" />
      <Wallet />
      <div className={"container mx-auto min-h-screen pt-5 " + ctaStyle.cta}>
        <CTA />
      </div>
      <ZK {...props} />
    </>
  );
};

export async function getStaticProps() {
  // zokrates artifacts
  const source = (await readFile("../circuit/balance.zok")).toString();
  const program = (await readFile("../circuit/balance")).toString("hex");
  const verificationKey = JSON.parse(
    (await readFile("../circuit/verification.key")).toString()
  );
  const provingKey = (await readFile("../circuit/proving.key")).toString("hex");

  // snarkjs artifacts
  const zkey = (await readFile("../circuit/snarkjs/balance.zkey")).toString(
    "hex"
  );
  const vkey = JSON.parse(
    (await readFile("../circuit/snarkjs/verification_key.json")).toString()
  );

  return {
    props: {
      source,
      program,
      verificationKey,
      provingKey,
      snarkjs: {
        zkey,
        vkey,
      },
    },
  };
}

export default Home;
