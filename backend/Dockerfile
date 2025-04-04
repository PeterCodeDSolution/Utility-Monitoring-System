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

# Copy any necessary static files or configurations
COPY ./config ./config
COPY ./templates ./templates
COPY ./static ./static

EXPOSE 5001
CMD ["./main"] 