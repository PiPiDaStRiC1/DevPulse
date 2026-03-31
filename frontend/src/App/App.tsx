import { Routes, Route, useLocation } from "react-router-dom";
import { Header, Main, Footer } from "@/components/layout";
import { Feed, Explore, Whispers, Auth, AuthModal, NotFound } from "@/pages";
import { ScrollToTop } from "@/lib/utils";

// ToDo:
// 1) сделать отправку сообщений на сервер

// С чего начать — план по нарастанию сложности:

// 1. База данных + модели (проще всего, не требует HTTP)
// Выбери стек — для TypeScript проector — практично взять PostgreSQL + Prisma. Просто объявляешь модели User, Post, Follow в schema.prisma, запускаешь prisma migrate dev. Это полностью локально, без сервера.

// 2. REST API — Auth (независим от всего остального)
// POST /auth/register, POST /auth/login → возвращают JWT. Здесь же пишешь middleware для req.user. Тестируешь в Postman/curl — никакого фронтенда не нужно.

// 3. REST API — Posts, Follow (строится на Auth)
// GET /posts/feed, POST /posts, POST /users/:id/follow — стандартные CRUD, никакой реалтайм-магии.

// 4. Интеграция с фронтом (заменяешь mockData на fetch)
// Создаёшь api/-слой, подключаешь React Query или SWR. Замена mockData → реальные запросы. Боль здесь — CORS и обработка ошибок (401/403), но всё предсказуемо.

// 5. WebSocket — последним (только когда REST работает)
// WebSocket нужен лишь трём фичам:

// живые сообщения в Whispers (без него — refresh вручную)
// бейдж новых постов в ленте («3 new posts»)
// статус онлайн у пользователей
// Всё остальное — обычные запросы. Не трогай WS, пока не работает пункт 4 — это сэкономит много времени.

function App() {
    const location = useLocation();
    const state = location.state as { background?: Location };
    const isWhispersPage = location.pathname.includes("/whispers");

    return (
        <>
            <Header />
            <ScrollToTop />
            <Routes location={state?.background || location}>
                <Route element={<Main />}>
                    <Route path="/" index element={<Feed />} />
                    <Route path="/explore" element={<Explore />} />
                    <Route path="/whispers" element={<Whispers />} />
                    <Route path="*" element={<NotFound />} />
                    {!state?.background && <Route path="/auth" element={<Auth />} />}
                </Route>
            </Routes>
            {!isWhispersPage && <Footer />}
            {state?.background && (
                <Routes>
                    <Route path="/auth" element={<AuthModal />} />
                </Routes>
            )}
        </>
    );
}

export default App;
