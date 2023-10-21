from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from .services_authentication import UserService

User = get_user_model()


class RegistrationTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.register_url = reverse('register')
        self.login_url = reverse('login')
        self.user_data = {
            'username': 'testuser',
            'email': 'testuser@example.com',
            'password': 'testpassword',
            'password2': 'testpassword',
        }

    def test_registration(self):
        response = self.client.post(self.register_url, self.user_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 1)


class UserServiceTests(TestCase):
    def test_register_user(self):
        username = 'testuser'
        email = 'testuser@example.com'
        password = 'testpassword'

        user = UserService.register_user(username, email, password)

        self.assertIsNotNone(user)
        self.assertEqual(user.username, username)
        self.assertEqual(user.email, email)

    def test_login_user(self):
        # First, create a user
        user = User.objects.create_user(username='testuser', email='testuser@example.com', password='testpassword')

        # Then, attempt to login
        token = UserService.login_user('testuser@example.com', 'testpassword')

        self.assertIsNotNone(token)
