from django.contrib import admin

from .models import Category, Movie, Rating, FavoriteMovie


admin.site.register(Category)
admin.site.register(Movie)
admin.site.register(Rating)
admin.site.register(FavoriteMovie)