from matplotlib import pyplot as plt
import tensorflow as tf
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
import pandas as pd
import numpy as np
import seaborn as sns
from keras import backend as K

def recall_m(y_true, y_pred):
    true_positives = K.sum(K.round(K.clip(y_true * y_pred, 0, 1)))
    possible_positives = K.sum(K.round(K.clip(y_true, 0, 1)))
    recall = true_positives / (possible_positives + K.epsilon())
    return recall

def precision_m(y_true, y_pred):
    true_positives = K.sum(K.round(K.clip(y_true * y_pred, 0, 1)))
    predicted_positives = K.sum(K.round(K.clip(y_pred, 0, 1)))
    precision = true_positives / (predicted_positives + K.epsilon())
    return precision

def f1_m(y_true, y_pred):
    precision = precision_m(y_true, y_pred)
    recall = recall_m(y_true, y_pred)
    return 2*((precision*recall)/(precision+recall+K.epsilon()))




def gen_dataset():
    bank_df = pd.read_csv("UniversalBank.csv")
    X = bank_df.drop(columns=["Personal Loan"])
    y = bank_df["Personal Loan"]
    y = tf.keras.utils.to_categorical(y)
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.1)

    sc = StandardScaler()
    X_train = sc.fit_transform(X_train)
    X_test = sc.transform(X_test)
    return X_train, X_test, y_train, y_test


X_train, X_test, y_train, y_test = gen_dataset()


def gen_model():
    model = tf.keras.Sequential()

    # adding dense layer
    model.add(tf.keras.layers.Dense(250, input_dim=13, kernel_initializer='normal', activation='relu'))
    model.add(tf.keras.layers.Dropout(0.3))
    model.add(tf.keras.layers.Dense(500, activation='relu'))
    model.add(tf.keras.layers.Dropout(0.3))
    model.add(tf.keras.layers.Dense(500, activation='relu'))
    model.add(tf.keras.layers.Dropout(0.3))
    model.add(tf.keras.layers.Dense(500, activation='relu'))
    model.add(tf.keras.layers.Dropout(0.4))
    model.add(tf.keras.layers.Dense(250, activation='linear'))
    model.add(tf.keras.layers.Dropout(0.4))

    # adding dense layer with softmax activation/output layer
    model.add(tf.keras.layers.Dense(2, activation='softmax'))
    model.summary()
    return model

ann_model = gen_model()
ann_model.compile(loss='categorical_crossentropy', optimizer='adam', metrics=["accuracy"]) # metrics=['accuracy']
history = ann_model.fit(X_train, y_train, epochs=20, validation_split=0.2, verbose=1)



def compute_metrics(y_test, model, plot_confusion=False, plot_loss=False, history=None):
    if plot_loss and history is not None:
        plt.figure(figsize=(15,8))
        plt.plot(history.history['loss'])
        plt.plot(history.history['val_loss'])
        plt.title('Model Loss')
        plt.ylabel('loss')
        plt.legend(['train_loss','val_loss'], loc = 'upper right')
        plt.savefig('model_loss.png', facecolor='w', bbox_inches='tight')
        plt.show()
    predictions = model.predict(X_test)
    predict = []

    for i in predictions:
        predict.append(np.argmax(i))

    from sklearn import metrics
    y_test = np.argmax(y_test, axis=1)

    f1_test = metrics.f1_score(y_test, predict)
    prec = metrics.precision_score(y_test, predict)
    rec = metrics.recall_score(y_test, predict)
    acc = metrics.accuracy_score(y_test, predict)

    print ("F1 Score: {:.4f}.".format(f1_test))
    print ("Precision: {:.4f}.".format(prec))
    print ("Recall: {:.4f}.".format(rec))
    print ("Accuracy: {:.4f}.".format(acc)) 


    if plot_confusion:
        conf_mat = metrics.confusion_matrix(y_test, predict)
        plt.figure(figsize=(10,8))
        LABELS=['Not Approved', 'Approved']
        sns.heatmap(conf_mat, xticklabels=LABELS, yticklabels=LABELS, annot=True, fmt="d", cmap=plt.cm.get_cmap('Blues'), )
        plt.savefig('model_confusion_matrix.png', facecolor='w', bbox_inches='tight')
        plt.show()
    

compute_metrics(y_test, ann_model, plot_confusion=True, plot_loss=True, history=history)

ann_model.save("score_model.h5")
ann_model.save("score_model")
