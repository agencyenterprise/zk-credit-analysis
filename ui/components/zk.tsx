import { useEffect, useState } from "react";
import { initialize, ZoKratesProvider } from "zokrates-js";
import { useMetamask } from "../hooks/useMetamask";
import getTransactions, { getAggregatedFlowData } from "../utils/transactions";
import { useLoan } from "../hooks/useLoan";
import LoanApproovalModel from "../utils/model";
const snarkjs = require("snarkjs");
import { toast } from "react-toastify";
import { useAuth } from "../hooks/FlowAuthContext";
import { useRouter } from "next/navigation";
const ZK = (props: any) => {
  const { push } = useRouter();
  const { state } = useMetamask();
  const { state: loanState, dispatch } = useLoan();
  const { currentUser, makeLoanRequest, getFlowBalance } = useAuth();
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
  const success = async (msg: any) => {
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
    await sleep(3000);
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
      await info("Computing proof of balance for Ethereum...");
      const ethAggragations = await getAggregations();
      const { snarkjsProof: ethBalanceProof } = await computeProofOfBalance(
        ethAggragations
      );
      await info("Computing proof of balance for Flow...");
      const { ccavg, loan, income } = loanState;
      const flowBalance = await getFlowBalance();
      console.log(flowBalance);
      const flowAggregations = getAggregatedFlowData(
        ccavg,
        income,
        loan,
        flowBalance
      );
      const { snarkjsProof: flowBalanceProof } = await computeProofOfBalance(
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
        JSON.stringify(flowBalanceProof),
        JSON.stringify(data?.proof),
      ];
      console.log(data);
      const score = (data?.predictions || [])[1] || 0.0;
      dispatch({ type: "loanResult", proofs, score });
      await info("In order to continue, please sign the next transaction.");
      await makeLoanRequest(proofs, score);
      push("/");
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
  const flowTransactionData = () => {
    const { loan, ccavg, income } = loanState;
    const inputs = getAggregatedFlowData(
      ccavg,
      income,
      loan,
      currentUser.balance
    );
    return inputs;
  };
  const computeProofOfBalance = async (
    inputs: [[string, string, string, string], string]
  ) => {
    try {
      console.log(currentUser);
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
        await success("Proof is valid!!");
      } else {
        throw new Error("Verification failed :(");
      }
    } catch (e) {
      await error("Proof verification failed :(");
    }
  };

  return { predict };
};

export default ZK;
