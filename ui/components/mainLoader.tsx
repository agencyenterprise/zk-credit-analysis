import { ClimbingBoxLoader } from "react-spinners";

export default (props: any) => {
  const { isLoading } = props;
  return (
    <>
      {isLoading && (
        <div className="fixed w-full h-full z-50 top-0 bottom-0 bg-slate-50 opacity-90">
          <div className="flex flex-col items-center justify-center h-full opacity-100">
            <ClimbingBoxLoader color="#36d7b7" />
            <p className="text-2xl text-slate-500 font-bold">
              Computing your loan eligibility request...
            </p>
          </div>
        </div>
      )}
    </>
  );
};
