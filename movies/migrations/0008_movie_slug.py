# Generated by Django 4.2.5 on 2023-10-18 08:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('movies', '0007_movie_youtube_trailer_url'),
    ]

    operations = [
        migrations.AddField(
            model_name='movie',
            name='slug',
            field=models.SlugField(blank=True, default='', max_length=255),
        ),
    ]
