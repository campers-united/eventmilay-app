import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Providers } from "./app/providers";
import AppLayout from "./layouts/AppLayout";
import IndexPage from "./pages/Index";
import EventPage from "./pages/EventPage";
import PlanningPage from "./pages/PlanningPage";
import LivePage from "./pages/LivePage";
import RoomsPage from "./pages/RoomsPage";
import SessionDetailPage from "./pages/SessionDetailPage";
import SpeakersPage from "./pages/SpeakersPage";
import SpeakerDetailPage from "./pages/SpeakerDetailPage";
import FavoritesPage from "./pages/FavoritesPage";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Providers>
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<IndexPage />} />
            <Route path="/events/:eventId" element={<EventPage />} />
            <Route path="/events/:eventId/planning" element={<PlanningPage />} />
            <Route path="/live" element={<LivePage />} />
            <Route path="/rooms" element={<RoomsPage />} />
            <Route path="/sessions/:sessionId" element={<SessionDetailPage />} />
            <Route path="/speakers" element={<SpeakersPage />} />
            <Route path="/speakers/:speakerId" element={<SpeakerDetailPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </Providers>
  );
}
