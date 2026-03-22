import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import SlokaList from './pages/SlokaList';
import SlokaView from './pages/SlokaView';
import ChaptersPage from './pages/ChaptersPage';
import ThemePage from './pages/ThemePage';
import ThemesPage from './pages/ThemesPage';

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/slokas" element={<SlokaList />} />
            <Route path="/sloka/:id" element={<SlokaView />} />
            <Route path="/chapter/:chapterNum" element={<SlokaList />} />
            <Route path="/chapters" element={<ChaptersPage />} />
            <Route path="/theme/:themeName" element={<ThemePage />} />
            <Route path="/themes" element={<ThemesPage />} />
            <Route path="*" element={
              <div className="text-center py-20 font-telugu text-text-muted">
                <p className="text-6xl mb-4">🪷</p>
                <p className="text-xl">పేజీ దొరకలేదు</p>
                <Link to="/" className="text-primary underline mt-2 block">ముఖపుటానికి వెళ్ళండి</Link>
              </div>
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </AppProvider>
  );
}
