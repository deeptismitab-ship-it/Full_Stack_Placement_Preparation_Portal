import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  GraduationCap, 
  BookOpen, 
  Trophy, 
  Users, 
  TrendingUp,
  Zap,
  Target,
  Award
} from 'lucide-react';

const Home = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: BookOpen,
      title: 'Extensive Question Bank',
      description: 'Practice 5000+ questions across aptitude, technical subjects, and coding'
    },
    {
      icon: Trophy,
      title: 'Mock Tests',
      description: 'Take timed tests that simulate real placement exams'
    },
    {
      icon: Users,
      title: 'Company Insights',
      description: 'Learn from interview experiences and placement patterns'
    },
    {
      icon: TrendingUp,
      title: 'Track Progress',
      description: 'Monitor your improvement with detailed analytics'
    }
  ];

  const stats = [
    { value: '5000+', label: 'Questions' },
    { value: '100+', label: 'Companies' },
    { value: '10000+', label: 'Students' },
    { value: '95%', label: 'Success Rate' }
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <GraduationCap className="w-8 h-8 text-primary-500" />
              <span className="text-xl font-bold">PlacementPortal</span>
            </Link>
            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="px-6 py-2 bg-primary-600 hover:bg-primary-700 rounded-lg font-medium transition-colors"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-6 py-2 bg-primary-600 hover:bg-primary-700 rounded-lg font-medium transition-colors"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/10 rounded-full text-primary-400 text-sm font-medium mb-6">
              <Zap className="w-4 h-4" />
              Trusted by 10,000+ students
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Your Complete
              <span className="gradient-text block">Placement Preparation</span>
              Platform
            </h1>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Master aptitude, coding, and interview skills with our comprehensive preparation portal. 
              Join thousands of successful placement stories.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link
                to="/register"
                className="px-8 py-4 bg-primary-600 hover:bg-primary-700 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 flex items-center gap-2"
              >
                Start Preparing Now
                <Target className="w-5 h-5" />
              </Link>
              <Link
                to="/login"
                className="px-8 py-4 border border-gray-600 hover:border-gray-500 rounded-xl font-semibold text-lg transition-colors"
              >
                Explore Demo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 border-y border-gray-800 bg-gray-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-primary-500 mb-2">{stat.value}</div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need to Succeed</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Our platform provides all the tools and resources required for comprehensive placement preparation
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-gray-800 rounded-xl border border-gray-700 hover:border-primary-500/50 transition-all hover:transform hover:scale-105"
              >
                <div className="w-12 h-12 bg-primary-500/10 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-primary-600 to-purple-600 rounded-2xl p-12 text-center">
            <Award className="w-16 h-16 mx-auto mb-6 text-white/90" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
              Join thousands of successful students who landed their dream jobs through our platform
            </p>
            <Link
              to="/register"
              className="inline-block px-8 py-4 bg-white text-primary-600 font-semibold text-lg rounded-xl hover:bg-gray-100 transition-colors"
            >
              Create Free Account
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-primary-500" />
              <span className="font-semibold">PlacementPortal</span>
            </div>
            <p className="text-gray-400 text-sm">
              © 2024 PlacementPortal. Built for placement aspirants.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;