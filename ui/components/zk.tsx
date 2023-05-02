import { useEffect, useState } from "react";
import { initialize, ZoKratesProvider } from "zokrates-js";
import { useMetamask } from "../hooks/useMetamask";
import getTransactions from "../utils/transactions";
import { useLoan } from "../hooks/useLoan";
import LoanApproovalModel from "../utils/model";
const snarkjs = require("snarkjs");
import { toast } from "react-toastify";
const ZK = (props: any) => {
  const { state } = useMetamask();
  const { state: loanState, dispatch } = useLoan();
  const [zokratesProvider, setZokratesProvider] = useState<ZoKratesProvider>();
  const [proof, setProof] = useState<{
    zokratesProof: any;
    snarkjsProof: any;
  }>();

  useEffect(() => {
    const load = async () => {
      let provider = await initialize();
      setZokratesProvider(provider);
    };
    load();
  }, []);
  const success = (msg: any) => {
    toast.success(msg, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };
  const info = (msg: string) => {
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
  };
  const error = (msg: any) => {
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
  };
  const predict = async () => {
    console.log(loanState);
    dispatch({ type: "analysis", isAnalyzing: true });
    try {
      info("Computing proof of balance...");
      setProof(undefined);
      await computeProofOfBalance();
      info("Computing loan approval...");
      const loanApprovalModel = new LoanApproovalModel();
      await loanApprovalModel.loadModel();
      const input = { ...loanState };
      const data = await loanApprovalModel.predict(input);
      if (data?.prediction == 0) {
        throw new Error("Not approved");
      }
      success(
        <div className="flex flex-col">
          <p className="text-sm">You are approved for a loan!</p>
          <p className="text-xs">We will contat you in a few weeks!</p>
        </div>
      );
    } catch (err: any) {
      console.log(err);
      error(
        <div className="flex flex-col">
          <p className="text-sm">You are not elegible for a loan this time.</p>
          <p className="text-xs">Try again in a few weeks</p>
        </div>
      );
    } finally {
      dispatch({ type: "analysis", isAnalyzing: false });
    }
  };
  const getAggregations = async () => {
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
  const computeProofOfBalance = async () => {
    try {
      const program = zokratesProvider!.compile(props.source);
      const inputs = await getAggregations();
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

      setProof({ zokratesProof, snarkjsProof });
      console.log(zokratesProof);
      success("Your proof of balance was computed with success!");
    } catch (e) {
      throw new Error(
        "You are not elegible for a loan this time. Try again in a few weeks!"
      );
    }
  };

  const verify = async () => {
    try {
      const { zokratesProof, snarkjsProof } = proof!;
      const snarkjsVerifier = await snarkjs.groth16.verify(
        props.snarkjs.vkey,
        snarkjsProof.publicSignals,
        snarkjsProof.proof
      );
      const zokratesVerifier = zokratesProvider!.verify(
        props.verificationKey,
        zokratesProof
      );
      if (snarkjsVerifier && zokratesVerifier) {
        success("Proof is valid!!");
      } else {
        throw new Error("Verification failed :(");
      }
    } catch (e) {
      error("Proof verification failed :(");
    }
  };

  return (
    <div className="flex flex-col justify-center space-y-10">
      {proof?.zokratesProof && (
        <button
          className="text-green-300"
          onClick={verify}
          disabled={loanState.isAnalyzing}
        >
          {!loanState.isAnalyzing ? "Verify" : "Loading"}
        </button>
      )}
      <button
        className="text-red-300"
        onClick={predict}
        disabled={loanState.isAnalyzing}
      >
        {!loanState.isAnalyzing ? "Predict" : "Loading"}
      </button>
    </div>
  );
};

export default ZK;
