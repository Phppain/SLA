from rest_framework import serializers
from .models import *

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
