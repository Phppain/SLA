from haystack import indexes
from .models import Post

class PostIndex(indexes.SearchIndex, indexes.Indexable):
    text = indexes.CharField(document=True, use_template=True)
    content = indexes.CharField(model_attr='content')
    created_at = indexes.DateTimeField(model_attr='created_at')

    def get_model(self):
        return Post