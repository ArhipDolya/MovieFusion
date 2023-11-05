from django.db.models import Avg

from celery import shared_task


@shared_task
def calculate_average_rating(movie_id):
    from .models import Movie, Rating
    
    movie = Movie.objects.get(id=movie_id)
    average_rating = Rating.objects.filter(movie=movie).aggregate(Avg('rating'))['rating__avg'] or 0

    return average_rating