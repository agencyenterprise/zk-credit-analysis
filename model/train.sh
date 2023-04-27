docker build -t fhe_score_model -f Dockerfile.train . && \
docker run -it fhe_score_model --name fhe_score_model
# docker cp fhe_score_model:/project/dev . && \
# docker cp fhe_score_model:/project/hf_cache . && \

# docker rm "$(docker ps -a --filter name=fhe_score_model -q)"