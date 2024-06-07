import {BrowserRouter, Routes, Route} from "react-router-dom";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import About from "./pages/About";
import Dashboard from "./pages/Dashboard";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />}/>
                <Route path="/signin" element={<Signin />}/>
                <Route path="/signup" element={< Signup/>}/>
                <Route path="/About" element={<About/>}/>
                <Route path="/projects" element={<Projects/>}/>
                <Route path="/dashboard" element={<Dashboard/>}/>
            </Routes>
        </BrowserRouter>
    )
}

export default App;
