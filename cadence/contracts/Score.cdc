pub contract Score {
  pub let publicPath: PublicPath
  pub let privatePath: StoragePath
  pub struct LoanRequest {
    pub let proof: [String]
    pub let score: UFix64
    init(proof: [String], score: UFix64) {
      self.proof = proof
      self.score = score
    }
  }
  pub resource interface Public {
    pub fun getLoanData(): {UInt64: LoanRequest}
    pub fun asReadOnly(): Score.ReadOnly
  }

  pub resource interface Owner {

    pub fun setLoanData(_ proof: [String], _ score: UFix64) {
      pre {
        proof.length > 0: "Proof must be a non-empty string."
        score >= 0.0: "Score must be a positive number."
      }
    }
  }

  pub resource Base: Owner, Public {
    access(self) var loanData: {UInt64: LoanRequest}
    access(self) var index: UInt64
    init() {
      self.loanData = {}
      self.index = 0
    }

    pub fun getLoanData(): {UInt64: LoanRequest} { return self.loanData }


    pub fun setLoanData(_ proof: [String], _ score: UFix64) {
      self.loanData[self.index] = LoanRequest(proof: proof, score: score)
      self.index = self.index + 1
    }

    pub fun asReadOnly(): Score.ReadOnly {
      return Score.ReadOnly(
        address: self.owner?.address,
        loanData: self.getLoanData()
      )
    }
  }

  pub struct ReadOnly {
    pub let address: Address?
    pub let loanData: {UInt64: LoanRequest}

    init(address: Address?, loanData: {UInt64: LoanRequest}) {
      self.address = address
      self.loanData = loanData
    }
  }

  pub fun new(): @Score.Base {
    return <- create Base()
  }

  pub fun check(_ address: Address): Bool {
    return getAccount(address)
      .getCapability<&{Score.Public}>(Score.publicPath)
      .check()
  }

  pub fun fetch(_ address: Address): &{Score.Public} {
    return getAccount(address)
      .getCapability<&{Score.Public}>(Score.publicPath)
      .borrow()!
  }

  pub fun read(_ address: Address): Score.ReadOnly? {
    if let profile = getAccount(address).getCapability<&{Score.Public}>(Score.publicPath).borrow() {
      return profile.asReadOnly()
    } else {
      return nil
    }
  }

  pub fun readMultiple(_ addresses: [Address]): {Address: Score.ReadOnly} {
    let profiles: {Address: Score.ReadOnly} = {}
    for address in addresses {
      let profile = Score.read(address)
      if profile != nil {
        profiles[address] = profile!
      }
    }
    return profiles
  }


  init() {
    self.publicPath = /public/profile
    self.privatePath = /storage/profile

    self.account.save(<- self.new(), to: self.privatePath)
    self.account.link<&Base{Public}>(self.publicPath, target: self.privatePath)

  }
}
 