import { Route, Routes } from "react-router-dom";
import "./App.css";

import { Toaster } from "react-hot-toast";
import Footer from "./components/Footer";
import Header from "./components/Header";
import PrivateRoutes from "./components/user/PrivateRoutes";
import LandingPage from "./pages/LandingPage";
import AllEventsPage from "./pages/AllEventsPage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import EventPage from "./pages/EventPage";
import NotFoundPage from "./pages/NotFoundPage";
import PostEventPage from "./pages/PostEventPage";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";
import CookiePage from "./pages/CookiePage";
import UserProfile from "./pages/UserProfilePage";
import SendEmailPage from "./pages/SendEmailPage";
import PageTitle from "./components/PageTitle";

function App() {
  return (
    <div className="app">
      <Toaster position="top-left" richColors />
      <PageTitle />
      <Header />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/registered" element={<SendEmailPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/cookie" element={<CookiePage />} />
        <Route path="/events" element={<AllEventsPage />} />
        <Route path="/event/:id" element={<EventPage />} />
        <Route element={<PrivateRoutes />}>
          <Route path="/postevent" element={<PostEventPage />} />
          <Route path="/user/:nickname" element={<UserProfile />} />
        </Route>
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
