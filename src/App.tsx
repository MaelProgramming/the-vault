import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './services/firebase';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AuthCallback from './pages/AuthCallback';
import Loader from './components/Loader';
import Navbar from './components/Navbar';
import Profile from './pages/Profile';
import Conversations from './pages/Conversations';
import Invitations from './pages/Invitations';
import VaultGate from './pages/VaultGate';

// LE GARDE DU CORPS INTELLIGENT
const ProtectedRoute = ({ children }: { children: React.ReactElement }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // On demande à Firebase, pas au localStorage qui est lent à la détente
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const token = await currentUser.getIdToken();
        localStorage.setItem('vault_token', token);
        setUser(currentUser);
      } else {
        localStorage.removeItem('vault_token');
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <Loader />; // On attend que le videur vérifie la liste

  if (!user) return <Navigate to="/login" replace />;

  return children;
};

function App() {
  return (
    <Router>
      <div className='app'>
        <AuthProvider>
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/invite" element={<VaultGate />} />
            <Route path="/auth/callback" element={<AuthCallback />} />

            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />

            <Route
              path="/conversations"
              element={
                <ProtectedRoute>
                  <Conversations />
                </ProtectedRoute>
              }
            />

            <Route
              path="/invitations"
              element={
                <ProtectedRoute>
                  <Invitations />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
            <Route path='/profile' element={<Profile />}></Route>
          </Routes>
        </AuthProvider>

      </div>
    </Router>
  );
}

export default App;