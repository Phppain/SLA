import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import Message, Chat
from django.contrib.auth import get_user_model

User = get_user_model()

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.chat_id = self.scope['url_route']['kwargs']['chat_id']
        self.room_group_name = f'chat_{self.chat_id}'

        # Подключаемся к группе чата
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        # Отключаемся от группы
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Получаем сообщение от WebSocket
    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data['message']
        user_id = self.scope["user"].id

        # Сохраняем в БД
        chat = await Chat.objects.aget(id=self.chat_id)
        sender = await User.objects.aget(id=user_id)
        msg = await Message.objects.acreate(chat=chat, sender=sender, content=message)

        # Отправляем сообщение всем в группе
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'sender': sender.username,
                'timestamp': str(msg.created_at)
            }
        )

    # Получаем сообщение из группы
    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            'message': event['message'],
            'sender': event['sender'],
            'timestamp': event['timestamp']
        }))