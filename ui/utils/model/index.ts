import * as tf from "@tensorflow/tfjs";
import calculateProof, { IProofInput } from "../proof";
import { State } from "../../hooks/useLoan";

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
  precisionRound(number: number, precision: number) {
    var factor = Math.pow(10, precision);
    return Math.round(number * factor) / factor;
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
    };
    return circuitInput;
  }
  async generateZkProof(input: number[]) {
    const circuitInput = await this.generateZkInput(input);
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
    const preprocessedInput: any = this.preProcess(input);
    const tensor = tf.tensor([preprocessedInput]);
    const output = this.model!.predict(tensor) as tf.Tensor;
    const predictions = Array.from(output.dataSync());
    const { index, maxProb } = predictions.reduce(
      (acc, prob, index) => {
        return acc.maxProb < prob
          ? {
              index,
              maxProb: prob,
            }
          : acc;
      },
      { index: 0, maxProb: 0 }
    );
    const proof = await this.generateZkProof(preprocessedInput);
    const parsedPredictions = predictions.map((v) => this.precisionRound(v, 6));
    return {
      predictions: parsedPredictions,
      score: this.precisionRound(parsedPredictions[1] * 10 ** 6, 0),
      prediction: index,
      proof: proof,
      predClass: index === 1 ? "Approved" : "Rejected",
    };
  }
}
