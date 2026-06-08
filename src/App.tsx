import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainScene from '@/pages/MainScene';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainScene />} />
        <Route path="/nav" element={<MainScene />} />
        <Route path="/patrol" element={<MainScene />} />
      </Routes>
    </Router>
  );
}
