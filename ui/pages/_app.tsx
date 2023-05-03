import "../styles/globals.css";

import type { AppProps } from "next/app";
import { MetamaskProvider } from "../hooks/useMetamask";
import { StyledEngineProvider } from "@mui/material/styles";
import { LoanProvider, useLoan } from "../hooks/useLoan";
import MainLoader from "../components/mainLoader";
import { PropsWithChildren } from "react";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
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
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      {children}
    </div>
  );
}

export default MyApp;
