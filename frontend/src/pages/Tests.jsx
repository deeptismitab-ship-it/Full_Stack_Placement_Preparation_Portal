import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { testsAPI } from '../services/api';
import { Trophy, Clock, Target, Filter, Play, Award, TrendingUp } from 'lucide-react';

const Tests = () => {
  const [tests, setTests] = useState([]);
  const [myResults, setMyResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('available');
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [testsRes, resultsRes] = await Promise.all([
        testsAPI.getAll(),
        testsAPI.getResults()
      ]);
      setTests(testsRes.data.tests);
      setMyResults(resultsRes.data);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'aptitude': return '📊';
      case 'technical': return '💻';
      case 'coding': return '⌨️';
      case 'full-length': return '📝';
      default: return '🎯';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'aptitude': return 'from-blue-500 to-cyan-500';
      case 'technical': return 'from-purple-500 to-pink-500';
      case 'coding': return 'from-green-500 to-emerald-500';
      case 'full-length': return 'from-orange-500 to-red-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const filteredTests = tests.filter(test => 
    !filter || test.category === filter
  );

  const myTestIds = myResults.map(r => r.test?._id);

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
        <h1 className="text-3xl font-bold">Mock Tests</h1>
        <p className="text-gray-400 mt-1">Practice with timed tests that simulate real placement exams</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{myResults.length}</p>
              <p className="text-sm text-gray-400">Tests Attempted</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
              <Trophy className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {myResults.filter(r => r.score / r.totalQuestions >= 0.6).length}
              </p>
              <p className="text-sm text-gray-400">Passed</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {myResults.length > 0 ? Math.round(
                  myResults.reduce((sum, r) => sum + (r.score / r.totalQuestions) * 100, 0) / myResults.length
                ) : 0}%
              </p>
              <p className="text-sm text-gray-400">Avg Score</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
              <Award className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {myResults.length > 0 ? Math.max(...myResults.map(r => r.percentile || 0)) : 0}%
              </p>
              <p className="text-sm text-gray-400">Best Percentile</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs and Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('available')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'available' ? 'bg-primary-600 text-white' : 'bg-gray-800 hover:bg-gray-700'
            }`}
          >
            Available Tests
          </button>
          <button
            onClick={() => setActiveTab('my-results')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'my-results' ? 'bg-primary-600 text-white' : 'bg-gray-800 hover:bg-gray-700'
            }`}
          >
            My Results
          </button>
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 bg-gray-800 rounded-lg border border-gray-700 focus:border-primary-500 focus:outline-none"
          >
            <option value="">All Categories</option>
            <option value="aptitude">Aptitude</option>
            <option value="technical">Technical</option>
            <option value="coding">Coding</option>
            <option value="full-length">Full Length</option>
          </select>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'available' ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTests.length > 0 ? (
            filteredTests.map((test) => (
              <div
                key={test._id}
                className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden hover:border-primary-500/50 transition-all"
              >
                <div className={`h-2 bg-gradient-to-r ${getCategoryColor(test.category)}`} />
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-3xl">{getCategoryIcon(test.category)}</div>
                    {myTestIds.includes(test._id) && (
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">
                        Attempted
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-bold mb-2">{test.title}</h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {test.description || `${test.totalQuestions} questions • ${test.duration} minutes`}
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                    <span className="flex items-center gap-1">
                      <Target className="w-4 h-4" />
                      {test.totalQuestions} Q
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {test.duration} min
                    </span>
                    <span className="flex items-center gap-1">
                      <Award className="w-4 h-4" />
                      {test.totalMarks} marks
                    </span>
                  </div>
                  
                  <Link
                    to={`/tests/${test._id}`}
                    className="w-full py-3 bg-primary-600 hover:bg-primary-700 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <Play className="w-5 h-5" />
                    {myTestIds.includes(test._id) ? 'Retake Test' : 'Start Test'}
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-16">
              <Trophy className="w-16 h-16 mx-auto mb-4 text-gray-600" />
              <h3 className="text-xl font-medium mb-2">No tests available</h3>
              <p className="text-gray-400">Check back later for new tests</p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {myResults.length > 0 ? (
            myResults.map((result) => (
              <div
                key={result._id}
                className="bg-gray-800 rounded-xl p-6 border border-gray-700"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                      result.score / result.totalQuestions >= 0.6
                        ? 'bg-green-500/20'
                        : 'bg-red-500/20'
                    }`}>
                      <Trophy className={`w-7 h-7 ${
                        result.score / result.totalQuestions >= 0.6
                          ? 'text-green-400'
                          : 'text-red-400'
                      }`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">{result.test?.title || 'Test'}</h3>
                      <p className="text-sm text-gray-400">
                        {new Date(result.completedAt).toLocaleDateString('en-US', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold">
                        {result.score}/{result.totalQuestions}
                      </p>
                      <p className="text-xs text-gray-400">Score</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary-400">
                        {Math.round((result.score / result.totalQuestions) * 100)}%
                      </p>
                      <p className="text-xs text-gray-400">Percentage</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-yellow-400">
                        {result.percentile}th
                      </p>
                      <p className="text-xs text-gray-400">Percentile</p>
                    </div>
                    <Link
                      to={`/tests/${result.test?._id}/result?id=${result._id}`}
                      className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16">
              <Award className="w-16 h-16 mx-auto mb-4 text-gray-600" />
              <h3 className="text-xl font-medium mb-2">No test results yet</h3>
              <p className="text-gray-400">Start taking tests to see your results here</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Tests;