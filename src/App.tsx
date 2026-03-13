import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import AuthCallback from './pages/AuthCallBack';

// Petit garde du corps pour protéger la Home
const ProtectedRoute = ({ children }: { children: React.ReactElement }) => {
  const token = localStorage.getItem('vault_token');
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  return (
    <Router>
      <div className='app'>
        <Routes>
          {/* Route publique pour l'entrée du club */}
          <Route path="/login" element={<Login />} />

          {/* Route technique pour intercepter le token de Supabase */}
          <Route path="/auth/callback" element={<AuthCallback />} />

          {/* La Home est réservée aux membres connectés */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } 
          />

          {/* Redirection par défaut si le mec se perd dans les couloirs */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;