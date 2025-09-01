from rest_framework import viewsets, status, filters
from .models import *
from .serializers import *
from rest_framework_simplejwt.views import TokenObtainPairView, RefreshToken
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import get_user_model
User = get_user_model()
from django.utils.http import urlsafe_base64_decode
from django.contrib.auth.tokens import default_token_generator
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from haystack.query import SearchQuerySet
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.decorators import action
from django.db.models import Count

class PostSearchView(APIView):
    def get(self, request):
        query = request.GET.get('q', '')
        if query:
            results = SearchQuerySet().filter(content=query)
            posts = [r.object for r in results if r.object]
            serializer = PostSerializer(posts, many=True)
            return Response(serializer.data)
        return Response({"detail": "No query provided."})


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    def patch(self, request):
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)


class ActivateAccountView(APIView):
    def get(self, request, uidb64, token):
        try:
            uid = urlsafe_base64_decode(uidb64).decode()
            user = User.objects.get(pk=uid)
        except (User.DoesNotExist, ValueError):
            user = None

        if user is not None and default_token_generator.check_token(user, token):
            user.is_active = True
            user.save()
            return Response({'message': 'Account succesfully activated'}, status=status.HTTP_200_OK)
        return Response({'error': 'Invalid or expired reference'}, status=status.HTTP_400_BAD_REQUEST)


class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'The letter with confirm sent to email'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    def post(self, request):
        try:
            refresh_token = request.data['refresh']
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class ProtectedView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({'msg': f'Hello, {request.user.username}!'})


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    lookup_field = 'username'
    filter_backends = [filters.SearchFilter]
    search_fields = ['username', 'email']

    @action(detail=True, methods=['get'])
    def stats(self, request, username=None):
        """
        Статистика конкретного пользователя:
        - кол-во постов
        - кол-во лайков на постах
        - кол-во подписчиков
        - кол-во подписок
        """
        user = self.get_object()

        posts_count = Post.objects.filter(author=user).count()
        likes_count = Post.objects.filter(author=user).aggregate(total=Count('likes'))['total'] or 0
        followers_count = Follow.objects.filter(following=user).count()
        following_count = Follow.objects.filter(follower=user).count()

        data = {
            "posts_count": posts_count,
            "likes_count": likes_count,
            "followers_count": followers_count,
            "following_count": following_count,
        }
        return Response(data)

    @action(detail=True, methods=['get'])
    def posts(self, request, username=None):
        """
        Получение постов пользователя с фильтрацией и сортировкой.
        Пример: /users/<username>/posts/?category=2&ordering=-created_at
        """
        user = self.get_object()
        queryset = Post.objects.filter(author=user)

        # фильтрация по категории
        category = request.query_params.get("category")
        if category:
            queryset = queryset.filter(category_id=category)

        # сортировка
        ordering = request.query_params.get("ordering")
        if ordering:
            queryset = queryset.order_by(ordering)

        serializer = PostSerializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def followers(self, request, username=None):
        """
        Список подписчиков пользователя
        Пример: /users/<username>/followers/
        """
        user = self.get_object()
        followers_qs = Follow.objects.filter(following=user).select_related("follower")
        users = [f.follower for f in followers_qs]
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def following(self, request, username=None):
        """
        Список пользователей, на которых подписан данный юзер
        Пример: /users/<username>/following/
        """
        user = self.get_object()
        following_qs = Follow.objects.filter(follower=user).select_related("following")
        users = [f.following for f in following_qs]
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def follow(self, request, username=None):
        """
        Подписка на пользователя
        Пример: POST /users/<username>/follow/
        """
        user_to_follow = self.get_object()
        if user_to_follow == request.user:
            return Response({"detail": "Нельзя подписаться на самого себя."}, status=400)

        obj, created = Follow.objects.get_or_create(
            follower=request.user,
            following=user_to_follow
        )
        if not created:
            return Response({"detail": "Вы уже подписаны."}, status=400)

        return Response({"detail": f"Вы подписались на {user_to_follow.username}."}, status=201)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def unfollow(self, request, username=None):
        """
        Отписка от пользователя
        Пример: POST /users/<username>/unfollow/
        """
        user_to_unfollow = self.get_object()
        follow_obj = Follow.objects.filter(follower=request.user, following=user_to_unfollow)

        if not follow_obj.exists():
            return Response({"detail": "Вы не подписаны."}, status=400)

        follow_obj.delete()
        return Response({"detail": f"Вы отписались от {user_to_unfollow.username}."}, status=200)


class ProfileViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter]
    search_fields = ['bio', 'location']


from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Count


class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    search_fields = ['title', 'description', 'tags__name']
    ordering_fields = ['created_at', 'likes_count']
    filterset_fields = ['category']  # ✅ фильтрация по категории через ?category=<id>

    @action(detail=False, methods=['get'])
    def stats(self, request):
        """
        Статистика для главной страницы:
        - общее кол-во постов
        - топ-5 категорий по числу постов
        - кол-во уникальных авторов
        """
        total_posts = Post.objects.count()
        total_authors = Post.objects.values('author').distinct().count()

        top_categories = (
            Post.objects.values('category__id', 'category__name')
            .annotate(count=Count('id'))
            .order_by('-count')[:5]
        )

        data = {
            "total_posts": total_posts,
            "total_authors": total_authors,
            "top_categories": top_categories,
        }
        return Response(data)

    @action(detail=True, methods=['get'])
    def user_posts(self, request, pk=None):
        """
        Получение постов конкретного пользователя с фильтрацией.
        Пример: /posts/user_posts/5/?category=2&ordering=-created_at
        """
        queryset = Post.objects.filter(author_id=pk)

        # фильтрация по категории
        category = request.query_params.get("category")
        if category:
            queryset = queryset.filter(category_id=category)

        # сортировка (created_at / likes_count)
        ordering = request.query_params.get("ordering")
        if ordering:
            queryset = queryset.order_by(ordering)

        serializer = PostSerializer(queryset, many=True)
        return Response(serializer.data)


class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['created_at']


class LikeViewSet(viewsets.ModelViewSet):
    queryset = Like.objects.all()
    serializer_class = LikeSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


class FollowViewSet(viewsets.ModelViewSet):
    queryset = Follow.objects.all()
    serializer_class = FollowSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name']


class PostTagViewSet(viewsets.ModelViewSet):
    queryset = PostTag.objects.all()
    serializer_class = PostTagSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
