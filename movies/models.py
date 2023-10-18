from django.db import models
from django.contrib.auth import get_user_model
from django.utils.text import slugify

User = get_user_model()


class Category(models.Model):
    """
    Model representing a movie category

    Attributes:
        name (CharField): The name of the category.
    """

    name = models.CharField(max_length=100)

    def __str__(self):
        return f'{self.name}'


class Movie(models.Model):
    """
    Model representing a movie

    Attributes:
        title (CharField): The title of the movie.
        description (TextField): A detailed description of the movie.
        image (ImageField): An image representing the movie.
        release_date (DateField): The release date of the movie.
        categories (ManyToManyField to Category): The categories to which the movie belongs.
        director (CharField, optional): The director of the movie.
        writers (CharField, optional): The writers of the movie.
        actors (CharField, optional): The actors in the movie.
        youtube_trailer_url (URLFIeld, optional): The movie trailer
    """

    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, db_index=True)
    description = models.TextField()
    image = models.ImageField(upload_to='movie_images/')
    release_date = models.DateField()
    director = models.CharField(max_length=64, null=True)
    writers = models.CharField(max_length=128, null=True)
    actors = models.CharField(max_length=256, null=True)
    categories = models.ManyToManyField(Category, related_name='movies')
    youtube_trailer_url = models.URLField(max_length=250, null=True, blank=True)

    def __str__(self):
        return f'{self.title}'


class Rating(models.Model):
    """
    Model representing a movie rating.

    Attributes:
        movie (OneToOneField to Movie): The movie for which the rating is given.
        rating (DecimalField): The rating given to the movie.
    """

    user = models.ForeignKey(User, on_delete=models.CASCADE, default=None)
    movie = models.OneToOneField(Movie, on_delete=models.CASCADE, related_name='rating')
    rating = models.DecimalField(max_digits=3, decimal_places=1)

    def __str__(self):
        return f'Rating for {self.movie.title} by {self.user.username}'