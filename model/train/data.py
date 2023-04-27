import pandas as pd
import numpy as np


def get_data(df: pd.DataFrame = None) -> pd.DataFrame:

    
    df["REASON"].fillna(value="DebtCon", inplace=True)
    df["JOB"].fillna(value="Other", inplace=True)

    df["DEROG"].fillna(value=0, inplace=True)
    df["DELINQ"].fillna(value=0, inplace=True)
    df.fillna(value=df.mean(), inplace=True)


    df.loc[df["CLAGE"] >= 600, "CLAGE"] = 600
    df.loc[df["VALUE"] >= 400000, "VALUE"] = 400000
    df.loc[df["MORTDUE"] >= 300000, "MORTDUE"] = 300000
    df.loc[df["DEBTINC"] >= 100, "DEBTINC"] = 100

    df["B_DEROG"] = (df["DEROG"] >= 1) * 1
    df["B_DELINQ"] = (df["DELINQ"] >= 1) * 1

    df["REASON_1"] = (df["REASON"] == "HomeImp") * 1
    df["REASON_2"] = (df["REASON"] != "HomeImp") * 1
    df["JOB_1"] = (df["JOB"] == "Other") * 1
    df["JOB_2"] = (df["JOB"] == "Office") * 1
    df["JOB_3"] = (df["JOB"] == "Sales") * 1
    df["JOB_4"] = (df["JOB"] == "Mgr") * 1
    df["JOB_5"] = (df["JOB"] == "ProfExe") * 1
    df["JOB_6"] = (df["JOB"] == "Self") * 1
    df.drop(["JOB", "REASON"], axis=1, inplace=True)


    df["YOJ"] = df["YOJ"].apply(lambda t: np.log(t + 1))
    return df


