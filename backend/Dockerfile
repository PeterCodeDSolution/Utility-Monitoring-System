FROM golang:1.20-alpine AS build

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN go build -o main .

FROM alpine:latest
RUN apk --no-cache add ca-certificates
WORKDIR /app
COPY --from=build /app/main .

# Create directories if they don't exist
RUN mkdir -p /app/config /app/templates /app/static

# Copy any necessary static files or configurations
COPY ./config/. /app/config/ || echo "No config files found"
COPY ./templates/. /app/templates/ || echo "No template files found"
COPY ./static/. /app/static/ || echo "No static files found"

EXPOSE 5001
CMD ["./main"] 