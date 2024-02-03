import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Auth/Login";
import Upload from "./components/Upload";
import Signup from "./pages/Auth/Signup";
import Parameters  from "./components/Parameters";
import CopyUpload from "./components/CopyUpload";
import Heatmap from "./components/Heatmap";
export const Router = () => {
    return (
        <>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path='/upload' element={<Upload/>}/>
                <Route path='copyupload' element={<CopyUpload/>}/>
                <Route path="/signup" element={<Signup />} />
                <Route path="/parameters" element={<Parameters/>}/>
                <Route path="/dashboard" element={<Heatmap />} />
            </Routes>
        </>
    );
};