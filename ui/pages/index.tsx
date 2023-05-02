import type { NextPage } from "next";
import { useEffect } from "react";
import Wallet from "../components/Wallet";
import { useListen } from "../hooks/useListen";
import { useMetamask } from "../hooks/useMetamask";
import { CTA } from "../components/cta";
import ctaStyle from "../components/cta.module.css";

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
    </>
  );
};

export default Home;
