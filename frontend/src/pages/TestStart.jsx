import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { testsAPI } from '../services/api';
import { useToast } from '../context/ToastContext';
import { Clock, ChevronLeft, ChevronRight, Flag, AlertCircle } from 'lucide-react';

const TestStart = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const resultId = searchParams.get('id');
  const navigate = useNavigate();
  const { error: showError, success } = useToast();

  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [flagged, setFlagged] = useState({});
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showWarning, setShowWarning] = useState(true);

  const timerRef = useRef(null);

  useEffect(() => {
    fetchTest();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [id]);

  useEffect(() => {
    if (test && !resultId) {
      setTimeLeft(test.duration * 60);
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleSubmit(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [test, resultId]);

  const fetchTest = async () => {
    try {
      const response = await testsAPI.getById(id);
      setTest(response.data);
    } catch (err) {
      showError('Failed to load test');
      navigate('/tests');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (questionIndex, answer) => {
    setAnswers(prev => ({ ...prev, [questionIndex]: answer }));
  };

  const handleToggleFlag = (questionIndex) => {
    setFlagged(prev => ({ ...prev, [questionIndex]: !prev[questionIndex] }));
  };

  const handleSubmit = async (autoSubmit = false) => {
    if (!autoSubmit) {
      setShowConfirm(true);
      return;
    }

    setSubmitting(true);
    try {
      const timeTaken = test.duration * 60 - timeLeft;
      const response = await testsAPI.submit(id, { answers, timeTaken });
      success('Test submitted successfully!');
      navigate(`/tests/${id}/result?id=${response.data.resultId}`);
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to submit test');
      setSubmitting(false);
    }
  };

  const questionNavItems = () => {
    return test?.questions.map((q, idx) => {
      let className = 'w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium';
      
      if (answers[idx] !== undefined) {
        className += flagged[idx] ? ' bg-yellow-500/30 text-yellow-400 border border-yellow-500' : ' bg-primary-500/30 text-primary-400 border border-primary-500';
      } else if (flagged[idx]) {
        className += ' bg-yellow-500/20 text-yellow-400 border border-yellow-500';
      } else {
        className += ' bg-gray-700 text-gray-400';
      }
      
      return { index: idx, className };
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!test) return null;

  const currentQ = test.questions[currentQuestion]?.question;

  // Result mode (reviewing a completed test)
  if (resultId) {
    return (
      <div className="min-h-screen bg-gray-900 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-800 rounded-xl p-8 text-center">
            <h1 className="text-2xl font-bold mb-4">{test.title}</h1>
            <p className="text-gray-400 mb-6">Test review mode - Results loading...</p>
            <button
              onClick={() => navigate('/tests')}
              className="px-6 py-3 bg-primary-600 hover:bg-primary-700 rounded-lg font-medium"
            >
              Back to Tests
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Warning Modal */}
      {showWarning && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-8 h-8 text-yellow-400" />
              <h2 className="text-xl font-bold">Before You Start</h2>
            </div>
            <ul className="space-y-2 text-gray-300 mb-6">
              <li>• This test has a time limit of {test.duration} minutes</li>
              <li>• Once started, the timer cannot be paused</li>
              <li>• You can navigate between questions freely</li>
              <li>• You can flag questions to review later</li>
              <li>• Submit when you're done or when time runs out</li>
            </ul>
            <button
              onClick={() => setShowWarning(false)}
              className="w-full py-3 bg-primary-600 hover:bg-primary-700 rounded-lg font-semibold"
            >
              Start Test
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold">{test.title}</h1>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Flag className="w-5 h-5 text-yellow-400" />
              <span className="text-sm text-gray-400">
                {Object.keys(flagged).length} Flagged
              </span>
            </div>
            <div className={`px-4 py-2 rounded-lg font-mono text-lg font-bold ${
              timeLeft < 60 ? 'bg-red-500/20 text-red-400' : 'bg-gray-700'
            }`}>
              <Clock className="w-5 h-5 inline mr-2" />
              {formatTime(timeLeft)}
            </div>
            <button
              onClick={() => handleSubmit(false)}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-medium transition-colors"
            >
              Submit Test
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Question Panel */}
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-400">
                  Question {currentQuestion + 1} of {test.questions.length}
                </span>
                <button
                  onClick={() => handleToggleFlag(currentQuestion)}
                  className={`flex items-center gap-2 px-3 py-1 rounded-lg transition-colors ${
                    flagged[currentQuestion] 
                      ? 'bg-yellow-500/20 text-yellow-400' 
                      : 'bg-gray-700 hover:bg-gray-600 text-gray-400'
                  }`}
                >
                  <Flag className="w-4 h-4" />
                  {flagged[currentQuestion] ? 'Flagged' : 'Flag for Review'}
                </button>
              </div>
              
              <h2 className="text-xl font-medium mb-4">{currentQ?.title}</h2>
              <p className="text-gray-300 mb-6">{currentQ?.description}</p>

              {currentQ?.options && (
                <div className="space-y-3">
                  {currentQ.options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAnswerSelect(currentQuestion, opt.option)}
                      className={`w-full p-4 rounded-xl border text-left transition-all flex items-center gap-3 ${
                        answers[currentQuestion] === opt.option
                          ? 'bg-primary-500/20 border-primary-500'
                          : 'bg-gray-700/50 border-gray-600 hover:border-primary-500'
                      }`}
                    >
                      <span className={`w-8 h-8 rounded-full border flex items-center justify-center font-medium ${
                        answers[currentQuestion] === opt.option ? 'border-primary-500 text-primary-500' : 'border-gray-500'
                      }`}>
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span>{opt.option}</span>
                    </button>
                  ))}
                </div>
              )}

              {currentQ?.type === 'coding' && (
                <textarea
                  value={answers[currentQuestion] || ''}
                  onChange={(e) => handleAnswerSelect(currentQuestion, e.target.value)}
                  placeholder="Write your code here..."
                  className="w-full h-64 p-4 bg-gray-900 rounded-xl border border-gray-600 focus:border-primary-500 focus:outline-none font-mono text-sm resize-none"
                />
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
                disabled={currentQuestion === 0}
                className="flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
                Previous
              </button>
              
              {currentQuestion < test.questions.length - 1 ? (
                <button
                  onClick={() => setCurrentQuestion(prev => prev + 1)}
                  className="flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors"
                >
                  Next
                  <ChevronRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={() => handleSubmit(false)}
                  className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                >
                  Submit Test
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Question Navigator Sidebar */}
        <div className="w-72 bg-gray-800 border-l border-gray-700 p-4">
          <h3 className="font-semibold mb-4">Question Navigator</h3>
          <div className="grid grid-cols-5 gap-2 mb-6">
            {questionNavItems().map((item, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentQuestion(idx)}
                className={item.className}
              >
                {idx + 1}
              </button>
            ))}
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-primary-500/30 border border-primary-500"></div>
              <span className="text-gray-400">Answered</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-yellow-500/20 border border-yellow-500"></div>
              <span className="text-gray-400">Flagged</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-gray-700"></div>
              <span className="text-gray-400">Not Visited</span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-700">
            <p className="text-sm text-gray-400 mb-2">
              Answered: {Object.keys(answers).length} / {test.questions.length}
            </p>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-primary-500 h-2 rounded-full transition-all"
                style={{ width: `${(Object.keys(answers).length / test.questions.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Submit Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Submit Test?</h2>
            <div className="mb-6">
              <p className="text-gray-300 mb-2">
                You have answered <strong>{Object.keys(answers).length}</strong> out of <strong>{test.questions.length}</strong> questions.
              </p>
              {Object.keys(answers).length < test.questions.length && (
                <p className="text-yellow-400 text-sm">
                  ⚠️ {test.questions.length - Object.keys(answers).length} questions are unanswered!
                </p>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors"
              >
                Continue Test
              </button>
              <button
                onClick={() => handleSubmit(true)}
                disabled={submitting}
                className="flex-1 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestStart;