import { Route, Routes } from "react-router";
import { RegisterPage } from "./pages/Register";
import { LoginPage } from "./pages/Login";

function App() {
  return (
    <Routes>
      <Route path="/" />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage  />} />
    </Routes>
  );
}

export default App;
