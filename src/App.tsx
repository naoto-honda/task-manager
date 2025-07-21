import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { useEffect, useState } from 'react';
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from 'react-router-dom';
import './App.css';
import { auth } from './firebase';
import CategoryTasks from './pages/CategoryTasks';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import MonthTasks from './pages/MonthTasks';
import TagTasks from './pages/TagTasks';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Firebase Authのログイン状態を監視
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await user.reload(); // 最新のユーザー情報を取得
        setUser(auth.currentUser);
        setIsLoggedIn(true);
      } else {
        setUser(null);
        setIsLoggedIn(false);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = (user?: User | null) => {
    if (user) {
      setUser(user);
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(true);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setIsLoggedIn(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-600 text-lg">認証状態を確認中...</div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App min-h-screen">
        <Routes>
          <Route
            path="/"
            element={
              isLoggedIn ? (
                <Dashboard onLogout={handleLogout} user={user} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/login"
            element={
              !isLoggedIn ? (
                <Login onLogin={handleLogin} />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/month/:yearMonth"
            element={
              isLoggedIn ? (
                <MonthTasks onLogout={handleLogout} user={user} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/tag/:tagName"
            element={
              isLoggedIn ? (
                <TagTasks onLogout={handleLogout} user={user} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/category/:categoryName"
            element={
              isLoggedIn ? (
                <CategoryTasks onLogout={handleLogout} user={user} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          {/* /dashboard を / にリダイレクト */}
          <Route path="/dashboard" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
