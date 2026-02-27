
import React from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import DaeExtensionPage from "./pages/DaeExtensionPage";
import Welcome from "./pages/Welcome";
import TokenExchange from "./pages/TokenExchange";
import TokenPage from "./pages/TokenPage";
import AdaptiveMfaPage from "./pages/AdaptiveMfaPage";
import LogStreamsPage from "./pages/LogStreamsPage";
import SAMLIdpInitiatedPage from "./pages/SAMLIdpInitiatedPage";
import ActionsPage from "./pages/ActionsPage";
import FormsPage from "./pages/FormsPage";
import OrganizationPage from "./pages/OrganizationPage";
import SettingsPage from "./pages/SettingsPage";
// import OrganizationPage from "./OrganizationPage";

const App = () => {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg-primary)" }}>
      <Sidebar />
      <main
        style={{
          flex: 1,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          justifyContent: "flex-start",
          boxSizing: "border-box",
          marginLeft: 220,
          padding: "2rem 1rem",
          background: "var(--bg-primary)",
        }}
      >
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/token-exchange" element={<TokenExchange />} />
          <Route path="/token" element={<TokenPage />} />
          <Route path="/adaptive-mfa" element={<AdaptiveMfaPage />} />
          <Route path="/log-streams" element={<LogStreamsPage />} />
          <Route path="/saml-idp-initiated" element={<SAMLIdpInitiatedPage />} />
          {/* <Route path="/organization" element={<OrganizationPage />} /> */}
          <Route path="/actions" element={<ActionsPage />} />
          <Route path="/forms" element={<FormsPage />} />
          <Route path="/organization" element={<OrganizationPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/dae-extension" element={<DaeExtensionPage />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;