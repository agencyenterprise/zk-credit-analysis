import pandas as pd
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import itertools
from sklearn.metrics import confusion_matrix
from sklearn.metrics import accuracy_score, f1_score, precision_score, recall_score
from sklearn.feature_selection import f_classif
from sklearn.feature_selection import SelectKBest
from sklearn.model_selection import train_test_split
from concrete.ml.sklearn.xgb import XGBClassifier
from sklearn.model_selection import KFold, cross_val_score, KFold
import time
from concrete.ml.deployment import FHEModelDev

pd.set_option('display.max_rows', 5)
pd.set_option('display.max_columns', 500)
pd.set_option('display.width', 1000)
np.random.seed(42)
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



def plot_confusion_matrix(
    cm, classes, normalize=False, title="Confusion matrix", cmap=plt.cm.Blues
):
    """
    This function prints and plots the confusion matrix.
    Normalization can be applied by setting `normalize=True`.
    """
    if normalize:
        cm = cm.astype("float") / cm.sum(axis=1)[:, np.newaxis]
        print("Normalized confusion matrix")
    else:
        print("Confusion matrix, without normalization")

    print(cm)

    plt.imshow(cm, interpolation="nearest", cmap=cmap)
    plt.title(title)
    plt.colorbar()
    tick_marks = np.arange(len(classes))
    plt.xticks(tick_marks, classes, rotation=45)
    plt.yticks(tick_marks, classes)

    fmt = ".2f" if normalize else "d"
    thresh = cm.max() / 2.0
    for i, j in itertools.product(range(cm.shape[0]), range(cm.shape[1])):
        plt.text(
            j,
            i,
            format(cm[i, j], fmt),
            horizontalalignment="center",
            color="white" if cm[i, j] > thresh else "black",
        )

    plt.tight_layout()
    plt.ylabel("True label")
    plt.xlabel("Predicted label")

raw_df = pd.read_csv("./input/hmeq.csv")
df = get_data(df=raw_df)


default_len = len(df[df["BAD"] == 1])
default_indices = np.array(df[df["BAD"] == 1].index)

# selecting the same number of elements from majority class randomly.
good_indices = np.array(df[df["BAD"] == 0].index)
rand_good_indices = np.random.choice(good_indices, default_len, replace=False)
rand_good_indices = np.array(rand_good_indices)

# combing the indices
combined_indices = np.concatenate([rand_good_indices, default_indices])

# getting the corresponding dataset with above indices.
comb_df = df.iloc[combined_indices, :]
comb_y = comb_df["BAD"]


selector = SelectKBest(f_classif, k=10)

comb_x = pd.DataFrame(
    selector.fit_transform(
        comb_df.drop(["BAD"], axis=1), comb_df["BAD"]
    )
)
print(comb_df.head())
print(comb_x.head())
cols_idxs = selector.get_support(indices=True)
print(cols_idxs)
features_df_new = comb_x.reset_index().iloc[:,cols_idxs]
print(features_df_new.head())


x_trc, x_tec, y_trc, y_tec = train_test_split(
    comb_x, comb_y, test_size=0.33, random_state=1000
)


lr: XGBClassifier = XGBClassifier()


def printing_Kfold_scores(x_trc, y_trc):
    print("Decision Tree Algorithm")
    fold = KFold(n_splits=4, shuffle=False)
    for train, test in fold.split(x_trc, y_trc):
        x1 = x_trc.iloc[train, :]
        y1 = y_trc.iloc[train]
        x2 = x_trc.iloc[test, :]
        y2 = y_trc.iloc[test]
        lr.fit(x1, y1)
        y_pred_undersample = lr.predict(x2)
        recall_acc = recall_score(y2, y_pred_undersample)
        print(recall_acc)


printing_Kfold_scores(x_trc, y_trc)
print("compiling model")
start_time = time.time()
lr.compile(x_trc.values[0:10])
end_time = time.time()
print(f"Model compiled: time spent: {end_time - start_time}")
print("predict y_test")
start_time = time.time()
y_predr = lr.predict(x_tec.values[0:10], fhe="execute")
end_time = time.time()
print(f"Predicted dataset: time spent: {end_time - start_time}")
print(y_predr)
# print(f"Predication All: time spent: {end_time - start_time}")
# print("")
# print("Accuracy Score = ", accuracy_score(y_tec, y_predr))
# print("F1 Score = ", f1_score(y_tec, y_predr, average="macro"))
# print("Precision Score = ", precision_score(y_tec, y_predr, average="macro"))
# print("Recall Score = ", recall_score(y_tec, y_predr, average="macro"))
# print("")
cnf_matrix = confusion_matrix(y_tec.values[0:10], y_predr[0:10])
np.set_printoptions(precision=2)


start_time = time.time()
y_predr = lr.predict([x_tec.values[0]], fhe="execute")
end_time = time.time()
print(f"Single Prediction: time spent: {end_time - start_time}")


fhe_api = FHEModelDev("./dev", lr)
fhe_api.save()


# Plot non-normalized confusion matrix
# plt.figure()
# plot_confusion_matrix(
#     cnf_matrix,
#     classes=["BAD"],
#     title="Confusion matrix - Logistic Regression Algorithm after Resampling the data",
# )

# plt.show()


"""
LOAN
MORTDUE
DEROG
[ 0  3  4  5  6  7  9 10 11 15]
[ 0  3  4  5  6  7  9 10 11 15]
LOAN
"""