FROM python:3.12.4

EXPOSE 8081

WORKDIR /blogifpe

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

RUN python manage.py makemigrations

CMD ["python", "manage.py", "runserver", "0.0.0.0:8081"]