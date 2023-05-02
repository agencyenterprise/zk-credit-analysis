import React from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useLoan } from "../../hooks/useLoan";
import { Box, Checkbox, FormControlLabel } from "@mui/material";

const validationSchema = yup.object({
  mortgage: yup
    .number()
    .min(0, "Mortgage debt should be at least 0")
    .required("Add your mortgage value"),
  patrimony: yup
    .number()
    .min(1000, "Asset should be greater than 1000 USD")
    .required("Patrimony is required"),
  age: yup
    .number()
    .min(18, "Age should be greater than 18")
    .required("Age is required"),
  zip: yup.number().required("Zip code is required"),
  family: yup
    .number()
    .min(1, "Family members should be at least 1")
    .required("Family is required"),
  securities: yup.boolean().required("Securities is required"),
  creditCard: yup.boolean().required("Credit card is required"),
  online: yup.boolean().required("Online Banking is required"),
  cdAccount: yup
    .boolean()
    .required("Certificate of deposit account is required"),
});

export default function HistoryForm(props: any) {
  const { dispatch, state } = useLoan();
  const { nextPage, prevPage, activeStep, steps } = props;
  const formik = useFormik({
    initialValues: {
      mortgage: state.mortdue ? state.mortdue : 0.0,
      patrimony: state.value ? state.value : 1000.0,
      age: state.age ? state.age : 0,
      zip: state.zip ? state.zip : undefined,
      family: state.family ? state.family : 0,
      securities: state.securities ? state.securities : false,
      creditCard: state.creditCard ? state.creditCard : false,
      online: state.online ? state.online : false,
      cdAccount: state.cdAccount ? state.cdAccount : false,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const {
        mortgage,
        patrimony,
        age,
        zip,
        family,
        securities,
        creditCard,
        online,
        cdAccount,
      } = values;
      dispatch({
        type: "history",
        mortdue: mortgage,
        value: patrimony,
        age,
        zip,
        family,
        securities,
        creditCard,
        online,
        cdAccount,
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
          <TextField
            fullWidth
            id="age"
            name="age"
            label="Age"
            type="number"
            value={formik.values.age}
            onChange={formik.handleChange}
            error={formik.touched.age && Boolean(formik.errors.age)}
            helperText={formik.touched.age && formik.errors.age}
          />
          <TextField
            fullWidth
            id="zip"
            name="zip"
            label="Zip code"
            type="number"
            value={formik.values.zip}
            onChange={formik.handleChange}
            error={formik.touched.zip && Boolean(formik.errors.zip)}
            helperText={formik.touched.zip && formik.errors.zip}
          />
          <TextField
            fullWidth
            id="family"
            name="family"
            label="# of family members"
            type="number"
            value={formik.values.family}
            onChange={formik.handleChange}
            error={formik.touched.family && Boolean(formik.errors.family)}
            helperText={formik.touched.family && formik.errors.family}
          />
          <div className="flex justify-start">
            <FormControlLabel
              control={
                <Checkbox
                  defaultChecked={formik.values.securities}
                  id="securities"
                  name="securities"
                  value={formik.values.securities}
                  onChange={formik.handleChange}
                />
              }
              label="Has securities"
            />
          </div>
          <div className="flex justify-start">
            <FormControlLabel
              control={
                <Checkbox
                  defaultChecked={formik.values.creditCard}
                  id="creditCard"
                  name="creditCard"
                  value={formik.values.creditCard}
                  onChange={formik.handleChange}
                />
              }
              label="Has credit card"
            />
          </div>
          <div className="flex justify-start">
            <FormControlLabel
              control={
                <Checkbox
                  defaultChecked={formik.values.online}
                  id="online"
                  name="online"
                  value={formik.values.online}
                  onChange={formik.handleChange}
                />
              }
              label="Has online banking"
            />
          </div>
          <div className="flex justify-start">
            <FormControlLabel
              control={
                <Checkbox
                  defaultChecked={formik.values.cdAccount}
                  id="cdAccount"
                  name="cdAccount"
                  value={formik.values.cdAccount}
                  onChange={formik.handleChange}
                />
              }
              label="Has certificate of deposit account"
            />
          </div>
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
