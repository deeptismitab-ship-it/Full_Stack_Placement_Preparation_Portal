import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { questionsAPI } from '../services/api';
import { useToast } from '../context/ToastContext';
import { Search, Filter, BookOpen, ChevronLeft, ChevronRight, Bookmark, BookmarkCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Questions = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [showFilters, setShowFilters] = useState(false);
  
  const category = searchParams.get('category') || '';
  const difficulty = searchParams.get('difficulty') || '';
  const page = parseInt(searchParams.get('page') || '1');
  
  const { user } = useAuth();
  const { success } = useToast();

  useEffect(() => {
    fetchQuestions();
  }, [category, difficulty, page]);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 20 };
      if (category) params.category = category;
      if (difficulty) params.difficulty = difficulty;
      if (search) params.search = search;

      const response = await questionsAPI.getAll(params);
      setQuestions(response.data.questions);
      setPagination({
        page: response.data.page,
        pages: response.data.pages,
        total: response.data.total
      });
    } catch (err) {
      console.error('Fetch questions error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams({ ...Object.fromEntries(searchParams), search, page: '1' });
    fetchQuestions();
  };

  const handleFilterChange = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleBookmark = async (questionId) => {
    try {
      await questionsAPI.bookmarkQuestion(questionId);
      success('Question bookmarked!');
    } catch (err) {
      console.error('Bookmark error:', err);
    }
  };

  const categories = [
    { value: 'aptitude', label: 'Aptitude' },
    { value: 'logical', label: 'Logical Reasoning' },
    { value: 'verbal', label: 'Verbal Ability' },
    { value: 'data-structures', label: 'Data Structures' },
    { value: 'algorithms', label: 'Algorithms' },
    { value: 'database', label: 'Database' },
    { value: 'networking', label: 'Networking' },
    { value: 'operating-systems', label: 'Operating Systems' },
    { value: 'oops', label: 'OOPs' },
    { value: 'coding', label: 'Coding' }
  ];

  const difficulties = [
    { value: 'easy', label: 'Easy', color: 'text-green-400' },
    { value: 'medium', label: 'Medium', color: 'text-yellow-400' },
    { value: 'hard', label: 'Hard', color: 'text-red-400' }
  ];

  const getDifficultyColor = (diff) => {
    switch (diff) {
      case 'easy': return 'bg-green-500/20 text-green-400';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400';
      case 'hard': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getCategoryLabel = (cat) => {
    const found = categories.find(c => c.value === cat);
    return found ? found.label : cat;
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Questions Bank</h1>
          <p className="text-gray-400 mt-1">
            Practice questions from various categories
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
        <div className="flex flex-col md:flex-row gap-4">
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search questions..."
                className="w-full pl-10 pr-4 py-3 bg-gray-700 rounded-lg border border-gray-600 focus:border-primary-500 focus:outline-none"
              />
            </div>
          </form>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
          >
            <Filter className="w-5 h-5" />
            Filters
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-700 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Category</label>
              <select
                value={category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-primary-500 focus:outline-none"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-2">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-primary-500 focus:outline-none"
              >
                <option value="">All Levels</option>
                {difficulties.map((diff) => (
                  <option key={diff.value} value={diff.value}>{diff.label}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Active Filters */}
      {(category || difficulty) && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">Active filters:</span>
          {category && (
            <span className="px-3 py-1 bg-primary-500/20 text-primary-400 rounded-full text-sm flex items-center gap-1">
              {getCategoryLabel(category)}
              <button onClick={() => handleFilterChange('category', '')} className="hover:text-white">×</button>
            </span>
          )}
          {difficulty && (
            <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm flex items-center gap-1">
              {difficulty}
              <button onClick={() => handleFilterChange('difficulty', '')} className="hover:text-white">×</button>
            </span>
          )}
        </div>
      )}

      {/* Questions List */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
        </div>
      ) : questions.length > 0 ? (
        <>
          <div className="space-y-4">
            {questions.map((question) => (
              <div
                key={question._id}
                className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-primary-500/50 transition-all group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">
                        {getCategoryLabel(question.category)}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs ${getDifficultyColor(question.difficulty)}`}>
                        {question.difficulty}
                      </span>
                      <span className="px-2 py-1 bg-gray-600/50 text-gray-400 rounded text-xs">
                        {question.type}
                      </span>
                    </div>
                    <h3 className="text-lg font-medium mb-2 group-hover:text-primary-400 transition-colors">
                      {question.title}
                    </h3>
                    <p className="text-gray-400 line-clamp-2 mb-3">
                      {question.description}
                    </p>
                    {question.explanation && (
                      <p className="text-sm text-gray-500 italic">
                        Hint: {question.explanation}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleBookmark(question._id)}
                      className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                      title="Bookmark"
                    >
                      <Bookmark className="w-5 h-5 text-gray-400 hover:text-primary-400" />
                    </button>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-700 flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span>{question.points} points</span>
                    <span>{question.timeLimit / 60} min</span>
                  </div>
                  <Link
                    to={`/questions/${question._id}`}
                    className="px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded-lg text-sm font-medium transition-colors"
                  >
                    Solve Now
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => handleFilterChange('page', (page - 1).toString())}
                disabled={page === 1}
                className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-2">
                {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                  let pageNum;
                  if (pagination.pages <= 5) {
                    pageNum = i + 1;
                  } else if (page <= 3) {
                    pageNum = i + 1;
                  } else if (page >= pagination.pages - 2) {
                    pageNum = pagination.pages - 4 + i;
                  } else {
                    pageNum = page - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handleFilterChange('page', pageNum.toString())}
                      className={`w-10 h-10 rounded-lg ${
                        page === pageNum
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-800 hover:bg-gray-700'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => handleFilterChange('page', (page + 1).toString())}
                disabled={page === pagination.pages}
                className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16">
          <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-600" />
          <h3 className="text-xl font-medium mb-2">No questions found</h3>
          <p className="text-gray-400">Try adjusting your filters or search terms</p>
        </div>
      )}
    </div>
  );
};

export default Questions;