import { Routes, Route, useLocation } from "react-router-dom";
import { Header, Main, Footer } from "@/components";
import {
    Feed,
    Explore,
    Whispers,
    Auth,
    AuthModal,
    NotFound,
    Profile,
    PostComposerModal,
} from "@/pages";
import { ProtectedRoute, PublicRoute } from "@/features";
import { ScrollToTop } from "@/lib/utils";
import { Toaster } from "react-hot-toast";
import { useAuthBootstrap, useSocketBootstrap } from "@/hooks";

// ToDo:
// сделать debounce для сохранения draft для поста
// сделать фикс бага, связанного с нажатием на вкладки в header, будучи гостем
// (сейчас в таком случае фон модалки это "/" всегда, даже если находится на странице
// explore)

// позже сделать refreshToken

// WebSocket — последним (только когда REST работает)
// WebSocket нужен лишь трём фичам:

// живые сообщения в Whispers (без него — refresh вручную)
// бейдж новых постов в ленте («3 new posts»)
// статус онлайн у пользователей

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
            <Toaster position="top-center" />
            <Header />
            <ScrollToTop />
            <Routes location={state?.background || location}>
                <Route element={<Main />}>
                    <Route path="/" index element={<Feed />} />
                    <Route path="/explore" element={<Explore />} />
                    <Route
                        path="/whispers"
                        element={
                            <ProtectedRoute>
                                <Whispers />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute>
                                <Profile />
                            </ProtectedRoute>
                        }
                    />
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
