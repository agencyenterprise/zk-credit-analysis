 import Score from "../contracts/Score.cdc"

transaction(proof: [String], score: UFix64) {
    let address: Address
    prepare(currentUser: AuthAccount) {
        self.address = currentUser.address
        if !Score.check(self.address) {
            currentUser.save(<- Score.new(), to: Score.privatePath)
            currentUser.link<&Score.Base{Score.Public}>(Score.publicPath, target: Score.privatePath)
        }
        currentUser
          .borrow<&{Score.Owner}>(from: Score.privatePath)!.setLoanData(proof, score)
    }
    post {
    Score.check(self.address): "Account was not initialized"
    }
}