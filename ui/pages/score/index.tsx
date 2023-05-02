import { useState } from "react"
import { ethers } from "ethers"
import Box from "@mui/material/Box"
import Stepper from "@mui/material/Stepper"
import Step from "@mui/material/Step"
import StepLabel from "@mui/material/StepLabel"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import ctaStyle from "../../components/cta.module.css"
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid'
import ZkCreditScore from '../../public/ZkCreditScore.json'

const columns: GridColDef[] = [
  { field: 'date', headerName: 'Date', width: 70 },
  { field: 'proof1', headerName: 'Proof 1', width: 130 },
  { field: 'proof2', headerName: 'Proof 2', width: 130 },
  { field: 'proof2', headerName: 'Proof 3', width: 130 },
  { field: 'score', headerName: 'Score', width: 130 },
];
const MyScoresPage = ({ allLoanRequests }: { allLoanRequests: any }) => {

  const getRows = () => {
    const userLoanRequests = JSON.parse(allLoanRequests).filter((loanRequest: any) => {
      if (loanRequest[0] === '0xF05109075B8D4B4786313D5acdB999e6Fbfb482C') return true
      return false
    })
    
    const rows = userLoanRequests.map((loanRequest: any, i: number) => {
      console.log({loanRequest})
      return {
        id: i,
        date: "x",
        proof1: loanRequest[1][1],
        proof2: loanRequest[1][2],
        proof3: loanRequest[1][0],
        score: ethers.BigNumber.from(loanRequest[2]).toString(),
      }
    })

    return rows
  }

  return (
    <>
      <div className={`flex justify-center pt-10 pb-10 container mx-auto min-h-screen ${ctaStyle.form}`}>
        <div className="relative z-10 bg-white px-5 flex justify-center shadow-lg pt-5 rounded-lg">
          <Box sx={{ width: "100%", paddingBottom: '75px' }}>
            <Typography sx={{ mt: 2, mb: 1 }}>Your Scores</Typography>
            <DataGrid
              rows={getRows()}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 5 },
                },
              }}
            />
          </Box>
        </div>
      </div>
    </>
  )
};

export async function getStaticProps() {
  const alchemyApiKey = process.env.ALCHEMY_API_KEY
  const zkCreditScoreContractAddress = process.env.NEXT_PUBLIC_ZK_CREDIT_SCORE_CONTRACT_ADDRESS as string
  const provider = new ethers.providers.JsonRpcProvider(`https://polygon-mumbai.g.alchemy.com/v2/${alchemyApiKey}`)

  const zkCreditScoreContract = new ethers.Contract(zkCreditScoreContractAddress, ZkCreditScore.abi, provider);

  const allLoanRequests = await zkCreditScoreContract.getLoanRequests()

  return {
    props: {
      allLoanRequests: JSON.stringify(allLoanRequests)
    },
  };
}

export default MyScoresPage;
