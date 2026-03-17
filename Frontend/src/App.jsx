import { Route, Routes } from "react-router";
import { RegisterPage } from "./pages/Register";
import { LoginPage } from "./pages/Login";
import HomePage from "./pages/Home";
import AuthProtect from "./components/AuthProtect";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/" element={<HomePage />} />
      <Route
        path="/register"
        element={
          <AuthProtect>
            <RegisterPage />
          </AuthProtect>
        }
      />
      <Route
        path="/login"
        element={
          <AuthProtect>
            <LoginPage />
          </AuthProtect>
        }
      />
    </Routes>
  );
}

export default App;
