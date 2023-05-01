pragma circom 2.0.0;

include "../node_modules/circomlib-ml/circuits/Dense.circom";
include "../node_modules/circomlib-ml/circuits/ArgMax.circom";
include "../node_modules/circomlib-ml/circuits/ReLU.circom";

template Model() {
signal input in[13];
signal input dense_weights[13][250];
signal input dense_bias[250];
signal input dense_1_weights[250][500];
signal input dense_1_bias[500];
signal input dense_2_weights[500][500];
signal input dense_2_bias[500];
signal input dense_3_weights[500][500];
signal input dense_3_bias[500];
signal input dense_4_weights[500][250];
signal input dense_4_bias[250];
signal input dense_5_weights[250][2];
signal input dense_5_bias[2];
signal output out[1];

component dense = Dense(13, 250);
component dense_re_lu[250];
for (var i0 = 0; i0 < 250; i0++) {
    dense_re_lu[i0] = ReLU();
}
component dense_1 = Dense(250, 500);
component dense_1_re_lu[500];
for (var i0 = 0; i0 < 500; i0++) {
    dense_1_re_lu[i0] = ReLU();
}
component dense_2 = Dense(500, 500);
component dense_2_re_lu[500];
for (var i0 = 0; i0 < 500; i0++) {
    dense_2_re_lu[i0] = ReLU();
}
component dense_3 = Dense(500, 500);
component dense_3_re_lu[500];
for (var i0 = 0; i0 < 500; i0++) {
    dense_3_re_lu[i0] = ReLU();
}
component dense_4 = Dense(500, 250);
component dense_5 = Dense(250, 2);
component dense_5_softmax = ArgMax(2);

for (var i0 = 0; i0 < 13; i0++) {
    dense.in[i0] <== in[i0];
}
for (var i0 = 0; i0 < 13; i0++) {
    for (var i1 = 0; i1 < 250; i1++) {
        dense.weights[i0][i1] <== dense_weights[i0][i1];
}}
for (var i0 = 0; i0 < 250; i0++) {
    dense.bias[i0] <== dense_bias[i0];
}
for (var i0 = 0; i0 < 250; i0++) {
    dense_re_lu[i0].in <== dense.out[i0];
}
for (var i0 = 0; i0 < 250; i0++) {
    dense_1.in[i0] <== dense_re_lu[i0].out;
}
for (var i0 = 0; i0 < 250; i0++) {
    for (var i1 = 0; i1 < 500; i1++) {
        dense_1.weights[i0][i1] <== dense_1_weights[i0][i1];
}}
for (var i0 = 0; i0 < 500; i0++) {
    dense_1.bias[i0] <== dense_1_bias[i0];
}
for (var i0 = 0; i0 < 500; i0++) {
    dense_1_re_lu[i0].in <== dense_1.out[i0];
}
for (var i0 = 0; i0 < 500; i0++) {
    dense_2.in[i0] <== dense_1_re_lu[i0].out;
}
for (var i0 = 0; i0 < 500; i0++) {
    for (var i1 = 0; i1 < 500; i1++) {
        dense_2.weights[i0][i1] <== dense_2_weights[i0][i1];
}}
for (var i0 = 0; i0 < 500; i0++) {
    dense_2.bias[i0] <== dense_2_bias[i0];
}
for (var i0 = 0; i0 < 500; i0++) {
    dense_2_re_lu[i0].in <== dense_2.out[i0];
}
for (var i0 = 0; i0 < 500; i0++) {
    dense_3.in[i0] <== dense_2_re_lu[i0].out;
}
for (var i0 = 0; i0 < 500; i0++) {
    for (var i1 = 0; i1 < 500; i1++) {
        dense_3.weights[i0][i1] <== dense_3_weights[i0][i1];
}}
for (var i0 = 0; i0 < 500; i0++) {
    dense_3.bias[i0] <== dense_3_bias[i0];
}
for (var i0 = 0; i0 < 500; i0++) {
    dense_3_re_lu[i0].in <== dense_3.out[i0];
}
for (var i0 = 0; i0 < 500; i0++) {
    dense_4.in[i0] <== dense_3_re_lu[i0].out;
}
for (var i0 = 0; i0 < 500; i0++) {
    for (var i1 = 0; i1 < 250; i1++) {
        dense_4.weights[i0][i1] <== dense_4_weights[i0][i1];
}}
for (var i0 = 0; i0 < 250; i0++) {
    dense_4.bias[i0] <== dense_4_bias[i0];
}
for (var i0 = 0; i0 < 250; i0++) {
    dense_5.in[i0] <== dense_4.out[i0];
}
for (var i0 = 0; i0 < 250; i0++) {
    for (var i1 = 0; i1 < 2; i1++) {
        dense_5.weights[i0][i1] <== dense_5_weights[i0][i1];
}}
for (var i0 = 0; i0 < 2; i0++) {
    dense_5.bias[i0] <== dense_5_bias[i0];
}
for (var i0 = 0; i0 < 2; i0++) {
    dense_5_softmax.in[i0] <== dense_5.out[i0];
}
out[0] <== dense_5_softmax.out;

}

component main = Model();
