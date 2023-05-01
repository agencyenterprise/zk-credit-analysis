declare global {
  interface Window {
    snarkjs: any;
  }
}

export interface IProofInput {
  in: number[];
  dense_weights: number[];
  dense_bias: number[];
  dense_1_weights: number[];
  dense_1_bias: number[];
  dense_2_weights: number[];
  dense_2_bias: number[];
  dense_3_weights: number[];
  dense_3_bias: number[];
  dense_4_weights: number[];
  dense_4_bias: number[];
  dense_5_weights: number[];
  dense_5_bias: number[];
}

export default async function calculateProof(input: IProofInput) {
  console.log(input);
  // eslint-disable-next-line no-undef
  const { proof, publicSignals } = await window.snarkjs.groth16.fullProve(
    input,
    "circuit.wasm",
    "score_model.zkey"
  );

  const vkey = await fetch("verification_key.json").then(function (res) {
    return res.json();
  });

  const isValid = await window.snarkjs.groth16.verify(
    vkey,
    publicSignals,
    proof
  );
  return {
    proof: JSON.stringify(proof, null, 1),
    result: JSON.stringify(isValid, null, 1),
  };
}
