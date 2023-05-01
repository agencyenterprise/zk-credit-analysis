import { useEffect, useState } from "react";
import { initialize, ZoKratesProvider } from "zokrates-js";
import { useMetamask } from "../hooks/useMetamask";
import getTransactions from "../utils/transactions";
import { useLoan } from "../hooks/useLoan";
import LoanApproovalModel from "../utils/model";
const snarkjs = require("snarkjs");

const ZK = (props: any) => {
  const { state } = useMetamask();
  const { state: loanState, dispatch } = useLoan();
  const [zokratesProvider, setZokratesProvider] = useState<ZoKratesProvider>();
  const [isLoading, setIsLoading] = useState(false);
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
  const predict = async () => {
    console.log(loanState);
    dispatch({ type: "analysis", isAnalyzing: true });
    try {
      const loanApprovalModel = new LoanApproovalModel();
      await loanApprovalModel.loadModel();
      // const input = [
      //   -9.91834148e8, 1.27458198e9, 1.29408237e9, 2.54463914e9, 1.14329112e8,
      //   1.40070348e9, 2.08866067e9, 1.33039893e9, -5.54138048e8, -3.41910013e8,
      //   -2.5314293e8, -1.21796704e9, -6.42897024e8,
      // ];
      // await loanApprovalModel.generateZkProof(input);
      const input = { ...loanState };
      console.log(input);
      const data = await loanApprovalModel.predict(input);
      console.log(data);
      console.log("finish");
    } catch (err) {
      console.log(err);
    } finally {
      console.log("done");
      dispatch({ type: "analysis", isAnalyzing: false });
    }
  };
  //   const toast = useToast();
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
  const onSubmit = () => {
    setIsLoading(true);
    setProof(undefined);

    setTimeout(async () => {
      try {
        console.log(props);
        console.log("1");
        const program = zokratesProvider!.compile(props.source);
        //Uint8Array.from(Buffer.from(props.program, "hex"));
        console.log("2");
        const inputs = await getAggregations();
        const output = zokratesProvider!.computeWitness(program, inputs, {
          snarkjs: true,
        });
        console.log("3");
        const provingKey = Uint8Array.from(
          Buffer.from(props.provingKey, "hex")
        );
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
        // toast({
        //   title: "Yay!",
        //   description: "Your solution is correct :)",
        //   position: "top",
        //   status: "success",
        //   duration: 5000,
        //   isClosable: true,
        // });
      } catch (e) {
        console.error(e);
        // toast({
        //   title: "Whoops!",
        //   description: "Your solution seems to be incorrect :(",
        //   position: "top",
        //   status: "error",
        //   duration: 5000,
        //   isClosable: true,
        // });
      }

      setIsLoading(false);
    }, 100);
  };

  const verify = () => {
    setIsLoading(true);
    setTimeout(async () => {
      try {
        const { zokratesProof, snarkjsProof } = proof!;
        if (
          // verify using zokrates
          zokratesProvider!.verify(props.verificationKey, zokratesProof) &&
          // or with snarkjs
          (await snarkjs.groth16.verify(
            props.snarkjs.vkey,
            snarkjsProof.publicSignals,
            snarkjsProof.proof
          ))
        ) {
          //   toast({
          //     title: "Yes!",
          //     description: "Victor successfully verified Peggy's proof :)",
          //     position: "top",
          //     status: "success",
          //     duration: 5000,
          //     isClosable: true,
          //   });
        } else {
          throw new Error("Verification failed :(");
        }
      } catch (e) {
        console.error(e);
        // toast({
        //   title: "Whoops!",
        //   description: e!.toString(),
        //   position: "top",
        //   status: "error",
        //   duration: 5000,
        //   isClosable: true,
        // });
      }
      setIsLoading(false);
    }, 100);
  };

  return (
    <div className="flex flex-col justify-center space-y-10">
      <button className="text-yellow-300" onClick={onSubmit}>
        {!isLoading ? "Prove" : "Loading"}
      </button>
      <button className="text-green-300" onClick={verify}>
        {!isLoading ? "Verify" : "Loading"}
      </button>
      <button className="text-red-300" onClick={predict}>
        {!isLoading ? "Predict" : "Loading"}
      </button>
    </div>
  );
};

export default ZK;
