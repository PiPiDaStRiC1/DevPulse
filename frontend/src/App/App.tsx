import { Routes, Route, useLocation } from "react-router-dom";
import { Header, Main, Footer } from "@/components/layout";
import { Feed, Explore, Whispers, Auth, AuthModal, NotFound, Profile } from "@/pages";
import { ScrollToTop } from "@/lib/utils";
import { Toaster } from "react-hot-toast";

// ToDo:
// WebSocket — последним (только когда REST работает)
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
            <Toaster position="top-center" />
            <Header />
            <ScrollToTop />
            <Routes location={state?.background || location}>
                <Route element={<Main />}>
                    <Route path="/" index element={<Feed />} />
                    <Route path="/explore" element={<Explore />} />
                    <Route path="/whispers" element={<Whispers />} />
                    <Route path="/profile" element={<Profile />} />
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
