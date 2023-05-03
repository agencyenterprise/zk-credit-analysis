import React, { type PropsWithChildren } from "react";
import { Dispatch as MetamaskDispatch } from "./useMetamask";
type AddHistory = {
  type: "history";
  mortdue: number;
  value: number;
  age: number;
  zip: number | undefined;
  family: number;
  securities: boolean;
  creditCard: boolean;
  online: boolean;
  cdAccount: boolean;
};
type AddIncome = {
  type: "income";
  reason: Reason;
  job: Job;
  yoj: number;
  experience: number;
  income: number;
  education: Education;
  ccavg: number;
};
type AddCredit = {
  type: "credit";
  derog: number;
  delinq: number;
  clage: number;
  ninq: number;
  clno: number;
  debtinc: number;
};

type Education = "Bachelor" | "Master" | "Advanced Degree";

type Analysis = {
  type: "analysis";
  isAnalyzing: boolean | undefined;
};

type LoanResult = { type: "loanResult"; proofs: string[]; score: number };

type LoanTerms = { type: "loan"; loan: number; description: string };

type Action =
  | AddHistory
  | AddIncome
  | AddCredit
  | LoanTerms
  | Analysis
  | LoanResult;

type Dispatch = (action: Action) => void;

export type Reason = "DebtCon" | "HomeImp" | "Other";
export type Job = "Mgr" | "Office" | "Other" | "ProfExe" | "Sales" | "Self";
export const initialState: State = {
  loan: 0.0,
  mortdue: 0.0,
  value: 0.0,
  reason: "DebtCon",
  job: "Mgr",
  yoj: 0.0,
  derog: 0.0,
  delinq: 0.0,
  clage: 0.0,
  ninq: 0.0,
  clno: 0.0,
  debtinc: 0.0,
  description: "",
  isAnalyzing: false,
  age: 0,
  zip: undefined,
  family: 0,
  securities: false,
  creditCard: false,
  online: false,
  experience: 0,
  income: 0,
  education: "Bachelor",
  ccavg: 0,
  cdAccount: false,
  proofs: [],
  score: 0.0,
};

export type State = {
  loan: number;
  mortdue: number;
  value: number;
  reason: Reason;
  job: Job;
  yoj: number;
  derog: number;
  delinq: number;
  clage: number;
  ninq: number;
  clno: number;
  debtinc: number;
  description: string;
  isAnalyzing: boolean;
  age: number;
  zip: number | undefined;
  family: number;
  securities: boolean;
  creditCard: boolean;
  online: boolean;
  experience: number;
  income: number;
  education: Education;
  ccavg: number;
  cdAccount: boolean;
  proofs: string[];
  score: number;
};

function loanReducer(state: State, action: Action): State {
  switch (action.type) {
    case "history": {
      const {
        mortdue,
        value,
        age,
        zip,
        family,
        securities,
        creditCard,
        online,
        cdAccount,
      } = action;
      const newState = {
        ...state,
        mortdue,
        value,
        age,
        zip,
        family,
        securities,
        creditCard,
        online,
        cdAccount,
      } as State;
      const info = JSON.stringify(newState);
      window.localStorage.setItem("loanState", info);
      return newState;
    }
    case "income": {
      const { reason, job, yoj, experience, income, education, ccavg } = action;
      const newState = {
        ...state,
        reason,
        job,
        yoj,
        experience,
        income,
        education,
        ccavg,
      } as State;
      const info = JSON.stringify(newState);
      window.localStorage.setItem("loanState", info);
      return newState;
    }
    case "credit": {
      const { derog, delinq, clage, ninq, clno, debtinc } = action;
      const newState = {
        ...state,
        derog,
        delinq,
        clage,
        ninq,
        clno,
        debtinc,
      } as State;
      const info = JSON.stringify(newState);
      window.localStorage.setItem("loanState", info);
      return newState;
    }
    case "loan": {
      const { loan, description } = action;
      const newState = { ...state, loan, description } as State;
      const info = JSON.stringify(newState);
      window.localStorage.setItem("loanState", info);
      return newState;
    }
    case "analysis": {
      let isAnalyzing;
      if (action.isAnalyzing !== undefined) {
        isAnalyzing = action.isAnalyzing;
      } else {
        isAnalyzing = !state.isAnalyzing;
      }
      const newState = { ...state, isAnalyzing } as State;
      const info = JSON.stringify(newState);
      window.localStorage.setItem("loanState", info);
      return newState;
    }
    case "loanResult": {
      const { proofs, score } = action;
      const newState = { ...state, proofs, score } as State;
      const info = JSON.stringify(newState);
      window.localStorage.setItem("loanState", info);
      return newState;
    }
    default: {
      throw new Error("Unhandled action type");
    }
  }
}

const LoanContext = React.createContext<
  { state: State; dispatch: Dispatch } | undefined
>(undefined);

function LoanProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = React.useReducer(loanReducer, initialState);
  const value = { state, dispatch };

  return <LoanContext.Provider value={value}>{children}</LoanContext.Provider>;
}

function useLoan() {
  const context = React.useContext(LoanContext);
  if (context === undefined) {
    throw new Error("useLoan must be used within a LoanProvider");
  }
  return context;
}

const stateManagement = (
  dispatchLoan: Dispatch,
  listen: () => void,
  dispatch: MetamaskDispatch
) => {
  if (typeof window !== undefined) {
    // start by checking if window.ethereum is present, indicating a wallet extension
    const ethereumProviderInjected = typeof window.ethereum !== "undefined";
    // this could be other wallets so we can verify if we are dealing with metamask
    // using the boolean constructor to be explecit and not let this be used as a falsy value (optional)
    const isMetamaskInstalled =
      ethereumProviderInjected && Boolean(window.ethereum.isMetaMask);

    const local = window.localStorage.getItem("metamaskState");
    const loanState = window.localStorage.getItem("loanState");
    // user was previously connected, start listening to MM
    if (local) {
      listen();
    }

    // local could be null if not present in LocalStorage
    const { wallet, balance } = local
      ? JSON.parse(local)
      : // backup if local storage is empty
        { wallet: null, balance: null };

    dispatch({ type: "pageLoaded", isMetamaskInstalled, wallet, balance });

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
      description,
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
    dispatchLoan({ type: "loan", loan, description });
  }
};

export { LoanProvider, useLoan, stateManagement };
