import { type FC } from "react";
import { useMetamask } from "../hooks/useMetamask";

export const CTA: FC = () => {
  const { dispatch, state } = useMetamask();
  return (
    <div className="flex justify-center flex-col pt-20 w-full">
      <p className="font-bold text-3xl text-center text-gray-700 break-words lg:px-32 pt-7">
        Connecting Financial Institutions and WEB 3 consumers thru a ZK Credit
        Score
      </p>
      {state.wallet && (
        <div className="flex justify-center py-10 flex-row space-x-3">
          <a
            className="hover:opacity-50 text-gray-700 underline text-xl"
            href="/loan"
          >
            Request a Loan
          </a>
          <a
            className="hover:opacity-50 text-gray-700 underline text-xl"
            href="/score"
          >
            View my score
          </a>
        </div>
      )}
    </div>
  );
};
