const chai = require("chai");
const path = require("path");

const wasm_tester = require("circom_tester").wasm;

const F1Field = require("ffjavascript").F1Field;
const Scalar = require("ffjavascript").Scalar;

// Prime used to perform finite field operations.
exports.p = Scalar.fromString(
  "21888242871839275222246405745257275088548364400416034343698204186575808495617"
);
const Fr = new F1Field(exports.p);

const assert = chai.assert;

const model_io = require("../score_model_io.json");
const parameters = require("../model_circuit/circuit.json");
describe("loan approval test", function () {
  this.timeout(100000000);

  it("should return correct output", async () => {
    const circuit = await wasm_tester(
      path.join(__dirname, "..", "model_circuit", "circuit.circom")
    );
    await circuit.loadConstraints();
    assert.equal(circuit.nVars, 2411271);
    //assert.equal(circuit.constraints.length, 364883);
    const dense_weights = [];
    const dense_bias = [];
    const dense_1_weights = [];
    const dense_1_bias = [];
    const dense_2_weights = [];
    const dense_2_bias = [];
    const dense_3_weights = [];
    const dense_3_bias = [];
    const dense_4_weights = [];
    const dense_4_bias = [];
    const dense_5_weights = [];
    const dense_5_bias = [];
    for (var i = 0; i < parameters.dense_weights.length; i++) {
      dense_weights.push(Fr.e(parameters.dense_weights[i]));
    }
    for (var i = 0; i < parameters.dense_bias.length; i++) {
      dense_bias.push(Fr.e(parameters.dense_bias[i]));
    }
    for (var i = 0; i < parameters.dense_1_weights.length; i++) {
      dense_1_weights.push(Fr.e(parameters.dense_1_weights[i]));
    }
    for (var i = 0; i < parameters.dense_1_bias.length; i++) {
      dense_1_bias.push(Fr.e(parameters.dense_1_bias[i]));
    }
    for (var i = 0; i < parameters.dense_2_weights.length; i++) {
      dense_2_weights.push(Fr.e(parameters.dense_2_weights[i]));
    }
    for (var i = 0; i < parameters.dense_2_bias.length; i++) {
      dense_2_bias.push(Fr.e(parameters.dense_2_bias[i]));
    }
    for (var i = 0; i < parameters.dense_3_weights.length; i++) {
      dense_3_weights.push(Fr.e(parameters.dense_3_weights[i]));
    }
    for (var i = 0; i < parameters.dense_3_bias.length; i++) {
      dense_3_bias.push(Fr.e(parameters.dense_3_bias[i]));
    }
    for (var i = 0; i < parameters.dense_4_weights.length; i++) {
      dense_4_weights.push(Fr.e(parameters.dense_4_weights[i]));
    }
    for (var i = 0; i < parameters.dense_4_bias.length; i++) {
      dense_4_bias.push(Fr.e(parameters.dense_4_bias[i]));
    }
    for (var i = 0; i < parameters.dense_5_weights.length; i++) {
      dense_5_weights.push(Fr.e(parameters.dense_5_weights[i]));
    }
    for (var i = 0; i < parameters.dense_5_bias.length; i++) {
      dense_5_bias.push(Fr.e(parameters.dense_5_bias[i]));
    }
    const INPUT = {
      in: model_io.input,
      dense_weights: dense_weights,
      dense_bias: dense_bias,
      dense_1_weights: dense_1_weights,
      dense_1_bias: dense_1_bias,
      dense_2_weights: dense_2_weights,
      dense_2_bias: dense_2_bias,
      dense_3_weights: dense_3_weights,
      dense_3_bias: dense_3_bias,
      dense_4_weights: dense_4_weights,
      dense_4_bias: dense_4_bias,
      dense_5_weights: dense_5_weights,
      dense_5_bias: dense_5_bias,
    };
    const witness = await circuit.calculateWitness(INPUT, true);
    const output = model_io.out;
    const output_class = output[0] > output[1] ? 0 : 1;
    assert(Fr.eq(Fr.e(witness[0]), Fr.e(1)));
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(1)));
    assert(Fr.eq(Fr.e(output_class), Fr.e(1)));
  });
});
