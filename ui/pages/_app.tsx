import "../styles/globals.css";

import type { AppProps } from "next/app";
import { MetamaskProvider } from "../hooks/useMetamask";
import { StyledEngineProvider } from "@mui/material/styles";
import { LoanProvider, useLoan } from "../hooks/useLoan";
import MainLoader from "../components/mainLoader";
import { PropsWithChildren } from "react";
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <MetamaskProvider>
      <LoanProvider>
        <StyledEngineProvider injectFirst></StyledEngineProvider>
        <Home>
          <Component {...pageProps} />
        </Home>
      </LoanProvider>
    </MetamaskProvider>
  );
}

function Home({ children }: PropsWithChildren) {
  const { state: loanState } = useLoan();
  return (
    <div>
      <MainLoader isLoading={loanState.isAnalyzing} />
      {children}
    </div>
  );
}

export default MyApp;
