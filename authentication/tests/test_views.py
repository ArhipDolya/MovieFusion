from django.test import TestCase
from rest_framework.test import APIClient, APITestCase
from rest_framework import status

from ..models import User

class RegistrationViewTest(TestCase):

    def setUp(self):
        self.client = APIClient()
        self.registration_url = '/api/v1/register/'

    def test_successful_registration(self):
        data = {
            'username': 'testuser',
            'email': 'testuser@example.com',
            'password': 'testpassword',
            'password2': 'testpassword',
        }

        response = self.client.post(self.registration_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 1)

        user = User.objects.get()

        self.assertEqual(user.username, 'testuser')
        self.assertEqual(user.email, 'testuser@example.com')

    def test_registration_failure(self):
        # Test registration failure with missing required field
        data = {
            'username': 'testuser',
            'password': 'testpassword',
        }

        response = self.client.post(self.registration_url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(User.objects.count(), 0)


class LoginViewTest(APITestCase):

    def setUp(self):
        self.user = User.objects.create(
            email='testuser@example.com',
            password='testpassword'
        )
        self.login_url = '/api/v1/login/'

    def test_missing_email_field(self):
        data = {
            'password': 'testpassword',
        }

        response = self.client.post(self.login_url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email', response.data)

    def test_missing_password_field(self):
        data = {
            'email': 'testuser@example.com',
        }

        response = self.client.post(self.login_url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('password', response.data)

