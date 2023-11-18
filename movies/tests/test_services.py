from django.test import TestCase
from django.contrib.auth import get_user_model

from ..services_movies import FavoriteMovieService, RatingService
from ..models import Movie, FavoriteMovie, Rating


User = get_user_model()


class FavoriteMovieServiceTest(TestCase):

    def setUp(self):
        # Create a test user
        self.user = User.objects.create_user(username='testuser', password='testpassword')

        # Create a test movie
        self.movie = Movie.objects.create(
            title='Test Movie',
            slug='test-movie',
            description='Test Description',
            image='test-image.jpg',
            release_date='2023-01-01',
            director='Test Director',
            writers='Test Writer 1, Test Writer 2',
            actors='Test Actor 1, Test Actor 2',
            youtube_trailer_url='https://www.youtube.com/watch?v=test-trailer'
        )

    def test_add_movie_to_favorites(self):
        success, result = FavoriteMovieService.add_movie_to_favorites(user=self.user, movie_slug=self.movie.slug)
        self.assertTrue(success)
        self.assertIsInstance(result, FavoriteMovie)

        # Try adding the same movie again
        success, result = FavoriteMovieService.add_movie_to_favorites(user=self.user, movie_slug=self.movie.slug)
        self.assertFalse(success)
        self.assertEqual(result, 'Movie is already in favorites.')

    def test_remove_movie_from_favorites(self):
        # Add the movie to favorites first
        FavoriteMovie.objects.create(user=self.user, movie=self.movie)

        # Remove the movie from favorites
        success, result = FavoriteMovieService.remove_movie_from_favorites(user=self.user, movie_slug=self.movie.slug)
        self.assertTrue(success)
        self.assertIsNone(result)

        # Try removing the same movie again
        success, result = FavoriteMovieService.remove_movie_from_favorites(user=self.user, movie_slug=self.movie.slug)
        self.assertFalse(success)
        self.assertEqual(result, 'Movie not in favorites')

    def test_get_user_favorite_movies(self):
        # Add some movies to favorites
        movie1 = Movie.objects.create(title='Movie 1', slug='movie-1', description='Description 1', image='image1.jpg')
        movie2 = Movie.objects.create(title='Movie 2', slug='movie-2', description='Description 2', image='image2.jpg')
        FavoriteMovie.objects.create(user=self.user, movie=movie1)
        FavoriteMovie.objects.create(user=self.user, movie=movie2)

        # Get user's favorite movies
        favorite_movies = FavoriteMovieService.get_user_favorite_movies(user=self.user)

        # Ensure correct data is retrieved
        self.assertEqual(len(favorite_movies), 2)
        self.assertEqual(favorite_movies[0]['movie']['title'], 'Movie 1')
        self.assertEqual(favorite_movies[1]['movie']['title'], 'Movie 2')


class RatingServiceTest(TestCase):

    def setUp(self):
        # Create a test user
        self.user = User.objects.create_user(username='testuser', password='testpassword')

        # Create a test movie
        self.movie = Movie.objects.create(
            title='Test Movie',
            slug='test-movie',
            description='Test Description',
            image='test-image.jpg',
            release_date='2023-01-01',
            director='Test Director',
            writers='Test Writer 1, Test Writer 2',
            actors='Test Actor 1, Test Actor 2',
            youtube_trailer_url='https://www.youtube.com/watch?v=test-trailer'
        )

    def test_create_or_update_rating(self):
        # Create a rating
        rating_data = RatingService.create_or_update_rating(user=self.user, movie_slug=self.movie.slug, rating='4.5')
        self.assertIn('id', rating_data)
        self.assertEqual(rating_data['rating'], '4.5')

        # Update the rating
        updated_rating_data = RatingService.create_or_update_rating(user=self.user, movie_slug=self.movie.slug, rating='3.0')
        self.assertEqual(updated_rating_data['id'], rating_data['id'])
        self.assertEqual(updated_rating_data['rating'], '3.0')


    def test_get_movie_ratings(self):
        # Create some ratings for the movie
        Rating.objects.create(user=self.user, movie=self.movie, rating='4.5')
        Rating.objects.create(user=self.user, movie=self.movie, rating='3.0')
        Rating.objects.create(user=self.user, movie=self.movie, rating='2.5')

        # Get movie ratings
        ratings = RatingService.get_movie_ratings(movie_slug=self.movie.slug)

        # Ensure correct data is retrieved
        self.assertEqual(ratings.count(), 3)
        self.assertEqual(ratings.first().rating, '4.5')
