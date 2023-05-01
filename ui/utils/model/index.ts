import * as tf from "@tensorflow/tfjs";
import calculateProof, { IProofInput } from "../proof";
import { State } from "../../hooks/useLoan";
import { StandardScaler, setBackend } from "scikitjs";
setBackend(tf);
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
      [5001],
      [age],
      [experience],
      [income / 1000],
      [zip as number],
      [family],
      [ccavg],
      [this.processEducation(education)],
      [mortdue],
      [this.processBoolean(securities)],
      [this.processBoolean(cdAccount)],
      [this.processBoolean(online)],
      [this.processBoolean(creditCard)],
    ];
    const scaler = new StandardScaler();
    const expected = scaler.fitTransform(processedInput);
    return expected.dataSync();
  }
  async generateZkInput(input: number[]): Promise<IProofInput> {
    console.log("input");
    console.log(input);
    const modelParameters = await fetch("circuit.json").then(function (res) {
      return res.json();
    });

    const circuitInput: IProofInput = {
      ...modelParameters,
      in: [...input].map((v) => Math.round(v * 10 ** 9)),
    };
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
