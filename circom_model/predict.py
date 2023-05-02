import json
from sklearn.discriminant_analysis import StandardScaler
from sklearn.model_selection import train_test_split
import tensorflow as tf
import pandas as pd
import numpy as np



def gen_dataset():
    bank_df = pd.read_csv("UniversalBank.csv")
    X = bank_df.drop(columns=["Personal Loan"])
    y = bank_df["Personal Loan"]
    y = tf.keras.utils.to_categorical(y)
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.1, random_state=42)
    print(X_test.values[32])
    sc = StandardScaler()
    X_train = sc.fit_transform(X_train)
    X_test = sc.transform(X_test)
    print("sc.mean_")
    print(sc.mean_)
    std  = np.sqrt(sc.var_)
    print("std")
    print(std)
    return X_train, X_test, y_train, y_test



X_train, X_test, y_train, y_test = gen_dataset()
print("loading the model...")
score_model = tf.keras.models.load_model('score_model.h5')
print("starting prediction...")
#input =  X_test[32:33]
input = np.array([[
    -0.5340552215665256,
    0.31521502862624506,
    0.2481087991715331,
    2.1756956952863233,
    1.0605185402599033,
    0.5296192252057498,
    1.5191740065239705,
    0.14065425615605842,
    0.02225687647448418,
    -0.34191001425856227,
    -0.253142930523615,
    -1.2179670380112235,
    -0.6428970221356498
]])
normalized_input =input*10**9
circom_y = score_model.predict(input)
print(input)
print(circom_y)
raise Exception("stop")
print("Dataset used: ")
print(normalized_input)
data = {
        "input": (normalized_input).astype(int).flatten().tolist(),
        "scale": 10**-18,
        "out": circom_y.flatten().tolist(),
        "label": int(circom_y.argmax())
    }
print(data)
with open("score_model_io.json", "w") as f:
        json.dump(data, f)

