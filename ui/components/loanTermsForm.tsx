import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useLoan } from "../hooks/useLoan";
import { Box, Checkbox, FormControlLabel, InputLabel } from "@mui/material";

const validationSchema = yup.object({
  loan: yup
    .number()
    .min(100, "Loan be at least 100 USD")
    .required("Loan value is required"),
  encrypted: yup.boolean().required("Encryption is required"),
});

export default function LoanTermsForm(props: any) {
  const { dispatch, state } = useLoan();
  const { nextPage, prevPage, activeStep, steps } = props;
  const formik = useFormik({
    initialValues: {
      loan: state.loan ? state.loan : 0,
      encrypted: state.encrypted != undefined ? state.encrypted : true,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      let { loan, encrypted: e } = values;
      let encrypted = e as boolean;
      dispatch({ type: "loan", loan, encrypted });
      nextPage();
    },
  });
  useEffect(() => {
    console.log(state);
  }, [state]);
  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="flex flex-col space-y-5 justify-center w-full pt-10">
        <div className="space-y-5 min-h-[400px]">
          <TextField
            fullWidth
            id="loan"
            name="loan"
            label="Loan value"
            type="number"
            value={formik.values.loan}
            onChange={formik.handleChange}
            error={formik.touched.loan && Boolean(formik.errors.loan)}
            helperText={formik.touched.loan && formik.errors.loan}
          />
          <div className="flex justify-start">
            <FormControlLabel
              control={
                <Checkbox
                  defaultChecked={formik.values.encrypted}
                  id="encrypted"
                  name="encrypted"
                  value={formik.values.encrypted}
                  onChange={formik.handleChange}
                />
              }
              label="Encrypt loan data"
            />
          </div>
        </div>

        <div className="flex flex-col justify-between">
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
