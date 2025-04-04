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

FROM debian:bullseye-slim
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    libsqlite3-0 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY --from=build /app/main .

# Create directories if they don't exist
RUN mkdir -p /app/config /app/templates /app/static

# Copy any necessary static files or configurations
COPY --from=build /app/config/. /app/config/
COPY --from=build /app/templates/. /app/templates/
COPY --from=build /app/static/. /app/static/

EXPOSE 5001
CMD ["./main"] 