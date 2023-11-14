# movies/tests/test_services.py
from django.test import TestCase
from django.contrib.auth.models import User

from .models import Movie, FavoriteMovie, Rating
from .services_movies import FavoriteMovieService, RatingService


class FavoriteMovieServiceTests(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.movie = Movie.objects.create(title='Test Movie', slug='test-movie')

    def test_add_movie_to_favorites(self):
        result, data = FavoriteMovieService.add_movie_to_favorites(self.user, self.movie.slug)
        self.assertTrue(result)
        self.assertIsInstance(data, FavoriteMovie)

        # Try adding the same movie again
        result, message = FavoriteMovieService.add_movie_to_favorites(self.user, self.movie.slug)
        self.assertFalse(result)
        self.assertEqual(message, 'Movie is already in favorites.')

    def test_remove_movie_from_favorites(self):
        # Add the movie to favorites first
        FavoriteMovie.objects.create(user=self.user, movie=self.movie)

        result, message = FavoriteMovieService.remove_movie_from_favorites(self.user, self.movie.slug)
        self.assertTrue(result)
        self.assertIsNone(message)

        # Try removing a movie not in favorites
        result, message = FavoriteMovieService.remove_movie_from_favorites(self.user, self.movie.slug)
        self.assertFalse(result)
        self.assertEqual(message, 'Movie not in favorites')

    def test_get_user_favorite_movies(self):
        FavoriteMovie.objects.create(user=self.user, movie=self.movie)

        favorite_movies = FavoriteMovieService.get_user_favorite_movies(self.user)
        self.assertEqual(len(favorite_movies), 1)
        self.assertEqual(favorite_movies[0]['movie']['slug'], self.movie.slug)


class RatingServiceTests(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.movie = Movie.objects.create(title='Test Movie', slug='test-movie')

    def test_create_or_update_rating(self):
        # Create a new rating
        result = RatingService().create_or_update_rating(self.user, self.movie.slug, '5')
        self.assertEqual(result['user'], self.user.id)
        self.assertEqual(result['movie']['slug'], self.movie.slug)
        self.assertEqual(result['rating'], '5')

        # Update the existing rating
        result = RatingService().create_or_update_rating(self.user, self.movie.slug, '4')
        self.assertEqual(result['user'], self.user.id)
        self.assertEqual(result['movie']['slug'], self.movie.slug)
        self.assertEqual(result['rating'], '4')

    def test_get_movie_ratings(self):
        Rating.objects.create(user=self.user, movie=self.movie, rating='5')

        # Cache should be empty initially
        self.assertIsNone(RatingService().get_movie_ratings(self.movie.slug))

        # Fetch ratings (caching them)
        ratings = RatingService().get_movie_ratings(self.movie.slug)
        self.assertEqual(len(ratings), 1)
        self.assertEqual(ratings[0].user, self.user)
        self.assertEqual(ratings[0].movie, self.movie)

        # Fetch ratings from cache
        cached_ratings = RatingService().get_movie_ratings(self.movie.slug)
        self.assertEqual(len(cached_ratings), 1)
        self.assertEqual(cached_ratings[0].user, self.user)
        self.assertEqual(cached_ratings[0].movie, self.movie)
