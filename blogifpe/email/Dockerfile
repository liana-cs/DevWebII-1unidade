FROM python:3.8.13-alpine3.15

WORKDIR /email

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

CMD python app.py