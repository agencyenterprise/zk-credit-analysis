import Link from "next/link";
import { useListen } from "../hooks/useListen";
import { useMetamask } from "../hooks/useMetamask";
import { Loading } from "./Loading";
import "../flow/config";
export default function Wallet() {
  const {
    dispatch,
    state: { status, isMetamaskInstalled, wallet, balance },
  } = useMetamask();
  const listen = useListen();
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
          <a href="/" className="flex items-center">
            <span className="inline-flex w-full font-bold items-center justify-center text-gray-700 hover:text-gray-400 px-5 text-xs lg:text-sm desktop:text-sm  sm:w-auto">
              ZK Credit
            </span>
          </a>
          <div className="flex items-center lg:order-2">
            {showConnectButton && (
              <div className="text-gray-800 dark:text-white focus:ring-4 focus:ring-gray-300 font-medium rounded-lg lg:text-xs md:text-xs xs:text-xs px-4 lg:px-5 py-1 lg:py-2.5 mr-2 animate-pulse">
                <button
                  onClick={handleConnect}
                  className="inline-flex w-full items-center justify-center rounded-md border border-transparent text-green-500 hover:text-green-300 px-5 text-xs lg:text-sm desktop:text-sm  sm:w-auto"
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
              <div className="text-gray-800 dark:text-white focus:ring-4 focus:ring-gray-300 font-medium rounded-lg lg:text-xs md:text-xs xs:text-xs px-4 lg:px-5 py-1 lg:py-2.5 mr-2">
                <button
                  onClick={handleDisconnect}
                  className="inline-flex w-full items-center justify-center rounded-md border border-transparent text-green-500 hover:text-green-300 px-5 text-xs lg:text-sm desktop:text-sm  sm:w-auto"
                >
                  {status === "loading" ? (
                    <Loading />
                  ) : (
                    "Disconnet Matamask Wallet"
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
