<br />
<p align="center">
  <img src="https://duckduckgo.com/i/ddebb07e.png" alt="Corda" width="90">
</p>

### Building the project

```
yarn
yarn hardhat clean
yarn hardhat compile
```

### Running tests
```
yarn hardhat test
```

### Running deploy scripts
```
yarn hardhat run scripts/deploy.js
```

### Running contract verification

```
yarn hardhat verify 
--network mumbai
--show-stack-traces 
<contract_address>
```

### Running test coverage
```
yarn hardhat coverage --testfiles "test/*.ts" 
```