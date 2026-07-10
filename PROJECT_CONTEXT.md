# DevPulse Project Context

Состояние на 2026-07-05.

## Кратко о проекте

DevPulse — это full-stack web-приложение в формате социальной/контентной платформы для публикации постов, чтения технических материалов, взаимодействия с авторами и общения в реальном времени. По структуре и набору страниц проект выглядит как продукт на стыке dev-community, feed-платформы и knowledge sharing.

Главная идея: пользователь публикует посты с текстом, изображениями, кодовыми фрагментами, тегами и tech stack, читает ленту, изучает страницу поста, сохраняет закладки, ставит лайки, подписывается на авторов, общается в чатах и исследует тематический контент через explore/trending.

## Что уже есть в продукте

### Пользовательские сценарии

- Регистрация и авторизация.
- Просмотр feed с фильтрацией и трендовыми блоками.
- Просмотр полной страницы поста.
- Создание и редактирование постов через composer/modal.
- Лайки, комментарии, закладки, репост-логика.
- Просмотр профиля пользователя и собственного профиля.
- Подписки и список followers/following.
- Чаты 1:1 с realtime-сообщениями, статусами прочтения и онлайн/typing-индикаторами.
- Страница bookmarks.
- Explore-раздел с темами, трендовыми постами и trending topics.
- Страница по конкретному тегу.
- AI/объясняющие сценарии вокруг постов и материалов.

### Основные фронтенд-экраны

- Feed.
- PostInfo.
- Explore.
- ExploreInfo.
- Bookmarks.
- ChatRoom.
- NewChatRoom.
- Whispers.
- Auth.
- AuthModal.
- MyProfile.
- UserProfile.
- PostComposerModal.
- NotFound.

### Основные backend-роуты

- auth.
- user.
- posts.
- explore.
- chat.
- bookmarks.

## Технический стек

### Root workspace

- npm workspaces: backend, frontend, shared.
- TypeScript везде.
- concurrently для параллельного запуска backend и frontend.

### Backend

- Express 5.
- Prisma 7.
- SQLite.
- better-sqlite3 adapter.
- Socket.io для realtime.
- bcrypt для паролей.
- jsonwebtoken для auth.
- zod для валидации.
- tsx watch для dev-режима.

### Frontend

- React 19.
- Vite.
- React Router DOM 7.
- TanStack React Query.
- Zustand.
- Socket.io client.
- react-hook-form + resolvers.
- react-markdown, rehype-slug, remark-gfm, remark-breaks для рендера markdown.
- react-hot-toast для уведомлений.
- lucide-react для иконок.
- Tailwind v4 tooling через @tailwindcss/vite.
- ESLint + typescript-eslint.

### Shared

- zod-схемы и общие типы для согласования frontend и backend.

## Модель данных и предметная область

### Пользователь

User хранит username, handle, email, avatar, password, bio, role, isVerified и createdAt.

Связи:

- posts.
- likes.
- bookmarks.
- comments.
- messages.
- chatsInitiated.
- chatsAsCollocutor.
- participants.
- followers.
- following.

### Пост

Post содержит title, content, excerpt, coverImage, image, authorId, createdAt, isReposted и reposts.

Связи:

- author.
- tags через PostTag.
- techStack через TechStack.
- likes.
- comments.
- bookmarks.
- codeSnippet.

### Комментарии и код

- PostComment: комментарии к постам с автором и датой создания.
- CodeSnippet: один code snippet на пост, с language и code.

### Теги и tech stack

- Tag имеет name, slug и createdAt.
- PostTag связывает пост и тег через many-to-many.
- TechStack хранит набор технологий, прикреплённых к посту.

### Социальные связи

- Like: уникальный лайк пользователя на пост.
- Bookmark: уникальная закладка пользователя на пост.
- Follow: подписка follower -> following.

### Чаты и сообщения

- Chat: диалог между user и collocutor.
- Message: текст сообщения, sender, chat, createdAt, seen.
- ChatParticipant: участники чата с lastReadAt и уникальной парой chatId + userId.

## Рельсы поведения продукта

### Feed и контент

Проект явно эволюционирует вокруг ленты постов и страницы PostInfo. Важные блоки, которые уже есть или недавно усиливались:

- фильтрация feed.
- трендовые посты.
- темы и trending topics.
- related posts sidebar.
- таблица содержания / tree of content для поста.
- breadcrumbs или основанная на headings навигация в PostInfo.

### Post interaction

- лайки работают.
- комментарии работают и обновляются realtime.
- закладки вынесены в отдельную страницу.
- ссылка на пост умеет копироваться для шаринга.

### Chat / messaging

Realtime-сегмент очень развит:

- websocket-подключение к чату.
- обновление статусов сообщений.
- unread/read marks.
- pending status на основе optimisticId.
- typing status.
- online status в списке whisper-чата и профилях.
- исправлялась логика первого сообщения в новом чате и подсчёт unread.

## История последних решенных задач

Ниже — наиболее свежие изменения, которые полезно держать в голове новой сессии:

- Добавлена страница по конкретному тегу и улучшен UI post card.
- Добавлен trending section для Feed.
- Добавлены trending posts и topics на explore page.
- Добавлен API для topics в explore page и улучшена bookmarks page.
- Добавлена bookmarks page и улучшен excerpt для поста.
- Добавлен related posts sidebar.
- Добавлен nested tree of content для поста.
- Добавлена table of headings в PostInfo.
- Добавлен API для bookmarks постов.
- Добавлено копирование URL для шаринга постов.
- Добавлена фильтрация feed.
- Добавлено realtime-обновление счётчика комментариев.
- Добавлен websocket для публикации комментариев.
- Добавлен API для комментариев к постам.
- Добавлен comments section для поста.
- Добавлена рабочая логика лайков.
- Добавлена PostInfo page.
- Улучшен post editor и изменена видимость поста на Feed.
- Добавлены online/typing статусы для chats list и профилей.
- Добавлен pending status для сообщений через optimisticId.
- Исправлена отправка первого сообщения в новом чате, которая неверно считала unread messages.
- Добавлен typing status для чатов.
- Добавлен real-time UI status соединения с чатом.
- Добавлено полное realtime-обновление статуса сообщений в чатах.
- Добавлены unread/read marks для сообщений.
- Добавлена логика mark unread messages in chat.
- Добавлена страница Bookmarks и улучшено отображение markdown headings.
- Добавлены bookmarks API и related post utilities.
- Добавлена nested content navigation внутри поста.

## Что написано в текущем README как ближайшие задачи

В README прямо отмечены следующие направления:

- Интернационализация, пока русский и английский.
- Возможность объяснения кода с помощью нейросети, как на Habr.
- Поведение чата: при прокрутке окна с чатом вверх нужна перезагрузка страницы, как аналог свайпа вниз на мобилке.

## Вероятные следующие шаги по продукту

Это не жёсткий roadmap, а аккуратная интерпретация текущего направления проекта:

- Довести i18n до полноценной архитектуры переводов.
- Развить AI-помощника для объяснения кода и постов, возможно с контекстом по кодовому фрагменту, heading tree и related posts.
- Доработать mobile-friendly поведение чатов и общий UX realtime-сценариев.
- Усилить рекомендации и discovery в feed/explore.
- Улучшить структуру постов: редактор, превью, вложенные медиа, code snippet, навигация по содержанию.
- Расширить social graph: подписки, профили, рекомендации, уведомления.
- Довести единый слой shared-схем и типов между backend и frontend.

## Как запускать проект

Из root:

- npm run dev:backend — backend.
- npm run dev:frontend — frontend.
- npm run dev — оба сразу через concurrently.

## Полезные наблюдения для новой сессии

- Это не просто блог, а смесь dev social network, knowledge feed и realtime chat продукта.
- Много логики завязано на посты, комментарии, bookmarks, tags и trending/discovery.
- Realtime-часть чата уже достаточно зрелая, поэтому любые правки в ней нужно делать осторожно, особенно в unread/read и optimistic message flow.
- Shared-пакет важен для согласования схем и типов, чтобы frontend и backend не расходились по контрактам.
- Документации по архитектуре мало, поэтому этот файл лучше использовать как стартовую точку для любой новой AI-сессии.
