import { Route, Routes } from "react-router";
import { RegisterPage } from "./pages/Register";
import { LoginPage } from "./pages/Login";
import HomePage from "./pages/Home";
import AuthProtect from "./components/AuthProtect";
import LoanForm from "./pages/LoanForm";
import { ProtectPage } from "./components/ProtectPage";
import Profile from "./pages/Profile";
import AuthProvider from "./lib/auth";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/profile"
          element={
            <ProtectPage>
              <Profile />
            </ProtectPage>
          }
        />
        <Route
          path="/loan"
          element={
            <ProtectPage>
              <LoanForm />
            </ProtectPage>
          }
        />
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
    </AuthProvider>
  );
}

export default App;
