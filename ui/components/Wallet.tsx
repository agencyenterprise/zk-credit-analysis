import Link from "next/link";
import { useListen } from "../hooks/useListen";
import { useMetamask } from "../hooks/useMetamask";
import { Loading } from "./Loading";

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
    console.log("kjkjkj");
    dispatch({ type: "disconnect" });
  };

  const handleAddUsdc = async () => {
    dispatch({ type: "loading" });

    await window.ethereum.request({
      method: "wallet_watchAsset",
      params: {
        type: "ERC20",
        options: {
          address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
          symbol: "USDC",
          decimals: 18,
          image: "https://cryptologos.cc/logos/usd-coin-usdc-logo.svg?v=023",
        },
      },
    });
    dispatch({ type: "idle" });
  };
  const OldHeader = () => {
    return (
      <div className="bg-truffle">
        <div className="mx-auto max-w-2xl py-16 px-4 text-center sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            <span className="block">Metamask API intro</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-white">
            Follow along with the{" "}
            <Link
              href="https://github.com/GuiBibeau/web3-unleashed-demo"
              target="_blank"
            >
              <span className="underline cursor-pointer">Repo</span>
            </Link>{" "}
            in order to learn how to use the Metamask API.
          </p>

          {showConnectButton && (
            <button
              onClick={handleConnect}
              className="mt-8 inline-flex w-full items-center justify-center rounded-md border border-transparent bg-ganache text-white px-5 py-3 text-base font-medium  sm:w-auto"
            >
              {status === "loading" ? <Loading /> : "Connect Wallet"}
            </button>
          )}

          {showInstallMetamask && (
            <Link
              href="https://metamask.io/"
              target="_blank"
              className="mt-8 inline-flex w-full items-center justify-center rounded-md border border-transparent bg-ganache text-white px-5 py-3 text-base font-medium  sm:w-auto"
            >
              Install Metamask
            </Link>
          )}

          {isConnected && (
            <div className="flex  w-full justify-center space-x-2">
              <button
                onClick={handleAddUsdc}
                className="mt-8 inline-flex w-full items-center justify-center rounded-md border border-transparent bg-ganache text-white px-5 py-3 text-base font-medium  sm:w-auto"
              >
                {status === "loading" ? <Loading /> : "Add Token"}
              </button>
              <button
                onClick={handleDisconnect}
                className="mt-8 inline-flex w-full items-center justify-center rounded-md border border-transparent bg-ganache text-white px-5 py-3 text-base font-medium  sm:w-auto"
              >
                Disconnect
              </button>
            </div>
          )}
        </div>
      </div>
    );
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
                  className="inline-flex w-full items-center justify-center rounded-md border border-transparent text-gray-700 hover:text-gray-400 px-5 text-base font-medium  sm:w-auto"
                >
                  {status === "loading" ? <Loading /> : "Connect Wallet"}
                </button>
              </div>
            )}
            {isConnected && (
              <div className="text-gray-800 dark:text-white focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-1 lg:py-2.5 mr-2">
                <button
                  onClick={handleDisconnect}
                  className="inline-flex w-full items-center justify-center rounded-md border border-transparent text-gray-700 hover:text-gray-400 px-5 text-base font-medium  sm:w-auto"
                >
                  {status === "loading" ? <Loading /> : "Disconnet Wallet"}
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
          {/* <div
            className="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1"
            id="mobile-menu-2"
          >
            <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
              <li>
                <a
                  href="#"
                  className="block py-2 pr-4 pl-3 text-black rounded bg-primary-700 lg:bg-transparent lg:text-primary-700 lg:p-0 dark:text-white"
                  aria-current="page"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"
                >
                  Team
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div> */}
        </div>
      </nav>
    </header>
  );
}
