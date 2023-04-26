FROM zamafhe/concrete-ml
WORKDIR /project
ADD ./input ./input
COPY ./requirements.txt ./requirements.txt
RUN python -m pip install -r requirements.txt
COPY ./model.py ./model.py
