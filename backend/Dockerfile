FROM golang:1.20-bullseye AS build

WORKDIR /app

# Install build dependencies for SQLite
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libc6-dev \
    libsqlite3-dev \
    && rm -rf /var/lib/apt/lists/*

# Enable CGO for sqlite3
ENV CGO_ENABLED=1

COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN go build -o main .

# Create empty directories if they don't exist to avoid errors in COPY
RUN mkdir -p /app/config /app/templates /app/static

FROM debian:bullseye-slim
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    libsqlite3-0 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY --from=build /app/main .

# Create directories in final image
RUN mkdir -p /app/config /app/templates /app/static

# Skip copying directories with a shell command instead of COPY
# This avoids Docker build errors when source directories are empty
RUN --mount=from=build,src=/app,target=/tmp/app \
    cp -r /tmp/app/config/* /app/config/ 2>/dev/null || true && \
    cp -r /tmp/app/templates/* /app/templates/ 2>/dev/null || true && \
    cp -r /tmp/app/static/* /app/static/ 2>/dev/null || true

EXPOSE 5001
CMD ["./main"] 