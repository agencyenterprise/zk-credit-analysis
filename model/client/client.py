import io
import logging
import os
from pathlib import Path
from typing import Literal, TypedDict
import sys
import requests
from concrete.ml.deployment import FHEModelClient
import numpy as np
import msgpack
import click
import pandas as pd

logging.basicConfig(level=logging.INFO)


def get_data(df: pd.DataFrame = None) -> pd.DataFrame:

    
    df["reason"].fillna(value="DebtCon", inplace=True)
    df["job"].fillna(value="Other", inplace=True)

    df["derog"].fillna(value=0, inplace=True)
    df["delinq"].fillna(value=0, inplace=True)
    df.fillna(value=df.mean(), inplace=True)


    df.loc[df["clage"] >= 600, "clage"] = 600
    df.loc[df["value"] >= 400000, "value"] = 400000
    df.loc[df["mortdue"] >= 300000, "mortdue"] = 300000
    df.loc[df["debtinc"] >= 100, "debtinc"] = 100

    df["b_derog"] = (df["derog"] >= 1) * 1
    df["b_delink"] = (df["delinq"] >= 1) * 1

    df["reason_1"] = (df["reason"] == "HomeImp") * 1
    df["reason_2"] = (df["reason"] != "HomeImp") * 1
    df["job_1"] = (df["job"] == "Other") * 1
    df["job_2"] = (df["job"] == "Office") * 1
    df["job_3"] = (df["job"] == "Sales") * 1
    df["job_4"] = (df["job"] == "Mgr") * 1
    df["job_5"] = (df["job"] == "ProfExe") * 1
    df["job_6"] = (df["job"] == "Self") * 1
    df.drop(["job", "reason"], axis=1, inplace=True)


    df["yoj"] = df["yoj"].apply(lambda t: np.log(t + 1))
    return df



FILE_FOLDER = Path(__file__).parent
STATUS_OK = 200
KEY_PATH = Path(os.environ.get("KEY_PATH", FILE_FOLDER / Path("server_keys")))
CLIENT_SERVER_PATH = Path(os.environ.get("PATH_TO_MODEL", FILE_FOLDER / Path("dev")))
PORT = os.environ.get("PORT", "5002")
SERVER_URL = os.environ.get("URL", f"http://localhost:5000")


class LoanRequest(TypedDict):
    """Loan request.
    LOAN: This column represents the amount of money borrowed by the borrower.

    MORTDUE: This column represents the amount owed on the borrower's mortgage.

    VALUE: This column represents the appraised value of the borrower's property.

    REASON: This column indicates the reason for the loan, such as debt consolidation, home improvement, or other purposes.

    JOB: This column represents the borrower's occupation or employment status.

    YOJ: This column represents the number of years the borrower has been employed.

    DEROG: This column represents the number of derogatory remarks on the borrower's credit report.

    DELINQ: This column represents the number of times the borrower has been late on a payment.

    CLAGE: This column represents the age of the borrower's oldest credit line.

    NINQ: This column represents the number of credit lines the borrower has opened in the past six months.

    CLNO: This column represents the total number of credit lines the borrower has.

    DEBTINC: This column represents the borrower's debt-to-income ratio, which is calculated by dividing the borrower's total monthly debt payments by their monthly income.

    """

    loan: float
    mortdue: float
    value: float
    reason: Literal["DebtCon", "HomeImp", "Other"]
    job: Literal["Mgr", "Office", "Other", "ProfExe", "Sales", "Self"]
    yoj: float
    derog: float
    delinq: float
    clage: float
    ninq: float
    clno: float
    debtinc: float


def get_client(file_name: str = "client.zip"):
    """Get the client.zip file."""
    zip_response = requests.get(f"{SERVER_URL}/get_client")
    assert zip_response.status_code == STATUS_OK
    with open(file_name, "wb") as file:
        file.write(zip_response.content)

    # Create the client
    return FHEModelClient(path_dir="./", key_dir="./keys")


def add_keys(serialized_evaluation_keys: bytes):
    """Add the keys to the server."""
    return requests.post(
        f"{SERVER_URL}/add_key",
        files={"key": io.BytesIO(initial_bytes=serialized_evaluation_keys)},
    )


def encrypt(inputs: LoanRequest):
    # Get the necessary data for the client
    # client.zip
    client = get_client()

    # The client first need to create the private and evaluation keys.
    client.generate_private_and_evaluation_keys()

    # Get the serialized evaluation keys
    serialized_evaluation_keys = client.get_serialized_evaluation_keys()
    assert isinstance(serialized_evaluation_keys, bytes)
    # Evaluation keys can be quite large files but only have to be shared once with the server.
    # Check the size of the evaluation keys (in MB)
    logging.info(
        f"Evaluation keys size: {sys.getsizeof(serialized_evaluation_keys) / 1024 / 1024:.2f} MB"
    )
    response = add_keys(serialized_evaluation_keys=serialized_evaluation_keys)
    del serialized_evaluation_keys
    assert response.status_code == STATUS_OK

    uid = response.json()["uid"]

    logging.info("extracting feature vector")
    raw_df = pd.DataFrame([inputs], columns=inputs.keys())
    features = ['derog', 'delinq', 'clage', 'ninq', 'debtinc', 'loan', 'job_2', 'yoj', 'job_3', 'mortdue']
    df = get_data(df=raw_df)[features]
    clear_input = np.array(df.values)
    assert isinstance(clear_input, np.ndarray)
    encrypted_input = client.quantize_encrypt_serialize(clear_input)
    assert isinstance(encrypted_input, bytes)
    data = {"input": encrypted_input, "uid": uid}
    return msgpack.packb(data, use_bin_type=True)


@click.command()
@click.option("--loan", prompt="loan amount", type=click.FLOAT, default=1000.0)
@click.option("--mortdue", prompt="mortdue amount", type=click.FLOAT, default=1000.0)
@click.option("--value", prompt="value amount", type=click.FLOAT, default=1000.0)
@click.option("--reason", prompt="reason", type=click.STRING, default="DebtCon")
@click.option("--job", prompt="job", type=click.STRING, default="Mgr")
@click.option("--yoj", prompt="yoj amount", type=click.FLOAT, default=1000.0)
@click.option("--derog", prompt="derog amount", type=click.FLOAT, default=1000.0)
@click.option("--delinq", prompt="delinq amount", type=click.FLOAT, default=1000.0)
@click.option("--clage", prompt="clage amount", type=click.FLOAT, default=1000.0)
@click.option("--ninq", prompt="ninq amount", type=click.FLOAT, default=1000.0)
@click.option("--clno", prompt="clno amount", type=click.FLOAT, default=1000.0)
@click.option("--debtinc", prompt="debtinc amount", type=click.FLOAT, default=1000.0)
def main(
    loan, mortdue, value, reason, job, yoj, derog, delinq, clage, ninq, clno, debtinc
):
    """Encrypt the input."""
    logging.info("encrypting input...")
    inputs = LoanRequest(
        loan=loan,
        mortdue=mortdue,
        value=value,
        reason=reason,
        job=job,
        yoj=yoj,
        derog=derog,
        delinq=delinq,
        clage=clage,
        ninq=ninq,
        clno=clno,
        debtinc=debtinc,
    )
    data = encrypt(inputs)
    with open("input.msgpack", "wb") as file:
        file.write(data)


if __name__ == "__main__":
    main()
