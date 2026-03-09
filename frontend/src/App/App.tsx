import { Routes, Route } from "react-router-dom";
import { Header, Main, Footer } from "@/components/layout";
import { Feed, Explore } from "@/pages";
import { currentUser } from "@/lib/constants/mockData";

// ToDo:
// 1) сделать отправку сообщений на сервер

function App() {
    return (
        <>
            <Header currentUser={currentUser} />
            <Routes>
                <Route element={<Main />}>
                    <Route path="/" element={<Feed />} />
                    <Route path="/explore" element={<Explore />} />
                </Route>
            </Routes>
            <Footer />
        </>
    );
}

export default App;
