FROM python:3.8.13-alpine3.15

WORKDIR /email

RUN apk add zlib-dev jpeg-dev gcc musl-dev librdkafka-dev

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

CMD python app.py