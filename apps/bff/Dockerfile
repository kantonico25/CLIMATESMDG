FROM node:20-bookworm-slim AS build
WORKDIR /app
COPY package.json package-lock.json* ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi
COPY . .
RUN npm run build

FROM node:20-bookworm-slim
WORKDIR /app
ENV NODE_ENV=production
COPY package.json package-lock.json* ./
RUN if [ -f package-lock.json ]; then npm ci --omit=dev; else npm install --omit=dev; fi

RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 python3-pip python3-venv python-is-python3 \
  && rm -rf /var/lib/apt/lists/*

COPY --from=build /app/dist ./dist
COPY --from=build /app/predictor ./predictor
RUN python -m venv /opt/venv
RUN /opt/venv/bin/python -m pip install --upgrade pip \
  && /opt/venv/bin/python -m pip install --no-cache-dir -r predictor/requirements.txt
ENV PATH="/opt/venv/bin:${PATH}"

EXPOSE 4000
CMD ["node", "dist/index.js"]
