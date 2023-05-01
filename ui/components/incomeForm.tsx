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
  experience: yup
    .number()
    .min(1, "Experience should be at least 1 year")
    .required("Years of experience is required"),
  income: yup
    .number()
    .min(40000, "Income should be at least 40000/yr")
    .required("Yearly income is required"),
  education: yup.string().oneOf(["Bachelor", "Master", "Advanced Degree"]),
  ccavg: yup
    .number()
    .min(0, "Credit card average expendings per month should be at least 0")
    .required(),
});

export default function IncomeForm(props: any) {
  const { dispatch, state } = useLoan();
  const { nextPage, prevPage, activeStep, steps } = props;
  const formik = useFormik({
    initialValues: {
      reason: state.reason ? state.reason : "",
      job: state.job ? state.job : "",
      yoj: state.yoj ? state.yoj : 0,
      experience: state.experience ? state.experience : 0,
      income: state.income ? state.income : 0,
      education: state.education ? state.education : "Bachelor",
      ccavg: state.ccavg ? state.ccavg : 0,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      let {
        reason: r,
        job: j,
        yoj,
        experience,
        income,
        education,
        ccavg,
      } = values;
      let reason: Reason = r as Reason;
      let job: Job = j as Job;
      dispatch({
        type: "income",
        reason: reason,
        job: job,
        yoj,
        experience,
        income,
        education,
        ccavg,
      });
      nextPage();
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="flex flex-col space-y-2 justify-center max-w-[600px]">
        <div className="flex flex-col space-y-3 min-h-[400px] w-full justify-center">
          <InputLabel className="text-left pt-6 text-xs" id="reason-label">
            Reason for loan request
          </InputLabel>
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
          <InputLabel className="text-left  text-xs" id="job-label">
            Job position
          </InputLabel>
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
          <TextField
            fullWidth
            id="experience"
            name="experience"
            label="Years of work experience"
            type="number"
            value={formik.values.experience}
            onChange={formik.handleChange}
            error={
              formik.touched.experience && Boolean(formik.errors.experience)
            }
            helperText={formik.touched.experience && formik.errors.experience}
          />
          <TextField
            fullWidth
            id="income"
            name="income"
            label="Yearly income"
            type="number"
            value={formik.values.income}
            onChange={formik.handleChange}
            error={formik.touched.income && Boolean(formik.errors.income)}
            helperText={formik.touched.income && formik.errors.income}
          />
          <InputLabel className="text-left  text-xs" id="education-label">
            Education
          </InputLabel>
          <Select
            labelId="education-label"
            id="education"
            name="education"
            label="education"
            value={formik.values.education}
            onChange={formik.handleChange}
            error={formik.touched.education && Boolean(formik.errors.education)}
          >
            {[
              ["Bachelor", "Bachelor"],
              ["Master", "Master"],
              ["Advanced Degree", "Advanced Degree"],
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
            id="ccavg"
            name="ccavg"
            label="Monthly credit card spending (average)"
            type="number"
            value={formik.values.ccavg}
            onChange={formik.handleChange}
            error={formik.touched.ccavg && Boolean(formik.errors.ccavg)}
            helperText={formik.touched.ccavg && formik.errors.ccavg}
          />
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
