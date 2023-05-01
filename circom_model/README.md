# get keras2cirom with:

```sh
svn export https://github.com/socathie/keras2circom/trunk/ keras2circom
```

# setup env

```sh
conda env create -f environment.yml
```

# Install circom:

```sh
chmod +x setup-circom.sh && ./setup-circom.sh
```

### install tensorflowjs

```sh
pip install tensorflowjs
```

### Convert Model to tfjs:

```
tensorflowjs_converter --input_format=keras score_model.h5 tensorflow/tfjs
```

### Build the circuit and compile it to wasm:

```
circom ./circom/mnist.circom --wasm --r1cs -o ./circom/build
```

### Execute setup phase during development:

- Get powers tau file:

```shell
wget https://hermez.s3-eu-west-1.amazonaws.com/powersOfTau28_hez_final_20.ptau
```

- Execute setup:

```shell
npx snarkjs groth16 setup ./circom/build/mnist.r1cs powersOfTau28_hez_final_20.ptau mnist.zkey
```

### Move snark assets to the public folder:

- Move wasm binary:

```shell
mv model_circuit/build/circuit_js/circuit.wasm ../ui/public
```

- Move circuit key:

```shell
mv score_model.zkey ../ui/public
```

- Move verification key:

```shell
mv verification_key.json ../ui/public
```

- Move model parameters:

```sh
mv model_circuit/circuit.json ../ui/public
```

### Execute setup phase in production:

**TODO**

### Create the verification key:

```shell
npx snarkjs zkey export verificationkey score_model.zkey verification_key.json
```

### Move model assets to the `public` folder

```shell
mv tensorflow/tfjs/* ../ui/public
```

### Get snarkjs source code:

For recent versions (> v.0.5), `snarkjs.min.js` produces errors detailed [here](https://github.com/iden3/snarkjs/issues/317)

1. Download snarkjs v0.5.0 with:

```shell
wget https://github.com/iden3/snarkjs/archive/refs/tags/v0.5.0.zip
```

2. Unzip it, copy `snarkjs.min.js` v0.5.0 and paste it into `public` folder
