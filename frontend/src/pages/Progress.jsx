import { useState, useEffect } from 'react';
import { progressAPI } from '../services/api';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, BarChart, Bar } from 'recharts';
import { 
  TrendingUp, 
  Target, 
  Clock, 
  Award,
  BookOpen,
  CheckCircle
} from 'lucide-react';

const Progress = () => {
  const [stats, setStats] = useState(null);
  const [weeklyData, setWeeklyData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, weeklyRes] = await Promise.all([
        progressAPI.getStats(),
        progressAPI.getWeekly()
      ]);
      setStats(statsRes.data);
      
      const weeklyArray = Object.entries(weeklyRes.data).map(([day, data]) => ({
        day,
        ...data
      }));
      setWeeklyData(weeklyArray.reverse());
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const categoryIcons = {
    aptitude: '📊',
    logical: '🧠',
    verbal: '📝',
    'data-structures': '📐',
    algorithms: '⚡',
    database: '🗄️',
    networking: '🌐',
    'operating-systems': '💿',
    oops: '🔄',
    coding: '⌨️'
  };

  const categoryLabels = {
    aptitude: 'Aptitude',
    logical: 'Logical Reasoning',
    verbal: 'Verbal Ability',
    'data-structures': 'Data Structures',
    algorithms: 'Algorithms',
    database: 'Database',
    networking: 'Networking',
    'operating-systems': 'Operating Systems',
    oops: 'OOPs',
    coding: 'Coding'
  };

  const categoryColors = {
    aptitude: 'from-blue-500 to-cyan-500',
    logical: 'from-purple-500 to-pink-500',
    verbal: 'from-green-500 to-emerald-500',
    'data-structures': 'from-orange-500 to-red-500',
    algorithms: 'from-yellow-500 to-amber-500',
    database: 'from-teal-500 to-cyan-500',
    networking: 'from-indigo-500 to-blue-500',
    'operating-systems': 'from-gray-500 to-gray-600',
    oops: 'from-rose-500 to-pink-500',
    coding: 'from-green-500 to-lime-500'
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Your Progress</h1>
        <p className="text-gray-400 mt-1">Track your preparation journey and identify areas for improvement</p>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-blue-500" />
            </div>
          </div>
          <p className="text-3xl font-bold">{stats?.overall?.totalQuestionsAttempted || 0}</p>
          <p className="text-sm text-gray-400">Questions Attempted</p>
        </div>

        <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
          </div>
          <p className="text-3xl font-bold">{stats?.overall?.overallAccuracy || 0}%</p>
          <p className="text-sm text-gray-400">Overall Accuracy</p>
        </div>

        <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <Award className="w-5 h-5 text-purple-500" />
            </div>
          </div>
          <p className="text-3xl font-bold">{stats?.overall?.totalTestsTaken || 0}</p>
          <p className="text-sm text-gray-400">Tests Completed</p>
        </div>

        <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-orange-500" />
            </div>
          </div>
          <p className="text-3xl font-bold">{stats?.overall?.totalTimeSpent || 0}</p>
          <p className="text-sm text-gray-400">Minutes Studied</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Weekly Activity Chart */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
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
                  name="Attempted"
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

        {/* Test Performance */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold mb-4">Test Performance</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-700/50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-primary-400">
                {stats?.overall?.averageTestScore || 0}%
              </p>
              <p className="text-sm text-gray-400">Average Score</p>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-green-400">
                {stats?.overall?.bestTestScore || 0}%
              </p>
              <p className="text-sm text-gray-400">Best Score</p>
            </div>
          </div>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { name: 'Aptitude', score: 75 },
                  { name: 'Technical', score: 65 },
                  { name: 'Coding', score: 80 }
                ]}
              >
                <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="score" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Score %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Category-wise Progress */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary-500" />
          Category-wise Performance
        </h3>
        
        {stats?.byCategory?.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.byCategory.map((cat) => (
              <div
                key={cat.category}
                className="bg-gray-700/50 rounded-xl p-4 border border-gray-600"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{categoryIcons[cat.category] || '📚'}</span>
                  <div>
                    <h4 className="font-medium">{categoryLabels[cat.category] || cat.category}</h4>
                    <p className="text-sm text-gray-400">{cat.attempted} attempted</p>
                  </div>
                </div>
                
                <div className="mb-2">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span>Accuracy</span>
                    <span className={cat.accuracy >= 70 ? 'text-green-400' : cat.accuracy >= 50 ? 'text-yellow-400' : 'text-red-400'}>
                      {cat.accuracy}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-600 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full bg-gradient-to-r ${categoryColors[cat.category] || 'from-gray-500 to-gray-600'}`}
                      style={{ width: `${cat.accuracy}%` }}
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <span>{cat.correct} correct</span>
                  <span>{cat.timeSpent} min</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-400">
            <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Start practicing to see your category-wise progress!</p>
          </div>
        )}
      </div>

      {/* Achievement Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className={`bg-gradient-to-br ${stats?.overall?.overallAccuracy >= 70 ? 'from-green-600/20 to-emerald-600/20 border-green-500/30' : 'from-gray-700/50 to-gray-800/50 border-gray-600'} rounded-xl p-6 border`}>
          <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-4">
            <CheckCircle className="w-6 h-6 text-green-400" />
          </div>
          <h3 className="text-lg font-bold mb-2">Accuracy Master</h3>
          <p className="text-sm text-gray-400">
            {stats?.overall?.overallAccuracy >= 70 
              ? 'Amazing! You have maintained 70%+ accuracy!' 
              : `Keep practicing! Target: 70%+ accuracy (Current: ${stats?.overall?.overallAccuracy || 0}%)`}
          </p>
        </div>

        <div className={`bg-gradient-to-br ${stats?.overall?.totalQuestionsAttempted >= 100 ? 'from-blue-600/20 to-cyan-600/20 border-blue-500/30' : 'from-gray-700/50 to-gray-800/50 border-gray-600'} rounded-xl p-6 border`}>
          <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4">
            <Target className="w-6 h-6 text-blue-400" />
          </div>
          <h3 className="text-lg font-bold mb-2">Question Crusher</h3>
          <p className="text-sm text-gray-400">
            {stats?.overall?.totalQuestionsAttempted >= 100 
              ? 'Incredible! You have solved 100+ questions!' 
              : `Solve 100+ questions to earn this badge (Current: ${stats?.overall?.totalQuestionsAttempted || 0})`}
          </p>
        </div>

        <div className={`bg-gradient-to-br ${stats?.overall?.totalTestsTaken >= 10 ? 'from-purple-600/20 to-pink-600/20 border-purple-500/30' : 'from-gray-700/50 to-gray-800/50 border-gray-600'} rounded-xl p-6 border`}>
          <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4">
            <Award className="w-6 h-6 text-purple-400" />
          </div>
          <h3 className="text-lg font-bold mb-2">Test Taker</h3>
          <p className="text-sm text-gray-400">
            {stats?.overall?.totalTestsTaken >= 10 
              ? 'Dedicated learner! 10+ tests completed!' 
              : `Complete 10+ tests to earn this badge (Current: ${stats?.overall?.totalTestsTaken || 0})`}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Progress;