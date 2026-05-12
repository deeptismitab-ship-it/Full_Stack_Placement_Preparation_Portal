import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

// Layout
import Navbar from './components/Layout/Navbar';
import Sidebar from './components/Layout/Sidebar';
import Footer from './components/Layout/Footer';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Questions from './pages/Questions';
import QuestionDetail from './pages/QuestionDetail';
import Tests from './pages/Tests';
import TestStart from './pages/TestStart';
import TestResult from './pages/TestResult';
import Companies from './pages/Companies';
import CompanyDetail from './pages/CompanyDetail';
import Progress from './pages/Progress';
import Profile from './pages/Profile';
import AdminPanel from './pages/AdminPanel';
import NotFound from './pages/NotFound';

// Protected Route Component
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Public Route (redirect to dashboard if logged in)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Main Layout Component
const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 ml-64 p-6">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <MainLayout><Dashboard /></MainLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/questions" element={
              <ProtectedRoute>
                <MainLayout><Questions /></MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/questions/:id" element={
              <ProtectedRoute>
                <MainLayout><QuestionDetail /></MainLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/tests" element={
              <ProtectedRoute>
                <MainLayout><Tests /></MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/tests/:id" element={
              <ProtectedRoute>
                <TestStart />
              </ProtectedRoute>
            } />
            <Route path="/tests/:id/result" element={
              <ProtectedRoute>
                <MainLayout><TestResult /></MainLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/companies" element={
              <ProtectedRoute>
                <MainLayout><Companies /></MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/companies/:id" element={
              <ProtectedRoute>
                <MainLayout><CompanyDetail /></MainLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/progress" element={
              <ProtectedRoute>
                <MainLayout><Progress /></MainLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/profile" element={
              <ProtectedRoute>
                <MainLayout><Profile /></MainLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/admin" element={
              <ProtectedRoute adminOnly>
                <MainLayout><AdminPanel /></MainLayout>
              </ProtectedRoute>
            } />
            
            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;