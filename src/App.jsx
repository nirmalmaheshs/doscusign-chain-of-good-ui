import { useEffect, useState } from "react";
import "./App.css";
import LandingPage from "./components/Landing";
import { Dashboard } from "./components/Dashboard";
import { Route, Routes, useNavigate, useSearchParams } from "react-router-dom";
import { handleDocuSignAuthCode } from "./lib/auth";
import axios from "axios";

function App() {
  const [searchParams] = useSearchParams();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const code = searchParams.get("code");
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("access_token")) {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (code) {
      getTokens();
    }
  }, [code]);

  const getTokens = async () => {
    try {
      const authentication = await handleDocuSignAuthCode(
        code,
        localStorage.getItem("code_verifier")
      );
      localStorage.setItem("access_token", authentication.access_token);
      localStorage.setItem("refresh_token", authentication.refresh_token);
      await getDocuSignUserInfo(authentication.access_token);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Authentication error:", error);
      // Handle error appropriately
    }
  };

  const getDocuSignUserInfo = async (accessToken) => {
    const response = await axios.get(
      "https://account-d.docusign.com/oauth/userinfo",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    localStorage.setItem("email", response.data.email);
    localStorage.setItem("full_name", response.data.name);
  };

  // Add a new useEffect to handle navigation after authentication
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={!isAuthenticated ? <LandingPage /> : <Dashboard />}
        />
      </Routes>
    </>
  );
}

export default App;
