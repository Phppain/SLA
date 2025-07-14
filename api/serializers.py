from rest_framework import serializers
from .models import *
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from django.contrib.auth import get_user_model
User = get_user_model()
from django.contrib.sites.shortcuts import get_current_site
from django.urls import reverse
from django.core.mail import send_mail
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.contrib.auth.tokens import default_token_generator

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        user.is_active = False
        user.save()

        request = self.context.get('request')
        current_site = get_current_site(request)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)

        activation_link = f"http://{current_site.domain}/api/activate/{uid}/{token}/"

        send_mail(
            subject='Подтверждение регистрации',
            message=f'Перейдите по ссылке для активации аккаунта: {activation_link}',
            from_email=None,
            recipient_list=[user.email],
        )

        return user


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    MyTokenObtainPair Serializer

        Add custom fields
    """
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Добавь кастомные поля
        token['username'] = user.username
        token['email'] = user.email
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data['username'] = self.user.username
        data['email'] = self.user.email
        return data


class UserSerializer(serializers.ModelSerializer):
    """
    User Serializer
    
        Serialize data of User's model
    """
    class Meta:
        model=User
        fields = '__all__'


class ProfileSerializer(serializers.ModelSerializer):
    """
    Profile Serializer

        Serialize data of Profile's model
    """
    class Meta:
        model=Profile
        fields = '__all__'


class PostSerializer(serializers.ModelSerializer):
    """
    Post Serializer

        Serialize data of Post's model
    """
    class Meta:
        model=Post
        fields = '__all__'


class CommentSerializer(serializers.ModelSerializer):
    """
    Comment Serializer

        Serialize data of Comment's model
    """
    class Meta:
        model=Comment
        fields = '__all__'


class LikeSerializer(serializers.ModelSerializer):
    """
    Like Serializer

        Serialize data of Like's model
    """
    class Meta:
        model=Like
        fields = '__all__'


class FollowSerializer(serializers.ModelSerializer):
    """
    Follow Serializer

        Serialize data of Follow's model
    """
    class Meta:
        model=Follow
        fields = '__all__'


class TagSerializer(serializers.ModelSerializer):
    """
    Tag Serializer

        Serialize data of Tag's model
    """
    class Meta:
        model=Tag
        fields = '__all__'


class PostTagSerializer(serializers.ModelSerializer):
    """
    PostTag Serializer

        Serialize data of PostTag's model
    """
    class Meta:
        model=PostTag
        fields = '__all__'
