import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { testsAPI } from '../services/api';
import { useToast } from '../context/ToastContext';
import { 
  Trophy, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Target, 
  TrendingUp,
  Award,
  BarChart3
} from 'lucide-react';

const TestResult = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const resultId = searchParams.get('id');
  const navigate = useNavigate();
  const { error: showError } = useToast();

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (resultId) {
      fetchResult();
    } else {
      showError('No result ID provided');
      navigate('/tests');
    }
  }, [resultId]);

  const fetchResult = async () => {
    try {
      const response = await testsAPI.getResultDetails(resultId);
      setResult(response.data);
    } catch (err) {
      showError('Failed to load result');
      navigate('/tests');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!result) return null;

  const percentage = Math.round((result.score / result.totalQuestions) * 100);
  const isPassed = percentage >= 40;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Card */}
      <div className={`rounded-2xl p-8 ${
        isPassed ? 'bg-gradient-to-br from-green-600/20 to-emerald-600/20 border border-green-500/30' : 'bg-gradient-to-br from-red-600/20 to-orange-600/20 border border-red-500/30'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center ${
              isPassed ? 'bg-green-500/20' : 'bg-red-500/20'
            }`}>
              {isPassed ? (
                <Trophy className="w-10 h-10 text-green-400" />
              ) : (
                <Target className="w-10 h-10 text-red-400" />
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-1">
                {result.test?.title || 'Test'}
              </h1>
              <p className="text-gray-400">
                Completed on {new Date(result.completedAt).toLocaleDateString('en-US', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <div className={`text-5xl font-bold mb-1 ${isPassed ? 'text-green-400' : 'text-red-400'}`}>
              {percentage}%
            </div>
            <p className={`text-lg font-medium ${isPassed ? 'text-green-400' : 'text-red-400'}`}>
              {isPassed ? 'Passed ✓' : 'Needs Improvement'}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{result.score}/{result.totalQuestions}</p>
              <p className="text-sm text-gray-400">Score</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-400">{result.correctAnswers}</p>
              <p className="text-sm text-gray-400">Correct</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-400">{result.wrongAnswers}</p>
              <p className="text-sm text-gray-400">Wrong</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{Math.floor(result.timeTaken / 60)}:{String(result.timeTaken % 60).padStart(2, '0')}</p>
              <p className="text-sm text-gray-400">Time Taken</p>
            </div>
          </div>
        </div>
      </div>

      {/* Percentile and Rank */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center gap-4 mb-4">
            <Award className="w-8 h-8 text-yellow-400" />
            <div>
              <h3 className="text-lg font-semibold">Your Percentile</h3>
              <p className="text-sm text-gray-400">Based on all test attempts</p>
            </div>
          </div>
          <div className="text-4xl font-bold text-yellow-400">{result.percentile}th</div>
          <div className="mt-2 text-sm text-gray-400">
            {result.percentile >= 75 ? 'Great performance! 🎉' : 
             result.percentile >= 50 ? 'Good attempt, keep practicing!' : 
             'Keep practicing to improve your rank'}
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center gap-4 mb-4">
            <TrendingUp className="w-8 h-8 text-primary-400" />
            <div>
              <h3 className="text-lg font-semibold">Your Rank</h3>
              <p className="text-sm text-gray-400">Among all test takers</p>
            </div>
          </div>
          <div className="text-4xl font-bold text-primary-400">#{result.rank || 'N/A'}</div>
        </div>
      </div>

      {/* Tabs for Detailed Analysis */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <div className="flex border-b border-gray-700">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'overview' ? 'text-primary-400 border-b-2 border-primary-400' : 'text-gray-400 hover:text-white'
            }`}
          >
            Question Analysis
          </button>
          <button
            onClick={() => setActiveTab('answers')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'answers' ? 'text-primary-400 border-b-2 border-primary-400' : 'text-gray-400 hover:text-white'
            }`}
          >
            Detailed Review
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'overview' ? (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-green-500/10 rounded-xl">
                  <div className="text-2xl font-bold text-green-400 mb-1">
                    {result.answers.filter(a => a.isCorrect).length}
                  </div>
                  <div className="text-sm text-gray-400">Correct</div>
                </div>
                <div className="text-center p-4 bg-red-500/10 rounded-xl">
                  <div className="text-2xl font-bold text-red-400 mb-1">
                    {result.answers.filter(a => !a.isCorrect && a.userAnswer).length}
                  </div>
                  <div className="text-sm text-gray-400">Wrong</div>
                </div>
                <div className="text-center p-4 bg-gray-600/10 rounded-xl">
                  <div className="text-2xl font-bold text-gray-400 mb-1">
                    {result.answers.filter(a => !a.userAnswer).length}
                  </div>
                  <div className="text-sm text-gray-400">Skipped</div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium mb-3">Question-wise Result</h4>
                {result.answers.map((answer, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg flex items-center gap-3 ${
                      answer.isCorrect ? 'bg-green-500/10' : 
                      answer.userAnswer ? 'bg-red-500/10' : 'bg-gray-700/50'
                    }`}
                  >
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      answer.isCorrect ? 'bg-green-500/20 text-green-400' : 
                      answer.userAnswer ? 'bg-red-500/20 text-red-400' : 'bg-gray-600/50 text-gray-400'
                    }`}>
                      {index + 1}
                    </span>
                    <span className="flex-1">
                      Q{index + 1}: {
                        answer.isCorrect ? 'Correct ✓' : 
                        answer.userAnswer ? 'Incorrect ✗' : 'Skipped'
                      }
                    </span>
                    <span className="text-sm text-gray-400">
                      Expected: {answer.correctAnswer}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {result.answers.map((answer, index) => (
                <div key={index} className="p-4 bg-gray-700/30 rounded-xl">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        answer.isCorrect ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {index + 1}
                      </span>
                      <h4 className="font-medium">Question {index + 1}</h4>
                    </div>
                    {answer.isCorrect ? (
                      <span className="flex items-center gap-1 text-green-400">
                        <CheckCircle className="w-5 h-5" /> Correct
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-red-400">
                        <XCircle className="w-5 h-5" /> Incorrect
                      </span>
                    )}
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400 mb-1">Your Answer:</p>
                      <p className={answer.isCorrect ? 'text-green-400' : 'text-red-400'}>
                        {answer.userAnswer || 'Not answered'}
                      </p>
                    </div>
                    {!answer.isCorrect && (
                      <div>
                        <p className="text-gray-400 mb-1">Correct Answer:</p>
                        <p className="text-green-400">{answer.correctAnswer}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/tests')}
          className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors"
        >
          Back to Tests
        </button>
        <div className="flex gap-3">
          <button
            onClick={() => navigate(`/tests/${id}`)}
            className="px-6 py-3 bg-primary-600 hover:bg-primary-700 rounded-lg font-medium transition-colors"
          >
            Retake Test
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestResult;