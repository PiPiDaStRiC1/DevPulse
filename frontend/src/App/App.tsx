import { Routes, Route, useLocation } from "react-router-dom";
import { Header, Main, Footer } from "@/components";
import {
    Feed,
    Explore,
    Whispers,
    Auth,
    AuthModal,
    NotFound,
    MyProfile,
    UserProfile,
    PostComposerModal,
    ChatRoom,
    NewChatRoom,
    PostInfo,
    Bookmarks,
} from "@/pages";
import { ProtectedRoute, PublicRoute, NewChatRoute } from "@/features";
import { ScrollToTop } from "@/lib/utils";
import { Toaster } from "react-hot-toast";
import { useAuthBootstrap, useSocketBootstrap } from "@/hooks";

// TODO on session:
// 1) Начать реализовывать коллекции для закладок
// 2) Сделай fallback для страницы bookmarks, если пользователь не зареган (done)
// 3) Отображать посты по тегам на странице Explore (done)
// 4) Убрать зеленый фон для side секции на странице /auth (done)

// ToDo:
// Пофиксить баг связанный с переходом по ссылке в дереве контента, если имеются два
// одинаковых по названию заголовка
// сделать debounce для сохранения draft для поста
// сделать фикс бага, связанного с нажатием на вкладки в header, будучи гостем
// (сейчас в таком случае фон модалки это "/" всегда, даже если находится на странице
// explore)
// позже добавить reposts для постов

// WebSocket
// пофиксить - при удалении всех сообщений приложение крашится

// JWT
// позже сделать refreshToken

function App() {
    // initial hook for "me" request at mount of App
    useAuthBootstrap();
    useSocketBootstrap();

    const location = useLocation();
    const state = location.state as { background?: Location };
    const isFooterHidden =
        location.pathname.includes("/whispers") && location.pathname.includes("/profile");

    return (
        <>
            <Toaster
                position="top-center"
                toastOptions={{
                    style: {
                        background: "var(--surface)",
                        color: "var(--text-base)",
                        border: "2px solid var(--ink)",
                        boxShadow: "4px 4px 0 var(--ink)",
                        borderRadius: "var(--radius)",
                        fontSize: "14px",
                        fontWeight: 600,
                        textAlign: "center",
                    },
                    duration: 1000,
                }}
            />
            <Header />
            <ScrollToTop />
            <Routes location={state?.background || location}>
                <Route element={<Main />}>
                    <Route path="/" index element={<Feed />} />
                    <Route path="/explore" element={<Explore />} />
                    <Route path="/whispers" element={<Whispers />}>
                        <Route
                            path="/whispers/new/:handle"
                            element={
                                <ProtectedRoute>
                                    <NewChatRoute>
                                        <NewChatRoom />
                                    </NewChatRoute>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/whispers/:id"
                            element={
                                <ProtectedRoute>
                                    <ChatRoom />
                                </ProtectedRoute>
                            }
                        />
                    </Route>
                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute>
                                <MyProfile />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/profile/:handle" element={<UserProfile />} />
                    <Route path="/posts/:postId" element={<PostInfo />} />
                    <Route path="/bookmarks" element={<Bookmarks />} />
                    {!state?.background && (
                        <Route
                            path="/editor"
                            element={
                                <ProtectedRoute>
                                    <PostComposerModal />
                                </ProtectedRoute>
                            }
                        />
                    )}
                    <Route path="*" element={<NotFound />} />
                    {!state?.background && (
                        <Route
                            path="/auth"
                            element={
                                <PublicRoute>
                                    <Auth />
                                </PublicRoute>
                            }
                        />
                    )}
                </Route>
            </Routes>
            {isFooterHidden && <Footer />}
            {state?.background && (
                <Routes>
                    <Route
                        path="/auth"
                        element={
                            <PublicRoute>
                                <AuthModal />
                            </PublicRoute>
                        }
                    />
                    <Route
                        path="/editor"
                        element={
                            <ProtectedRoute>
                                <PostComposerModal />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            )}
        </>
    );
}

export default App;
