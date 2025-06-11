import smtplib

import ssl

from email.message import EmailMessage

import pika

import json

import os


def send_email(mensagem):
    
    data = json.loads(mensagem)
    
    username = data.get('username')
    
    message = EmailMessage()
    message.set_content(f'Welcome to our community, {username}! 🕊️' )
    message['Subject'] = 'Welcome to Wing Bytes'
    message['From'] = 'wingbyteso@gmail.com'
    message['To'] = data.get('email')
    
    
    context = ssl.create_default_context()
    with smtplib.SMTP_SSL('smtp.gmail.com', 465, context=context) as smtp:
        smtp.login('wingbytes@gmail.com', 'tyam bycb ftsg yzep')
        smtp.send_message(message)
        print("Email sent!")


def callback(ch, method, properties, body):
    mensagem = body.decode() 
    send_email(mensagem)

connection = pika.BlockingConnection(pika.ConnectionParameters('rabbitmq'))
channel = connection.channel()

channel.queue_declare(queue='email.queue')

channel.basic_consume(queue='email.queue',
                      on_message_callback=callback,
                      auto_ack=True)

channel.start_consuming()
