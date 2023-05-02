import Link from "next/link";
import { useListen } from "../hooks/useListen";
import { useMetamask } from "../hooks/useMetamask";
import { Loading } from "./Loading";
import "../flow/config";
import { useAuth } from "../hooks/FlowAuthContext";
export default function Wallet() {
  const {
    dispatch,
    state: { status, isMetamaskInstalled, wallet, balance },
  } = useMetamask();
  const listen = useListen();
  const { currentUser, logOut, logIn, makeLoanRequest } = useAuth();
  const showInstallMetamask =
    status !== "pageNotLoaded" && !isMetamaskInstalled;
  const showConnectButton =
    status !== "pageNotLoaded" && isMetamaskInstalled && !wallet;

  const isConnected = status !== "pageNotLoaded" && typeof wallet === "string";

  const handleConnect = async () => {
    dispatch({ type: "loading" });
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    if (accounts.length > 0) {
      const balance = await window.ethereum!.request({
        method: "eth_getBalance",
        params: [accounts[0], "latest"],
      });
      dispatch({ type: "connect", wallet: accounts[0], balance });

      // we can register an event listener for changes to the users wallet
      listen();
    }
  };

  const handleDisconnect = () => {
    dispatch({ type: "disconnect" });
  };

  return (
    <header>
      <nav className="bg-transparent border-gray-200 px-4 lg:px-6 py-2.5 fixed top-0 w-full">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
          <a href="" className="flex items-center">
            <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
              ZK Credit
            </span>
          </a>
          <div className="flex items-center lg:order-2">
            {showConnectButton && (
              <div className="text-gray-800 dark:text-white focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-1 lg:py-2.5 mr-2">
                <button
                  onClick={handleConnect}
                  className="inline-flex w-full items-center justify-center rounded-md border border-transparent text-gray-700 hover:text-gray-400 px-5 text-sm font-medium  sm:w-auto"
                >
                  {status === "loading" ? (
                    <Loading />
                  ) : (
                    "Connect Metamask Wallet"
                  )}
                </button>
              </div>
            )}
            {isConnected && (
              <div className="text-gray-800 dark:text-white focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-1 lg:py-2.5 mr-2">
                <button
                  onClick={handleDisconnect}
                  className="inline-flex w-full items-center justify-center rounded-md border border-transparent text-gray-700 hover:text-gray-400 px-5 text-sm font-medium  sm:w-auto"
                >
                  {status === "loading" ? (
                    <Loading />
                  ) : (
                    "Disconnet Matamask Wallet"
                  )}
                </button>
              </div>
            )}
            {!currentUser?.addr && (
              <div className="text-gray-800 dark:text-white focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-1 lg:py-2.5 mr-2">
                <button
                  onClick={logIn}
                  className="inline-flex w-full items-center justify-center rounded-md border border-transparent text-gray-700 hover:text-gray-400 px-5 text-sm font-medium  sm:w-auto"
                >
                  {status === "loading" ? <Loading /> : "Connect Flow Wallet"}
                </button>
              </div>
            )}
            {currentUser?.addr && (
              <div className="text-gray-800 dark:text-white focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-1 lg:py-2.5 mr-2">
                <button
                  onClick={logOut}
                  className="inline-flex w-full items-center justify-center rounded-md border border-transparent text-gray-700 hover:text-gray-400 px-5 text-sm font-medium  sm:w-auto"
                >
                  {status === "loading" ? (
                    <Loading />
                  ) : (
                    "Disconnect Flow Wallet"
                  )}
                </button>
              </div>
            )}
            <button
              data-collapse-toggle="mobile-menu-2"
              type="button"
              className="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              aria-controls="mobile-menu-2"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <svg
                className="hidden w-6 h-6"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}
