import React from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Job, Reason, useLoan } from "../hooks/useLoan";
import { Box, InputLabel, MenuItem, Select } from "@mui/material";

const validationSchema = yup.object({
  reason: yup
    .string()
    .oneOf(["DebtCon", "HomeImp", "Other"])
    .required("Add a reson for your loan request"),
  job: yup
    .string()
    .oneOf(["Other", "Office", "Sales", "Mgr", "ProfExe", "Self"])
    .required("Inform your job"),
  yoj: yup
    .number()
    .min(1, "Years of job should be at least 1")
    .required("Years of job is required"),
});

export default function IncomeForm(props: any) {
  const { dispatch, state } = useLoan();
  const { nextPage, prevPage, activeStep, steps } = props;
  const formik = useFormik({
    initialValues: {
      reason: state.reason ? state.reason : "",
      job: state.job ? state.job : "",
      yoj: state.yoj ? state.yoj : 0,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      let { reason: r, job: j, yoj } = values;
      let reason: Reason = r as Reason;
      let job: Job = j as Job;
      dispatch({ type: "income", reason: reason, job: job, yoj });
      nextPage();
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="flex flex-col space-y-5 justify-center w-full pt-10">
        <InputLabel id="reason-label">Reason for loan request</InputLabel>
        <Select
          labelId="reason-label"
          id="reason"
          name="reason"
          label="Reason for loan request"
          value={formik.values.reason}
          onChange={formik.handleChange}
          error={formik.touched.reason && Boolean(formik.errors.reason)}
        >
          {[
            ["DebtCon", "Pay debts"],
            ["HomeImp", "Home Improvements"],
            ["Other", "Other"],
          ].map((v) => {
            return (
              <MenuItem key={v[0]} value={v[0]}>
                {v[1]}
              </MenuItem>
            );
          })}
        </Select>
        <InputLabel id="job-label">Job position</InputLabel>
        <Select
          labelId="job-label"
          id="job"
          name="job"
          label="Job position"
          value={formik.values.job}
          onChange={formik.handleChange}
          error={formik.touched.job && Boolean(formik.errors.job)}
          inputProps={{ name: "Job position" }}
        >
          {[
            ["Other", "Other"],
            ["Office", "Office Assistant"],
            ["Sales", "Sales Representative"],
            ["Mgr", "Manager"],
            ["ProfExe", "Executive"],
            ["Self", "Self Employed"],
          ].map((v) => {
            return (
              <MenuItem key={v[0]} value={v[0]}>
                {v[1]}
              </MenuItem>
            );
          })}
        </Select>
        <TextField
          fullWidth
          id="yoj"
          name="yoj"
          label="Years at the present job"
          type="number"
          value={formik.values.yoj}
          onChange={formik.handleChange}
          error={formik.touched.yoj && Boolean(formik.errors.yoj)}
          helperText={formik.touched.yoj && formik.errors.yoj}
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
