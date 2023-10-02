import logging

from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status

from .serializers import RegistrationSerializer, LoginSerializer


logger = logging.getLogger(__name__)


class RegistrationView(generics.CreateAPIView):
    serializer_class = RegistrationSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            serializer.save()

            # Log a successful registration
            logger.info(f"User registered successfully: {serializer.validated_data['username']}")

            return Response({'message': 'User registered successfully'}, status=status.HTTP_201_CREATED)

        # Log a registration failure
        logger.error(f"Registration failed: {serializer.errors}")

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(generics.CreateAPIView):
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            # Log a successful login
            logger.info(f"User logged in successfully: {serializer.validated_data['email']}")

            return Response(serializer.validated_data, status=status.HTTP_200_OK)

        # Log a login failure
        logger.error("Login failed")

        return Response(serializer.errors, status=status.HTTP_401_UNAUTHORIZED)

