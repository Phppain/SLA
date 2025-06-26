from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from api.models import Profile, Post, Comment, Like, Follow, Tag

from faker import Faker
import random

User = get_user_model()
fake = Faker()

class Command(BaseCommand):
    help = 'Заполняет базу тестовыми данными'

    def handle(self, *args, **kwargs):
        self.stdout.write("Создание пользователей...")
        users = []
        for _ in range(5):
            user = User.objects.create_user(
                username=fake.user_name(),
                email=fake.email(),
                password="password123"
            )
            Profile.objects.create(
                user=user,
                full_name=fake.name(),
                bio=fake.text(),
                avatar=fake.image_url()
            )
            users.append(user)
        
        self.stdout.write("Создание тегов...")
        tag_names = ['coding', 'django', 'fun', 'life', 'dev']
        tags = [Tag.objects.create(name=name) for name in tag_names]

        self.stdout.write("Создание постов...")
        posts = []
        for user in users:
            for _ in range(random.randint(1, 3)):
                post = Post.objects.create(
                    author=user,
                    content=fake.text(),
                    image=fake.image_url()
                )
                post.tags.set(random.sample(tags, k=random.randint(1, 3)))
                posts.append(post)

        self.stdout.write("Создание комментариев и лайков...")
        for post in posts:
            for _ in range(random.randint(1, 3)):
                Comment.objects.create(
                    post=post,
                    author=random.choice(users),
                    content=fake.sentence()
                )
                Like.objects.get_or_create(
                    post=post,
                    user=random.choice(users)
                )

        self.stdout.write("Создание подписок...")
        for follower in users:
            followees = random.sample([u for u in users if u != follower], k=random.randint(1, 3))
            for followee in followees:
                Follow.objects.get_or_create(follower=follower, following=followee)

        self.stdout.write(self.style.SUCCESS("✅ База успешно заполнена тестовыми данными."))