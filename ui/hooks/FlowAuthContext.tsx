import * as fcl from "@onflow/fcl";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useTransaction } from "./TransactionContext";
import { toast } from "react-toastify";

export const AuthContext = createContext({});

export const useAuth = () => useContext<any>(AuthContext);

export default function AuthProvider({ children }: any) {
  const { initTransactionState, setTxId, setTransactionStatus } =
    useTransaction();
  const [currentUser, setUser] = useState({ loggedIn: false, addr: undefined });
  const [userProfile, setProfile] = useState(null);
  const [profileExists, setProfileExists] = useState(false);

  useEffect(() => fcl.currentUser.subscribe(setUser), []);

  const logOut = async () => {
    await fcl.unauthenticate();
    setUser({ addr: undefined, loggedIn: false });
    setProfile(null);
    setProfileExists(false);
  };

  const logIn = () => {
    fcl.logIn();
  };

  const signUp = () => {
    fcl.signUp();
  };
  const sleep = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };
  const success = async (msg: any) => {
    toast.success(msg, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

    await sleep(3000);
  };
  const error = async (msg: any) => {
    toast.error(msg, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
    await sleep(3000);
  };
  const makeLoanRequest = async (proofs: string[], score: number) => {
    initTransactionState();
    console.log(score);
    const transactionId = await fcl.mutate({
      cadence: `
      import Score from 0xScoreContract

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
        `,
      payer: fcl.authz,
      proposer: fcl.authz,
      authorizations: [fcl.authz],
      args: (arg: any, t: any) => [
        arg(proofs, t.Array(t.String)),
        arg(score, t.UFix64),
      ],
      limit: 1000,
    });
    setTxId(transactionId);
    fcl.tx(transactionId).subscribe(async (res: any) => {
      setTransactionStatus(res.status);
      console.log("transaction data");
      console.log(res);
      if (!res.errorMessage) {
        await success(
          <div className="flex flex-col">
            <p className="text-sm">You are approved for a loan!</p>
            <p className="text-xs">We will contat you in a few weeks!</p>
          </div>
        );
      } else {
        await error(
          "Something went wrong when saving your score in the contract. Please try again later!"
        );
      }
    });
  };
  const getFlowBalance = async () => {
    const cadence = `
      import FlowToken from 0xFLOW
      import FungibleToken from 0xFT
  
      pub fun main(address: Address): UFix64 {
        let account = getAccount(address)
  
        let vaultRef = account.getCapability(/public/flowTokenBalance)
          .borrow<&FlowToken.Vault{FungibleToken.Balance}>()
          ?? panic("Could not borrow Balance reference to the Vault")
  
        return vaultRef.balance
      }
    `;
    const args = (arg: any, t: any) => [arg(currentUser.addr, t.Address)];
    const balance = await fcl.query({ cadence, args });
    return balance;
  };

  const value = {
    currentUser,
    userProfile,
    profileExists,
    logOut,
    logIn,
    signUp,
    makeLoanRequest,
    getFlowBalance,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
