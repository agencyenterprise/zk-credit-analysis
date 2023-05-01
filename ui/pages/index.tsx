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
import { initialState, useLoan } from "../hooks/useLoan";
const Home: NextPage = (props) => {
  const { dispatch, state } = useMetamask();
  const { state: loanState, dispatch: dispatchLoan } = useLoan();
  const listen = useListen();
  // const handleAddUsdc = async () => {
  //   dispatch({ type: "loading" });

  //   await window.ethereum.request({
  //     method: "wallet_watchAsset",
  //     params: {
  //       type: "ERC20",
  //       options: {
  //         address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  //         symbol: "USDC",
  //         decimals: 18,
  //         image: "https://cryptologos.cc/logos/usd-coin-usdc-logo.svg?v=023",
  //       },
  //     },
  //   });
  //   dispatch({ type: "idle" });
  // };

  useEffect(() => {
    if (typeof window !== undefined) {
      // start by checking if window.ethereum is present, indicating a wallet extension
      const ethereumProviderInjected = typeof window.ethereum !== "undefined";
      // this could be other wallets so we can verify if we are dealing with metamask
      // using the boolean constructor to be explecit and not let this be used as a falsy value (optional)
      const isMetamaskInstalled =
        ethereumProviderInjected && Boolean(window.ethereum.isMetaMask);

      const local = window.localStorage.getItem("metamaskState");

      // user was previously connected, start listening to MM
      if (local) {
        listen();
      }

      // local could be null if not present in LocalStorage
      const { wallet, balance } = local
        ? JSON.parse(local)
        : // backup if local storage is empty
          { wallet: null, balance: null };
      console.log(`wallet: ${wallet}, balance: ${balance}`);
      // console.log(state);
      dispatch({ type: "pageLoaded", isMetamaskInstalled, wallet, balance });

      wallet && getTransactions(wallet);
      const loanState = window.localStorage.getItem("loanState");
      const {
        loan,
        mortdue,
        value,
        reason,
        job,
        yoj,
        derog,
        delinq,
        clage,
        ninq,
        clno,
        debtinc,
        encrypted,
        experience,
        income,
        education,
        age,
        creditCard,
        family,
        online,
        securities,
        zip,
        ccavg,
        cdAccount,
      } = loanState ? JSON.parse(loanState) : initialState;
      dispatchLoan({
        type: "history",
        mortdue,
        value,
        age,
        zip,
        family,
        securities,
        creditCard,
        online,
        cdAccount,
      });
      dispatchLoan({
        type: "income",
        reason,
        job,
        yoj,
        experience,
        income,
        education,
        ccavg,
      });
      dispatchLoan({
        type: "credit",
        derog,
        delinq,
        clage,
        ninq,
        clno,
        debtinc,
      });
      dispatchLoan({ type: "loan", loan, encrypted });
    }
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
