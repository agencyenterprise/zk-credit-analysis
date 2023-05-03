import { type FC } from "react";
import { useMetamask } from "../hooks/useMetamask";
import Link from "next/link";
export const CTA: FC = () => {
  const { state } = useMetamask();
  return (
    <div className="flex justify-center flex-col pt-20 w-full">
      <p className="font-bold text-3xl text-center text-gray-700 break-words lg:px-32 pt-7">
        Connecting Financial Institutions and WEB 3 consumers thru a ZK Credit
        Score
      </p>
      {state.wallet ? (
        <div className="flex justify-center py-10 flex-row space-x-3">
          <Link
            className="hover:opacity-50 text-gray-700 underline text-xl animate-pulse"
            href="/loan"
          >
            Request a Loan
          </Link>
          <Link
            className="hover:opacity-50 text-gray-700 underline text-xl animate-pulse"
            href="/score"
          >
            View my score
          </Link>
        </div>
      ) : (
        <div className="flex flex-col justify-center py-10  space-x-3 black">
          <p className="font-bold text-xl text-center text-gray-800 break-words lg:px-32 pt-7">
            First, connect your polygon wallet (MUMBAI).
          </p>
          <p className="font-bold text-xl text-center text-gray-800 break-words lg:px-32 pt-2">
            Its important that you have balance and used your wallet in the last
            few weeks.
          </p>
        </div>
      )}
    </div>
  );
};
