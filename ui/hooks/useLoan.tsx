import React, { type PropsWithChildren } from "react";

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
type LoanTerms = { type: "loan"; loan: number; encrypted: boolean };

type Action = AddHistory | AddIncome | AddCredit | LoanTerms | Analysis;

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
  encrypted: false,
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
} as const;

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
  encrypted: boolean;
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
};

function loanReducer(state: State, action: Action): State {
  console.log("loanReducer", action);
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
      const { loan, encrypted } = action;
      const newState = { ...state, loan, encrypted } as State;
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

export { LoanProvider, useLoan };
