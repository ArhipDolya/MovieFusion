# Generated by Django 4.2.5 on 2023-10-18 08:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('movies', '0008_movie_slug'),
    ]

    operations = [
        migrations.AlterField(
            model_name='movie',
            name='slug',
            field=models.SlugField(max_length=255, unique=True),
        ),
    ]
