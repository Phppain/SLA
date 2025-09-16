
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/axios";

const initialState = {
  comments: [
    {
      id: 1,
      post: 1,
      author: { id: 1, username: "user1", avatar: null },
      content: "Отличный пин! Очень красиво!",
      created_at: "2024-01-15T10:30:00Z",
      updated_at: "2024-01-15T10:30:00Z"
    },
    {
      id: 2,
      post: 1,
      author: { id: 2, username: "user2", avatar: null },
      content: "Согласен, действительно впечатляет!",
      created_at: "2024-01-15T11:15:00Z",
      updated_at: "2024-01-15T11:15:00Z"
    },
    {
      id: 3,
      post: 2,
      author: { id: 3, username: "user3", avatar: null },
      content: "Хочу туда поехать!",
      created_at: "2024-01-14T09:20:00Z",
      updated_at: "2024-01-14T09:20:00Z"
    }
  ],
  loading: false,
  error: null,
};

// Получение комментариев для пина
export const fetchComments = createAsyncThunk(
  "interactions/fetchComments",
  async (pinId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/comments/?post=${pinId}`);
      return res.data;
    } catch (err) {
      return rejectWithValue("Ошибка при получении комментариев");
    }
  }
);

// Добавление комментария
export const addComment = createAsyncThunk(
  "interactions/addComment",
  async ({ pinId, content }, { rejectWithValue }) => {
    try {
      const res = await api.post(`/comments/`, { post: pinId, content });
      return res.data;
    } catch (err) {
      return rejectWithValue("Ошибка при добавлении комментария");
    }
  }
);

// Удаление комментария
export const deleteComment = createAsyncThunk(
  "interactions/deleteComment",
  async ({ pinId, commentId }, { rejectWithValue }) => {
    try {
      await api.delete(`/comments/${commentId}/`);
      return commentId;
    } catch (err) {
      return rejectWithValue("Ошибка при удалении комментария");
    }
  }
);

// Лайк комментария
export const likeComment = createAsyncThunk(
  "interactions/likeComment",
  async ({ commentId }, { rejectWithValue }) => {
    try {
      await api.post(`/comments/${commentId}/like/`);
      return commentId;
    } catch (err) {
      return rejectWithValue("Ошибка при лайке комментария");
    }
  }
);

// Анлайк комментария
export const unlikeComment = createAsyncThunk(
  "interactions/unlikeComment",
  async ({ commentId }, { rejectWithValue }) => {
    try {
      await api.delete(`/comments/${commentId}/like/`);
      return commentId;
    } catch (err) {
      return rejectWithValue("Ошибка при анлайке комментария");
    }
  }
);

const interactionsSlice = createSlice({
  name: "interactions",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearComments: (state) => {
      state.comments = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Получение комментариев
      .addCase(fetchComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.loading = false;
        // Фильтруем комментарии по посту (для фейковых данных)
        const postId = action.meta.arg;
        if (postId) {
          state.comments = action.payload.filter(comment => comment.post === postId);
        } else {
          state.comments = action.payload;
        }
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Добавление комментария
      .addCase(addComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.loading = false;
        // Добавляем новый комментарий в начало списка
        const newComment = {
          id: Date.now(), // Временный ID для фейковых данных
          post: action.meta.arg.pinId,
          author: { id: 1, username: "currentUser", avatar: null }, // В реальном API это будет из ответа
          content: action.meta.arg.content,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        state.comments.unshift(newComment);
      })
      .addCase(addComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Удаление комментария
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.comments = state.comments.filter(comment => comment.id !== action.payload);
      })
      // Лайк комментария
      .addCase(likeComment.fulfilled, (state, action) => {
        const comment = state.comments.find(c => c.id === action.payload);
        if (comment) {
          comment.is_liked = true;
          comment.likes_count = (comment.likes_count || 0) + 1;
        }
      })
      // Анлайк комментария
      .addCase(unlikeComment.fulfilled, (state, action) => {
        const comment = state.comments.find(c => c.id === action.payload);
        if (comment) {
          comment.is_liked = false;
          comment.likes_count = Math.max(0, (comment.likes_count || 1) - 1);
        }
      });
  },
});

export const { clearError, clearComments } = interactionsSlice.actions;
export default interactionsSlice.reducer;
