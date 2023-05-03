zokrates compile --debug -i balance.zok \
&& zokrates setup \
&& zokrates compute-witness -a 1000 1000 1000 1000 100 \
&& zokrates generate-proof \
&& zokrates export-verifier \
&& zokrates verify \