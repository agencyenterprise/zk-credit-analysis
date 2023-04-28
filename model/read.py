import io
import os
import msgpack
import grequests
import numpy as np

SERVER_URL = os.environ.get("URL", f"http://localhost:5000")

with open("input.msgpack", "rb") as data_file:
    byte_data = data_file.read()

data_loaded = msgpack.unpackb(byte_data)
print(data_loaded)

encrypted_input = data_loaded["input"]
uid = data_loaded["uid"]


inferences = [
            grequests.post(
                f"{SERVER_URL}/compute",
                files={
                    "model_input": io.BytesIO(encrypted_input),
                },
                data={
                    "uid": uid,
                },
            )
        ]
del encrypted_input
print("Posted!")

# Unpack the results
result = grequests.map(inferences)[0]
if result is None:
    raise ValueError("Result is None, probably due to a crash on the server side.")
assert result.status_code == STATUS_OK
print("OK!")

encrypted_result = result.content
decrypted_prediction = client.deserialize_decrypt_dequantize(encrypted_result)
end = time.time()
print("type: ", type(decrypted_prediction.tolist()))

print(decrypted_prediction.tolist())
probabilities = np.array(decrypted_prediction,dtype=float).tolist()
