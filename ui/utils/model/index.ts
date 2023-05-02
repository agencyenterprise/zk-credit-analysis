import * as tf from "@tensorflow/tfjs";
import calculateProof, { IProofInput } from "../proof";
import { State } from "../../hooks/useLoan";
import { StandardScaler, setBackend } from "scikitjs";
setBackend(tf);

const scalerAVG = () => {
  return [
    2.51497089e3, 4.53857778e1, 2.01535556e1, 7.37493333e1, 9.31602629e4, 2.392,
    1.93238, 1.88177778, 5.67217778e1, 1.04666667e-1, 6.02222222e-2,
    5.97333333e-1, 2.92444444e-1,
  ];
};

const scalerSTD = () => {
  return [
    1.44174396e3, 1.14658943e1, 1.14725653e1, 4.60775222e1, 2.15813021e3,
    1.14799458, 1.75596738, 8.40516478e-1, 1.02360374e2, 3.06123432e-1,
    2.378981e-1, 4.90434728e-1, 4.54885361e-1,
  ];
};

const computeScaling = (value: number, index: number): number => {
  const avg = scalerAVG()[index];
  const std = scalerSTD()[index];
  return (value - avg) / std;
};

export default class LoanApproovalModel {
  model: tf.LayersModel | undefined = undefined;
  constructor() {}
  async loadModel() {
    this.model = await tf.loadLayersModel(`model.json`);
  }
  processEducation(education: string) {
    switch (education) {
      case "Bachelor":
        return 1;
      case "Master":
        return 2;
      case "Advanced Degree":
        return 3;
      default:
        return 0;
    }
  }
  processBoolean(value: boolean) {
    return value ? 1 : 0;
  }
  preProcess(input: State) {
    const {
      age,
      experience,
      income,
      zip,
      family,
      ccavg,
      education,
      mortdue,
      securities,
      cdAccount,
      online,
      creditCard,
    } = input;
    const processedInput = [
      4843,
      age,
      experience,
      income / 1000,
      zip as number,
      family,
      ccavg / 1000,
      this.processEducation(education),
      mortdue / 1000,
      this.processBoolean(securities),
      this.processBoolean(cdAccount),
      this.processBoolean(online),
      this.processBoolean(creditCard),
    ];
    // const scaler = new StandardScaler();
    // const expected = scaler.fitTransform(processedInput);
    // return expected.dataSync();
    // console.log("processedInput.map(computeScaling)");
    // console.log(processedInput.map(computeScaling));
    // return [
    //   1.61473131e9, 3.15215032e8, 2.48108804e8, 2.17569569e9, 1.06051854e9,
    //   5.29619225e8, 1.51917401e9, 1.40654259e8, 5.2098112e9, -3.41910013e8,
    //   -2.5314293e8, -1.21796704e9, -6.42897024e8,
    // ];
    return processedInput.map(computeScaling);
  }
  async generateZkInput(input: number[]): Promise<IProofInput> {
    const modelParameters = await fetch("circuit.json").then(function (res) {
      return res.json();
    });

    const circuitInput: IProofInput = {
      ...modelParameters,
      in: [...input].map(
        (v) => +parseInt(parseFloat((v * 10 ** 8).toString()).toString())
      ),
      // in: [
      //   -534055221, -1516303690, -1495180471, -971174906, -952334978,
      //   1400703477, -644875306, -1049090410, 764731694, -341910013, -253142930,
      //   821040280, -642897023,
      // ],
      // in: [
      //   1614731311, 315215031, 248108803, 2175695693, 1060518544, 529619225,
      //   1519174010, 140654258, 5209811197, -341910013, -253142930, -1217967039,
      //   -642897023,
      // ],
    };
    console.log(circuitInput);
    return circuitInput;
  }
  async generateZkProof(input: number[]) {
    const circuitInput = await this.generateZkInput(input);
    console.log("circuitInput");
    console.log(circuitInput);
    const { proof, result } = await calculateProof(circuitInput);
    console.log(
      "The prediction computation has generated the following proof:"
    );
    console.log(proof);
    console.log(`The proof is ${result ? "valid" : "invalid"}`);
    return proof;
  }
  async predict(input: State) {
    console.log("Predicting...");
    if (!this.model) {
      console.log("Model not loaded");
      return;
    }
    const pinput: any = this.preProcess(input);
    console.log("pinput");
    console.log(pinput);
    let number;
    let maxProb = 0;
    const tensor = tf.tensor([pinput]);
    const output = this.model!.predict(tensor) as tf.Tensor;
    const predictions = Array.from(output.dataSync());
    predictions.forEach((prob, num) => {
      if (prob > maxProb) {
        maxProb = prob;
        number = num;
      }
    });
    const proof = await this.generateZkProof(pinput);
    return {
      prediction: number,
      proof: proof,
      predClass: number === 1 ? "Approved" : "Rejected",
    };
  }
}
