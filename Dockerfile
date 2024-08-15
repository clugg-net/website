ARG BUN_VARIANT="alpine"

# This layout allows Dependabot to see and update the versions:
# https://github.com/dependabot/dependabot-core/issues/2057#issuecomment-1351660410
FROM oven/bun:1.1.24-distroless AS bun-distroless
FROM oven/bun:1.1.24-alpine AS bun-alpine
FROM oven/bun:1.1.24-debian AS bun-debian

# Multi-stage build (using SSR)
# https://docs.astro.build/en/recipes/docker/#multi-stage-build-using-ssr

FROM bun-distroless AS base
ARG WORKDIR="/home/bun/app"
ARG USER="bun"
USER ${USER}
WORKDIR ${WORKDIR}
COPY package.json bun.lockb ./

FROM base as prod-deps
ARG USER="bun"
USER ${USER}
RUN bun install --production --frozen-lockfile

FROM base as build-deps
ARG USER="bun"
USER ${USER}
RUN bun install --frozen-lockfile

FROM build-deps AS build
ARG USER="bun"
USER ${USER}
COPY . .
RUN bun run build

FROM bun-debian AS devcontainer-debian
ARG USER="bun"
USER root
RUN chsh --shell /bin/bash ${USER}
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends \
        git openssh-client procps zsh bash bash-completion sudo \
    && apt-get -y clean
USER ${USER}

FROM bun-alpine AS devcontainer-alpine
ARG USER="bun"
USER root
RUN chsh --shell /bin/bash ${USER}
RUN apk update && apk add \
    git openssh-client git-bash-completion zsh git-zsh-completion zsh-completions sudo
USER ${USER}

FROM devcontainer-${BUN_VARIANT} AS devcontainer
ARG USER="bun"
USER ${USER}

FROM bun-${BUN_VARIANT} AS runtime
ARG WORKDIR="/home/bun/app"
ARG USER="bun"
USER ${USER}
COPY --from=prod-deps ${WORKDIR}/node_modules ./node_modules
COPY --from=build ${WORKDIR}/dist ./dist

ENV HOST=0.0.0.0
ENV PORT=4321
EXPOSE ${PORT}
CMD bun run preview -- --host ${HOST} --port ${PORT}
