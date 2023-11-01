from django.contrib import admin

from .models import User, Comment

admin.site.register(User)
admin.site.register(Comment)