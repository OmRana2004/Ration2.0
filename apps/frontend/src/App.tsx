import { Routes, Route } from "react-router-dom";
import Viewer from "./pages/Viewer";
import Add from "./pages/Admin";

function App() {
  return (
    
      <Routes>
        <Route path="/" element={<Viewer />} />
        <Route path="/admin" element={<Add />} />
      </Routes>
  );
}

export default App;