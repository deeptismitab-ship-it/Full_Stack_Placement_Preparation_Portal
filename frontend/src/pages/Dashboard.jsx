import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { progressAPI, testsAPI } from '../services/api';
import {
  BookOpen,
  Trophy,
  Target,
  TrendingUp,
  Clock,
  Award,
  ArrowRight,
  Zap,
  CheckCircle
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentTests, setRecentTests] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, testsRes, weeklyRes] = await Promise.all([
        progressAPI.getStats(),
        testsAPI.getResults(),
        progressAPI.getWeekly()
      ]);
      
      setStats(statsRes.data);
      setRecentTests(testsRes.data.slice(0, 5));
      
      // Convert weekly data to chart format
      const weeklyArray = Object.entries(weeklyRes.data).map(([day, data]) => ({
        day,
        ...data
      }));
      setWeeklyData(weeklyArray.reverse());
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    { title: 'Practice Aptitude', icon: BookOpen, link: '/questions?category=aptitude', color: 'bg-blue-500' },
    { title: 'Take Mock Test', icon: Trophy, link: '/tests', color: 'bg-purple-500' },
    { title: 'Browse Companies', icon: Target, link: '/companies', color: 'bg-green-500' },
    { title: 'View Progress', icon: TrendingUp, link: '/progress', color: 'bg-orange-500' }
  ];

  const categories = [
    { name: 'Aptitude', key: 'aptitude', icon: '📊', color: 'from-blue-500 to-cyan-500' },
    { name: 'Logical', key: 'logical', icon: '🧠', color: 'from-purple-500 to-pink-500' },
    { name: 'Verbal', key: 'verbal', icon: '📝', color: 'from-green-500 to-emerald-500' },
    { name: 'Technical', key: 'data-structures', icon: '💻', color: 'from-orange-500 to-red-500' },
    { name: 'Coding', key: 'coding', icon: '⌨️', color: 'from-yellow-500 to-amber-500' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, <span className="gradient-text">{user?.name}!</span>
          </h1>
          <p className="text-gray-400">Track your preparation journey and keep improving</p>
        </div>
        <Link
          to="/tests"
          className="flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 rounded-lg font-medium transition-colors"
        >
          <Zap className="w-5 h-5" />
          Take a Test
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-blue-500" />
            </div>
            <span className="text-sm text-green-400 flex items-center gap-1">
              <TrendingUp className="w-4 h-4" /> +12%
            </span>
          </div>
          <h3 className="text-3xl font-bold">{stats?.overall?.totalQuestionsAttempted || 0}</h3>
          <p className="text-gray-400">Questions Attempted</p>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
          </div>
          <h3 className="text-3xl font-bold">{stats?.overall?.overallAccuracy || 0}%</h3>
          <p className="text-gray-400">Overall Accuracy</p>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <Trophy className="w-6 h-6 text-purple-500" />
            </div>
          </div>
          <h3 className="text-3xl font-bold">{stats?.overall?.totalTestsTaken || 0}</h3>
          <p className="text-gray-400">Tests Completed</p>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-500" />
            </div>
          </div>
          <h3 className="text-3xl font-bold">{stats?.overall?.totalTimeSpent || 0}</h3>
          <p className="text-gray-400">Minutes Studied</p>
        </div>
      </div>

      {/* Progress Chart & Quick Actions */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Weekly Progress Chart */}
        <div className="lg:col-span-2 bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary-500" />
            Weekly Activity
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyData}>
                <XAxis dataKey="day" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="questionsAttempted"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6' }}
                  name="Questions"
                />
                <Line
                  type="monotone"
                  dataKey="questionsCorrect"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ fill: '#10b981' }}
                  name="Correct"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.link}
                className="flex items-center gap-4 p-3 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-colors group"
              >
                <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center`}>
                  <action.icon className="w-5 h-5 text-white" />
                </div>
                <span className="flex-1 font-medium">{action.title}</span>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Category Progress */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-semibold mb-4">Category-wise Progress</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {categories.map((cat) => {
            const catStats = stats?.byCategory?.find(c => c.category === cat.key);
            const accuracy = catStats?.accuracy || 0;
            
            return (
              <Link
                key={cat.key}
                to={`/questions?category=${cat.key}`}
                className="bg-gradient-to-br bg-gray-700/50 hover:bg-gray-700 rounded-xl p-4 transition-all group"
              >
                <div className="text-3xl mb-2">{cat.icon}</div>
                <h4 className="font-medium mb-2">{cat.name}</h4>
                <div className="w-full bg-gray-600 rounded-full h-2 mb-1">
                  <div
                    className={`bg-gradient-to-r ${cat.color} h-2 rounded-full transition-all`}
                    style={{ width: `${accuracy}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400">{accuracy}% accuracy</p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Tests */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Award className="w-5 h-5 text-primary-500" />
            Recent Test Results
          </h3>
          <Link to="/tests" className="text-primary-400 hover:text-primary-300 text-sm">
            View All
          </Link>
        </div>
        
        {recentTests.length > 0 ? (
          <div className="space-y-3">
            {recentTests.map((test) => (
              <div
                key={test._id}
                className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    (test.score / test.totalQuestions) >= 0.6
                      ? 'bg-green-500/20'
                      : 'bg-red-500/20'
                  }`}>
                    {test.score >= test.totalQuestions * 0.6 ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <Target className="w-5 h-5 text-red-400" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium">{test.test?.title || 'Test'}</h4>
                    <p className="text-sm text-gray-400">
                      {new Date(test.completedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">
                    {test.score}/{test.totalQuestions}
                  </p>
                  <p className={`text-sm ${
                    test.percentile >= 75 ? 'text-green-400' : 
                    test.percentile >= 50 ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {test.percentile}th percentile
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            <Trophy className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No tests taken yet. Start your first test!</p>
            <Link
              to="/tests"
              className="inline-block mt-3 px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded-lg text-sm"
            >
              Take a Test
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;