import "../styles/globals.css";

import type { AppProps } from "next/app";
import { MetamaskProvider } from "../hooks/useMetamask";
import { StyledEngineProvider } from "@mui/material/styles";
import { LoanProvider } from "../hooks/useLoan";
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <MetamaskProvider>
      <LoanProvider>
        <StyledEngineProvider injectFirst>
          <Component {...pageProps} />
        </StyledEngineProvider>
      </LoanProvider>
    </MetamaskProvider>
  );
}

export default MyApp;
