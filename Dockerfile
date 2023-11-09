FROM python:3.10-alpine3.16

# Create and set the working directory
WORKDIR /app

# Copy the entire project directory into the container
COPY . /app

EXPOSE 8000

RUN apk add postgresql-client build-base postgresql-dev

RUN pip install -r requirements.txt







