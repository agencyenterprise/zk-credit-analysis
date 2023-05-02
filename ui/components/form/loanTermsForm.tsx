import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useLoan } from "../../hooks/useLoan";
import { Box, Checkbox, FormControlLabel, InputLabel } from "@mui/material";

const validationSchema = yup.object({
  loan: yup
    .number()
    .min(100, "Loan be at least 100 USD")
    .max(10001, "Loan should be up to 10000 USD")
    .required("Loan value is required"),
  description: yup
    .string()
    .min(100, "Description should be at least 100 characters"),
});

export default function LoanTermsForm(props: any) {
  const { dispatch, state } = useLoan();
  const { nextPage, prevPage, activeStep, steps } = props;
  const formik = useFormik({
    initialValues: {
      loan: state.loan ? state.loan : 0,
      description: state.description != undefined ? state.description : "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      let { loan, description } = values;
      dispatch({ type: "loan", loan, description });
      nextPage();
    },
  });
  useEffect(() => {
    console.log(state);
  }, [state]);
  return (
    <form className="h-full" onSubmit={formik.handleSubmit}>
      <div className="flex flex-col space-y-10 justify-between  max-w-[600px] pt-10 h-full">
        <div className="flex flex-col space-y-5 min-h-[650px] w-full">
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
          <TextField
            fullWidth
            multiline
            rows={10}
            id="description"
            name="description"
            label="Why do you need this loan?"
            value={formik.values.description}
            onChange={formik.handleChange}
            error={
              formik.touched.description && Boolean(formik.errors.description)
            }
            helperText={formik.touched.description && formik.errors.description}
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
              {activeStep === steps.length - 1 ? "Request Loan" : "Next"}
            </Button>
          </Box>
        </div>
      </div>
    </form>
  );
}
