import { HashRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Dock from './components/Dock';
import FocusOverlay from './components/FocusOverlay';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/widget" element={<Dock />} />
        <Route path="/overlay" element={<FocusOverlay />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
