# Generated by Django 3.2.25 on 2025-05-15 01:24

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('posts', '0006_remove_post_category'),
        ('categories', '0002_alter_category_id'),
    ]

    operations = [
        migrations.DeleteModel(
            name='Category',
        ),
    ]
