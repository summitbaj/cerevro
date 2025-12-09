import { HashRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Widget from './components/Widget';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/widget" element={<Widget />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
