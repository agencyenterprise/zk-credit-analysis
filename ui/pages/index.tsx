import TitleAndInput from "@components/TitleAndInput";
import { useState } from "react";

export default function Home() {
  const [loan, setLoan] = useState<number>(0)
  const [mortdue, setMortdue] = useState<number>(0)
  const [value, setValue] = useState<number>(0)
  const [reason, setReason] = useState<string>("")
  const [job, setJob] = useState<string>("")
  const [yoj, setYoj] = useState<number>(0)
  const [derog, setDerog] = useState<number>(0)
  const [delinq, setDelinq] = useState<number>(0)
  const [clage, setClage] = useState<number>(0)
  const [ninq, setNinq] = useState<number>(0)
  const [clno, setClno] = useState<number>(0)
  const [debtinc, setDebtinc] = useState<number>(0)

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <TitleAndInput
        title="Amount of the loan request"
        value={loan}
        setValue={setLoan}
        placeholder={"0"}
        onlyNumber
        suffix="USD"
      />
      <TitleAndInput
        title="Amount due on existing mortgage"
        value={mortdue}
        setValue={setMortdue}
        placeholder={"0"}
        onlyNumber
        suffix="USD"
      />
      <TitleAndInput
        title="Value of current property"
        value={value}
        setValue={setValue}
        placeholder={"0"}
        onlyNumber
        suffix="USD"
      />
      {/* <TitleAndInput
        title="Reason for loan"
        value={reason}
        setValue={setReason}
        placeholder={""}
        onlyNumber
      />
      <TitleAndInput
        title="Job category"
        value={job}
        setValue={setJob}
        placeholder={""}
        onlyNumber
      /> */}
      <TitleAndInput
        title="YOJ"
        description="Numbers of years on your current job"
        value={yoj}
        setValue={setYoj}
        placeholder={"0"}
        onlyNumber
        suffix="Years"
      />
      <TitleAndInput
        title="Number of major derogatory reports"
        value={derog}
        setValue={setDerog}
        placeholder={"0"}
        onlyNumber
      />
      <TitleAndInput
        title="Number of delinquent credit lines"
        value={delinq}
        setValue={setDelinq}
        placeholder={"0"}
        onlyNumber
      />
      <TitleAndInput
        title="Age of oldest trade line in months"
        value={clage}
        setValue={setClage}
        placeholder={"0"}
        onlyNumber
        suffix="USD"
      />
      <TitleAndInput
        title="Number of recent credit lines"
        value={ninq}
        setValue={setNinq}
        placeholder={"0"}
        onlyNumber
      />
      <TitleAndInput
        title="Number of credit lines"
        value={clno}
        setValue={setClno}
        placeholder={"0"}
        onlyNumber
      />
      <TitleAndInput
        title="Debt-to-income ratio"
        value={debtinc}
        setValue={setDebtinc}
        placeholder={"0"}
        onlyNumber
      />
    </main>
  )
}
