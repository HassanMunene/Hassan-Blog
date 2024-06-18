import {BrowserRouter, Routes, Route} from "react-router-dom";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import About from "./pages/About";
import Dashboard from "./pages/Dashboard";
import Header from "./components/Header";
import FooterComponent from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";
import ScrollToTop from "./components/ScrollToTop";
import OnlyAdminPrivateRoute from "./components/OnlyAdminPrivateRoute";
import CreatePost from "./pages/CreatePost";
import UpdatePost from "./pages/UpdatePost";
import PostPage from "./pages/PostPage";

function App() {
    return (
        <BrowserRouter>
            <ScrollToTop />
            <Header />
            <Routes>
                <Route path="/" element={<Home />}/>
                <Route path="/signin" element={<Signin />}/>
                <Route path="/signup" element={< Signup/>}/>
                <Route path="/About" element={<About/>}/>
                <Route path="/projects" element={<Projects/>}/>
                <Route path="/post/:postSlug" element={<PostPage />}/>
                <Route element={<PrivateRoute />}>
                    <Route path="/dashboard" element={<Dashboard/>}/>
                </Route>
                <Route element={<OnlyAdminPrivateRoute />}>
                    <Route path="/create-post" element={<CreatePost/>}/>
                    <Route path="/update-post/:postId" element={<UpdatePost/>}/>
                </Route>
            </Routes>
            <FooterComponent />
        </BrowserRouter>
    )
}

export default App;
