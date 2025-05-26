from datetime import datetime
from django.db import models
from django.contrib.auth.models import User
from categories.models import Category
import mongoengine as me

# Create your models here.
class Post(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=200, null=False)
    body = models.TextField(null=False)
    slug = models.SlugField(max_length=200, null=False, unique=True) #slug é um campo que armazena uma versão amigável do título
    category = models.ForeignKey(Category, on_delete=models.DO_NOTHING, null=True, blank=True)
    image = models.ImageField(upload_to='static/', null=True, blank=True)
    pub_date = models.DateTimeField(auto_now_add=True)
    update_date = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.title
    
class Comment(me.Document):
    post = me.IntField(required=True)
    author = me.StringField(max_length=100, required=True)
    body = me.StringField(required=True)
    pub_date = me.DateTimeField(required=True, default=datetime.utcnow)

    meta = {'collection': 'comments', 'ordering': ['-pub_date']}

    def __str__(self):
        return f'Comment by {self.author} on {self.post.title}'
