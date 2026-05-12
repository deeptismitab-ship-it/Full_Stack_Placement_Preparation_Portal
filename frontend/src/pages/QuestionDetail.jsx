import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { questionsAPI, progressAPI } from '../services/api';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { 
  ArrowLeft, 
  Bookmark, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Award,
  ChevronRight
} from 'lucide-react';

const QuestionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { success, error: showError } = useToast();

  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());

  useEffect(() => {
    fetchQuestion();
  }, [id]);

  const fetchQuestion = async () => {
    try {
      const response = await questionsAPI.getById(id);
      setQuestion(response.data);
    } catch (err) {
      showError('Failed to load question');
      navigate('/questions');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (option) => {
    if (showResult) return;
    setSelectedAnswer(option);
  };

  const handleSubmit = async () => {
    if (!selectedAnswer) {
      showError('Please select an answer');
      return;
    }

    const correctOption = question.options.find(opt => opt.isCorrect);
    const correct = selectedAnswer === correctOption?.option;
    
    setIsCorrect(correct);
    setShowResult(true);

    // Update progress
    const timeSpent = Math.round((Date.now() - startTime) / 1000);
    try {
      await progressAPI.updateProgress({
        category: question.category,
        questionsAttempted: 1,
        questionsCorrect: correct ? 1 : 0,
        timeSpent
      });
    } catch (err) {
      console.error('Progress update error:', err);
    }
  };

  const handleBookmark = async () => {
    try {
      await questionsAPI.bookmarkQuestion(id);
      success('Question bookmarked!');
    } catch (err) {
      showError('Failed to bookmark');
    }
  };

  const handleNext = () => {
    // For now, just go back - can be enhanced to fetch next question
    navigate('/questions');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!question) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
      {/* Back Button */}
      <button
        onClick={() => navigate('/questions')}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Questions
      </button>

      {/* Question Card */}
      <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
                  {question.category}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  question.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
                  question.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {question.difficulty}
                </span>
              </div>
              <h1 className="text-2xl font-bold">{question.title}</h1>
            </div>
            <button
              onClick={handleBookmark}
              className="p-3 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Bookmark className="w-6 h-6 text-gray-400 hover:text-primary-400" />
            </button>
          </div>
        </div>

        {/* Description */}
        <div className="p-6 border-b border-gray-700">
          <p className="text-lg mb-4">{question.description}</p>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span className="flex items-center gap-1">
              <Award className="w-4 h-4" />
              {question.points} points
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {question.timeLimit / 60} minutes
            </span>
          </div>
        </div>

        {/* Options */}
        {question.type === 'mcq' && question.options && (
          <div className="p-6">
            <h3 className="font-semibold mb-4">Select your answer:</h3>
            <div className="space-y-3">
              {question.options.map((opt, index) => {
                let optionClass = 'bg-gray-700/50 border-gray-600 hover:border-primary-500';
                
                if (showResult) {
                  if (opt.isCorrect) {
                    optionClass = 'bg-green-500/20 border-green-500';
                  } else if (selectedAnswer === opt.option && !opt.isCorrect) {
                    optionClass = 'bg-red-500/20 border-red-500';
                  }
                } else if (selectedAnswer === opt.option) {
                  optionClass = 'bg-primary-500/20 border-primary-500';
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(opt.option)}
                    disabled={showResult}
                    className={`w-full p-4 rounded-xl border text-left transition-all flex items-center gap-3 ${optionClass}`}
                  >
                    <span className={`w-8 h-8 rounded-full border flex items-center justify-center font-medium ${
                      selectedAnswer === opt.option ? 'border-primary-500 text-primary-500' : 'border-gray-500'
                    }`}>
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="flex-1">{opt.option}</span>
                    {showResult && opt.isCorrect && (
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    )}
                    {showResult && selectedAnswer === opt.option && !opt.isCorrect && (
                      <XCircle className="w-6 h-6 text-red-500" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Coding Question */}
        {question.type === 'coding' && (
          <div className="p-6">
            <textarea
              disabled={showResult}
              value={selectedAnswer || ''}
              onChange={(e) => setSelectedAnswer(e.target.value)}
              placeholder="Write your code here..."
              className="w-full h-64 p-4 bg-gray-900 rounded-xl border border-gray-600 focus:border-primary-500 focus:outline-none font-mono text-sm resize-none"
            />
          </div>
        )}

        {/* Result Section */}
        {showResult && (
          <div className={`p-6 ${
            isCorrect ? 'bg-green-500/10 border-t border-green-500/30' : 'bg-red-500/10 border-t border-red-500/30'
          }`}>
            <div className="flex items-center gap-3 mb-4">
              {isCorrect ? (
                <>
                  <CheckCircle className="w-8 h-8 text-green-500" />
                  <div>
                    <h3 className="text-xl font-bold text-green-400">Correct!</h3>
                    <p className="text-green-400/70">Great job! You got it right.</p>
                  </div>
                </>
              ) : (
                <>
                  <XCircle className="w-8 h-8 text-red-500" />
                  <div>
                    <h3 className="text-xl font-bold text-red-400">Incorrect</h3>
                    <p className="text-red-400/70">
                      The correct answer is: <strong>{question.options?.find(o => o.isCorrect)?.option}</strong>
                    </p>
                  </div>
                </>
              )}
            </div>

            {question.explanation && (
              <div className="mt-4 p-4 bg-gray-700/50 rounded-lg">
                <h4 className="font-semibold mb-2">Explanation:</h4>
                <p className="text-gray-300">{question.explanation}</p>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="p-6 bg-gray-800/50 flex items-center justify-between">
          {!showResult ? (
            <button
              onClick={handleSubmit}
              disabled={!selectedAnswer}
              className="px-8 py-3 bg-primary-600 hover:bg-primary-700 rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              Submit Answer
              <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-8 py-3 bg-primary-600 hover:bg-primary-700 rounded-xl font-semibold transition-colors flex items-center gap-2"
            >
              Next Question
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
          
          {showResult && (
            <div className={`flex items-center gap-2 ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
              {isCorrect ? '+' : ''}{question.points} points
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionDetail;