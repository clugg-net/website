ARG DEVCONTAINER_VARIANT="alpine"

# This layout allows Dependabot to see and update the versions:
# https://github.com/dependabot/dependabot-core/issues/2057#issuecomment-1351660410
FROM oven/bun:1.1.24-distroless AS bun-distroless
FROM oven/bun:1.1.24-alpine AS bun-alpine
FROM oven/bun:1.1.24-debian AS bun-debian

# Multi-stage build (using SSR)
# https://docs.astro.build/en/recipes/docker/#multi-stage-build-using-ssr

FROM bun-alpine AS base
ARG WORKDIR="/home/bun/app"
WORKDIR ${WORKDIR}
RUN chown bun /home/bun/app
USER bun
COPY package.json bun.lockb ./

FROM base as prod-deps
USER bun
RUN --mount=type=cache,uid=1000,gid=1000,target=/home/bun/.bun/install/cache bun install --production --frozen-lockfile

FROM base as build-deps
USER bun
RUN --mount=type=cache,uid=1000,gid=1000,target=/home/bun/.bun/install/cache bun install --frozen-lockfile

FROM build-deps AS build
COPY --chown=bun:bun . .
USER bun
RUN --mount=type=cache,uid=1000,gid=1000,target=/home/bun/.bun/install/cache bun run build

FROM bun-debian AS devcontainer-debian
ARG USER="bun"
USER root
RUN chsh --shell /bin/bash ${USER}
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends \
        git openssh-client procps zsh bash bash-completion \
    && apt-get -y clean
USER ${USER}

FROM bun-alpine AS devcontainer-alpine
ARG USER="bun"
USER root
RUN apk update && apk add \
    shadow bash git openssh-client git-bash-completion zsh git-zsh-completion zsh-completions
RUN echo -e "auth sufficient pam_rootok.so" > /etc/pam.d/chsh
RUN chmod 600 /etc/pam.d/chsh
RUN od -a /etc/pam.d/chsh && ls -l /etc/pam.d/chsh && chsh --shell /bin/bash ${USER}
USER ${USER}

FROM devcontainer-${DEVCONTAINER_VARIANT} AS devcontainer
ARG USER="bun"
USER ${USER}

FROM bun-${DEVCONTAINER_VARIANT} AS runtime
ARG WORKDIR="/home/bun/app"
ARG USER="bun"
COPY --from=prod-deps ${WORKDIR}/node_modules ./node_modules
COPY --from=build ${WORKDIR}/dist ./dist

ENV ASTRO_HOST=0.0.0.0
ENV ASTRO_PORT=4321
EXPOSE ${PORT}
USER ${USER}
CMD bun run preview -- --host $${ASTRO_HOST} --port $${ASTRO_PORT}
