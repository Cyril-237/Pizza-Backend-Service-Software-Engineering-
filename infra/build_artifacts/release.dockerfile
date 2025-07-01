#
# Layers: Only the instructions RUN, COPY, ADD create layers.
#

ARG PYTHON_IMAGE_VERSION=3.10

#FROM base as development
FROM python:${PYTHON_IMAGE_VERSION}-alpine AS development

ENV USER="web"
ENV HOME="/${USER}"
ENV \
    USER_ID=1000 \
    GROUP_ID=1000 \
    # write messages immediately to stream
    PYTHONUNBUFFERED=1 \
    # don't write .pyc files
    PYTHONDONTWRITEBYTECODE=1 \
    # Do not use randomization for python seed
    PYTHONHASHSEED=1 \
    # add virtualenv to path
    PATH="${HOME}/.venv/bin:${PATH}"

RUN apk update && apk upgrade --no-cache && \
    addgroup --gid ${GROUP_ID} ${USER} && \
    adduser -D -h "${HOME}" -u "${USER_ID}" -G "${USER}" "${USER}" && \
    mkdir -p "${HOME}" && chown ${USER}:${USER} "${HOME}"

COPY --from=ghcr.io/astral-sh/uv:0.6.2 /uv /uvx /bin/

USER ${USER}
WORKDIR ${HOME}

COPY ./pyproject.toml ./uv.lock ${HOME}/

RUN uv sync --frozen --no-install-project --no-cache

COPY  ./app ${HOME}/app/
COPY  ./infra/build_artifacts/docker-entrypoint.sh ${HOME}/scripts/
COPY  ./pizza_1337_preact/dist ${HOME}/frontend/
COPY  ./alembic.ini ${HOME}/

EXPOSE 8000

ENTRYPOINT ["./scripts/docker-entrypoint.sh"]
