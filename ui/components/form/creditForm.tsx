import React from "react";
import ReactDOM from "react-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useLoan } from "../../hooks/useLoan";
import { Box } from "@mui/material";
const validationSchema = yup.object({
  derog: yup
    .number()
    .min(0, "Number of derogatory remarks should be at least 0")
    .required("Number of derogatory remarks is required"),
  delinq: yup
    .number()
    .min(0, "Number of delinquent payments should be at least 0")
    .required("Number of delinquent payments is required"),
  clage: yup
    .number()
    .min(0, "Oldest credit line should at least 0")
    .required("Oldest credit line is required"),
  ninq: yup
    .number()
    .min(0, "Credit lines opened in the last 6 months should be at least 0")
    .required("Credit lines opened in the last 6 months is required"),
  clno: yup
    .number()
    .min(0, "Number of credit lines should be greater than 1000 USD")
    .required("Number of credit lines is required"),
  debtinc: yup
    .number()
    .min(0, "Debt-to-income ratio should be at least 0")
    .required("Debt-to-income ratio lines is required"),
});

export default function CreditForm(props: any) {
  const { dispatch, state } = useLoan();
  const { nextPage, prevPage, activeStep, steps } = props;
  const formik = useFormik({
    initialValues: {
      derog: state.derog !== undefined ? state.derog : undefined,
      delinq: state.delinq !== undefined ? state.delinq : undefined,
      clage: state.clage !== undefined ? state.clage : undefined,
      ninq: state.ninq !== undefined ? state.ninq : undefined,
      clno: state.clno !== undefined ? state.clno : undefined,
      debtinc: state.debtinc !== undefined ? state.debtinc : undefined,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const { derog, delinq, clage, ninq, clno, debtinc } = values;
      dispatch({
        type: "credit",
        derog: derog as number,
        delinq: delinq as number,
        clage: clage as number,
        ninq: ninq as number,
        clno: clno as number,
        debtinc: debtinc as number,
      });
      nextPage();
    },
  });

  return (
    <form className="h-full" onSubmit={formik.handleSubmit}>
      <div className="flex flex-col space-y-10 justify-between  max-w-[600px] pt-10 h-full">
        <div className="flex flex-col space-y-5 min-h-[650px] w-full">
          <TextField
            fullWidth
            id="derog"
            name="derog"
            label="Number of derogatory remarks"
            type="number"
            value={formik.values.derog}
            onChange={formik.handleChange}
            error={formik.touched.derog && Boolean(formik.errors.derog)}
            helperText={formik.touched.derog && formik.errors.derog}
          />
          <TextField
            fullWidth
            id="delinq"
            name="delinq"
            label="Number of delinquent payments"
            type="number"
            value={formik.values.delinq}
            onChange={formik.handleChange}
            error={formik.touched.delinq && Boolean(formik.errors.delinq)}
            helperText={formik.touched.delinq && formik.errors.delinq}
          />
          <TextField
            fullWidth
            id="clage"
            name="clage"
            label="Oldest credit line (Months)"
            type="number"
            value={formik.values.clage}
            onChange={formik.handleChange}
            error={formik.touched.clage && Boolean(formik.errors.clage)}
            helperText={formik.touched.clage && formik.errors.clage}
          />
          <TextField
            fullWidth
            id="ninq"
            name="ninq"
            label="Credit lines opened in the last 6 months"
            type="number"
            value={formik.values.ninq}
            onChange={formik.handleChange}
            error={formik.touched.ninq && Boolean(formik.errors.ninq)}
            helperText={formik.touched.ninq && formik.errors.ninq}
          />
          <TextField
            fullWidth
            id="clno"
            name="clno"
            label="Number of credit lines"
            type="number"
            value={formik.values.clno}
            onChange={formik.handleChange}
            error={formik.touched.clno && Boolean(formik.errors.clno)}
            helperText={formik.touched.clno && formik.errors.clno}
          />
          <TextField
            fullWidth
            id="debtinc"
            name="debtinc"
            label="Debt-to-income ratio"
            type="number"
            value={formik.values.debtinc}
            onChange={formik.handleChange}
            error={formik.touched.debtinc && Boolean(formik.errors.debtinc)}
            helperText={formik.touched.debtinc && formik.errors.debtinc}
          />
        </div>
        <div className="flex flex-col justify-between pb-5">
          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            {activeStep !== 0 && (
              <Button color="inherit" onClick={prevPage} sx={{ mr: 1 }}>
                Back
              </Button>
            )}
            <Box sx={{ flex: "1 1 auto" }} />
            <Button type="submit">
              {activeStep === steps.length - 1 ? "Finish" : "Next"}
            </Button>
          </Box>
        </div>
      </div>
    </form>
  );
}
