import json
from sklearn.discriminant_analysis import StandardScaler
from sklearn.model_selection import train_test_split
import tensorflow as tf
import pandas as pd
import numpy as np
import logging
logging.basicConfig(level=logging.INFO)


def gen_dataset():
    """Generate the dataset for training the model.
    It exports the mean and standard deviation of the dataset
    to be used in the circom model in the browser. 
    You must copy part of the the terminal output and paste
    it at ui/utils/model/index.ts.
    """
    bank_df = pd.read_csv("UniversalBank.csv")
    X = bank_df.drop(columns=["Personal Loan"])
    y = bank_df["Personal Loan"]
    y = tf.keras.utils.to_categorical(y)
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.1, random_state=42)
    sc = StandardScaler()
    X_train = sc.fit_transform(X_train)
    X_test = sc.transform(X_test)
    logging.info("COPY THE TERMINAL OUTPUT BELOW AND PASTE IT AT scalarAVG AT ui/utils/model/index.ts")
    logging.info(sc.mean_)
    std  = np.sqrt(sc.var_)
    logging.info("COPY THE TERMINAL OUTPUT BELOW AND PASTE IT AT scalarSTD AT ui/utils/model/index.ts")
    logging.info(std)
    return X_train, X_test, y_train, y_test



def generate_input_files_for_testing():
    """Generate input files for testing the model in circom
    The test is located at ../tests/score_model.js.
    To execute the test, run `npm run test` from the folder above.
    """
    X_train, X_test, y_train, y_test = gen_dataset()
    logging.info("loading the model...")
    score_model = tf.keras.models.load_model('score_model.h5')
    logging.info("starting prediction...")
    input =  X_test[32:33]
    normalized_input =input*10**9
    circom_y = score_model.predict(input)
    data = {
            "input": (normalized_input).astype(int).flatten().tolist(),
            "scale": 10**-18,
            "out": circom_y.flatten().tolist(),
            "label": int(circom_y.argmax())
        }
    logging.info(data)
    with open("score_model_io.json", "w") as f:
            json.dump(data, f)


if __name__ == "__main__":
    generate_input_files_for_testing()
 