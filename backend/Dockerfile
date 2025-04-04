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
# Using separate RUN statements to handle missing directories
RUN if [ -d "./config" ]; then cp -r ./config/* /app/config/ 2>/dev/null || true; fi
RUN if [ -d "./templates" ]; then cp -r ./templates/* /app/templates/ 2>/dev/null || true; fi
RUN if [ -d "./static" ]; then cp -r ./static/* /app/static/ 2>/dev/null || true; fi

EXPOSE 5001
CMD ["./main"] 