from django.db import models


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
        category (ForeignKey to Category): The category to which the movie belongs.
    """

    title = models.CharField(max_length=255)
    description = models.TextField()
    image = models.ImageField(upload_to='movie_images/')
    release_date = models.DateField()
    category = models.ForeignKey(Category, on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.title}'


class Rating(models.Model):
    """
    Model representing a movie rating.

    Attributes:
        movie (ForeignKey to Movie): The movie for which the rating is given.
        rating (DecimalField): The rating given to the movie.
    """

    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)
    rating = models.DecimalField(max_digits=3, decimal_places=1)

    def __str__(self):
        return f'Rating for {self.movie.title} by {self.user.username}'