import Score from "../contracts/Score.cdc";

pub fun main(address: Address): Score.ReadOnly? {
    return Score.read(address)
}