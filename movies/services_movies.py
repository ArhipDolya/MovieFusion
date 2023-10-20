from .models import Rating


def get_movie_ratings(movie_slug):
    ratings = Rating.objects.filter(movie__slug=movie_slug)
    return ratings