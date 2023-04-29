#!/bin/bash

zokrates compile -i ./balance.zok -o balance --r1cs snarkjs/balance.r1cs --verbose
zokrates setup -i balance -b ark -s g16

