import React from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useLoan } from "../hooks/useLoan";
import { Box } from "@mui/material";

const validationSchema = yup.object({
  mortgage: yup
    .number()
    .min(0, "Mortgage debt should be at least 0")
    .required("Add your mortgage value"),
  patrimony: yup
    .number()
    .min(1000, "Asset should be greater than 1000 USD")
    .required("Patrimony is required"),
});

export default function HistoryForm(props: any) {
  const { dispatch, state } = useLoan();
  const { nextPage, prevPage, activeStep, steps } = props;
  const formik = useFormik({
    initialValues: {
      mortgage: state.mortdue ? state.mortdue : 0.0,
      patrimony: state.value ? state.value : 1000.0,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const { mortgage, patrimony } = values;
      dispatch({ type: "history", mortdue: mortgage, value: patrimony });
      nextPage();
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="flex flex-col space-y-5 justify-center w-full pt-10">
        <TextField
          fullWidth
          id="mortgage"
          name="mortgage"
          label="Mortgage Debt"
          type="number"
          value={formik.values.mortgage}
          onChange={formik.handleChange}
          error={formik.touched.mortgage && Boolean(formik.errors.mortgage)}
          helperText={formik.touched.mortgage && formik.errors.mortgage}
        />
        <TextField
          fullWidth
          id="patrimony"
          name="patrimony"
          label="Patrimony"
          type="number"
          value={formik.values.patrimony}
          onChange={formik.handleChange}
          error={formik.touched.patrimony && Boolean(formik.errors.patrimony)}
          helperText={formik.touched.patrimony && formik.errors.patrimony}
        />
      </div>
      <div className="flex just-between">
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
    </form>
  );
}
