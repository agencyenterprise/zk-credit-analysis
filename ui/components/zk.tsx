import { useEffect, useState } from "react";
import { initialize, ZoKratesProvider } from "zokrates-js";
import { useMetamask } from "../hooks/useMetamask";
import getTransactions, { getAggregatedWeb2Data } from "../utils/transactions";
import { useLoan } from "../hooks/useLoan";
import LoanApproovalModel from "../utils/model";
const snarkjs = require("snarkjs");
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
const ZK = (props: any) => {
  const { push } = useRouter();
  const { state } = useMetamask();
  const { state: loanState, dispatch } = useLoan();
  const [zokratesProvider, setZokratesProvider] = useState<ZoKratesProvider>();
  const makeLoanRequest = async (proofs: string[], score: number) => {
    const { wallet } = state;
    const loanRequest = await fetch("/api/addLoanRequest", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        requesterAddress: wallet,
        proofs,
        score,
      }),
    });
    return await loanRequest.json();
  };
  useEffect(() => {
    const load = async () => {
      let provider = await initialize();
      setZokratesProvider(provider);
    };
    load();
  }, []);
  const success = async (msg: any, timeout: number = 3000) => {
    toast.success(msg, {
      position: "top-right",
      autoClose: timeout,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
    await sleep(timeout);
  };
  const info = async (msg: string) => {
    toast.info(msg, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
    await sleep(3000);
  };
  const error = async (msg: any) => {
    toast.error(msg, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
    await sleep(3000);
  };
  const sleep = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };
  const predict = async () => {
    console.log(loanState);
    dispatch({ type: "analysis", isAnalyzing: true });
    try {
      await info("Computing proof of balance for Polygon...");
      const ethAggragations = await getAggregations();
      const { snarkjsProof: ethBalanceProof } = await computeProofOfBalance(
        ethAggragations
      );
      await info(
        "Computing proof of elegibility based on the financial data you provided..."
      );
      const { ccavg, loan, income } = loanState;
      const flowAggregations = getAggregatedWeb2Data(ccavg, income, loan);
      const { snarkjsProof: web2BalanceProof } = await computeProofOfBalance(
        flowAggregations
      );
      await info("Computing loan approval...");
      const loanApprovalModel = new LoanApproovalModel();
      await loanApprovalModel.loadModel();
      const input = { ...loanState };
      const data = await loanApprovalModel.predict(input);
      if (data?.prediction == 0) {
        throw new Error("Not approved");
      }
      const proofs = [
        JSON.stringify(ethBalanceProof),
        JSON.stringify(web2BalanceProof),
        JSON.stringify(data!.proof),
      ];
      console.log(data);
      console.log(proofs);
      dispatch({ type: "loanResult", proofs, score: data!.score });
      await info("Persisting your score data in our contract...");
      await makeLoanRequest(proofs, data!.score);
      await success(
        <div className="flex flex-col">
          <p className="text-sm">You are approved for a loan!</p>
          <p className="text-xs">We will contat you in a few weeks!</p>
        </div>,
        5000
      );
    } catch (err: any) {
      console.log(err);
      await error(
        <div className="flex flex-col">
          <p className="text-sm">You are not elegible for a loan this time.</p>
          <p className="text-xs">Try again in a few weeks</p>
        </div>
      );
    } finally {
      dispatch({ type: "analysis", isAnalyzing: false });
      await sleep(5000);
      push("/");
    }
  };
  const getAggregations = async (): Promise<
    [[string, string, string, string], string]
  > => {
    const { wallet, balance } = state;
    const { loan } = loanState;
    const parsedBalance = (+balance! + 1).toFixed(0);
    const { expenses, earnings, balanceRatio, averageEarning, averageExpense } =
      await getTransactions(wallet!);
    return [
      [
        parsedBalance,
        earnings.toFixed(0),
        expenses.toFixed(0),
        balanceRatio.toFixed(0),
      ],
      loan.toFixed(0),
    ];
  };
  const computeProofOfBalance = async (
    inputs: [[string, string, string, string], string]
  ) => {
    try {
      const program = zokratesProvider!.compile(props.source);
      //const inputs = await getAggregations();
      const output = zokratesProvider!.computeWitness(program, inputs, {
        snarkjs: true,
      });
      const provingKey = Uint8Array.from(Buffer.from(props.provingKey, "hex"));
      const zokratesProof = zokratesProvider!.generateProof(
        program.program,
        output.witness,
        provingKey
      );

      // optionally we can use snarkjs to prove :)
      const zkey = Uint8Array.from(Buffer.from(props.snarkjs.zkey, "hex"));
      const snarkjsProof = await snarkjs.groth16.prove(
        zkey,
        output!.snarkjs!.witness
      );
      console.log(zokratesProof);
      await success("Your proof of balance was computed with success!");
      return { zokratesProof, snarkjsProof };
    } catch (e) {
      console.log(inputs);
      console.log(e);
      throw new Error(
        "You are not elegible for a loan this time. Try again in a few weeks!"
      );
    }
  };

  return { predict };
};

export default ZK;
