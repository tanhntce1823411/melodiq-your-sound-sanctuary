import { Routes, Route } from "react-router-dom";
import { PlayerProvider } from "@/contexts/PlayerContext";
import BottomNav from "@/components/BottomNav";
import NowPlayingBar from "@/components/NowPlayingBar";
import HomePage from "@/pages/HomePage";
import SearchPage from "@/pages/SearchPage";
import LibraryPage from "@/pages/LibraryPage";
import ProfilePage from "@/pages/ProfilePage";
import AuthPage from "@/pages/AuthPage";
import ResetPasswordPage from "@/pages/ResetPasswordPage";

export default function Index() {
  return (
    <PlayerProvider>
      <div className="relative min-h-screen bg-background">
        <Routes>
          <Route index element={<HomePage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="library" element={<LibraryPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="auth" element={<AuthPage />} />
          <Route path="reset-password" element={<ResetPasswordPage />} />
        </Routes>
        <NowPlayingBar />
        <BottomNav />
      </div>
    </PlayerProvider>
  );
}
