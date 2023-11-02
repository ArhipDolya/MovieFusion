from django.contrib.auth import get_user_model

from rest_framework import serializers
from rest_framework.validators import UniqueValidator

from .services_authentication import UserService

from .models import Comment


User = get_user_model()


class RegistrationSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all())]
    )
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'password2')
        extra_kwargs = {'password': {'write_only': True}}

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError('Passwords do not match.')
        return data

    def create(self, validation_data):
        username = validation_data['username']
        email = validation_data['email']
        password = validation_data['password']

        # Call the UserService method to register the user
        user = UserService.register_user(username, email, password)

        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        token = UserService.login_user(email, password)

        if token:
            return {'email': email, 'password': password, 'token': token}
        else:
            raise serializers.ValidationError('Invalid email or password.')


class CommentSerializer(serializers.ModelSerializer):
    author = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ['id', 'author', 'movie', 'text', 'created_at']

    def get_author(self, obj):
        return obj.author.username