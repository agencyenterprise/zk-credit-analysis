import React, { type PropsWithChildren } from "react";

type AddHistory = { type: "history"; mortdue: number; value: number };
type AddIncome = { type: "income"; reason: Reason; job: Job; yoj: number };
type AddCredit = {
  type: "credit";
  derog: number;
  delinq: number;
  clage: number;
  ninq: number;
  clno: number;
  debtinc: number;
};
type LoanTerms = { type: "loan"; loan: number; encrypted: boolean };

type Action = AddHistory | AddIncome | AddCredit | LoanTerms;

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
} as const;

type State = {
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
};

function loanReducer(state: State, action: Action): State {
  switch (action.type) {
    case "history": {
      const { mortdue, value } = action;
      const newState = { ...state, mortdue, value } as State;
      const info = JSON.stringify(newState);
      window.localStorage.setItem("loanState", info);
      return newState;
    }
    case "income": {
      const { reason, job, yoj } = action;
      const newState = { ...state, reason, job, yoj } as State;
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
