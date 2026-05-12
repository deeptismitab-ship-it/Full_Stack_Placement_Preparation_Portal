import { useState, useEffect } from 'react';
import { 
  Users, 
  BookOpen, 
  Building2, 
  FileQuestion,
  Trophy,
  BarChart3,
  Plus,
  Edit2,
  Trash2,
  Loader2
} from 'lucide-react';
import { questionsAPI, companiesAPI, testsAPI, authAPI } from '../services/api';
import { useToast } from '../context/ToastContext';

// Sample data for initial setup
const sampleQuestions = [
  {
    title: 'What is the time complexity of binary search?',
    description: 'Binary search algorithm is used to find an element in a sorted array. What is the time complexity of binary search?',
    category: 'aptitude',
    difficulty: 'medium',
    type: 'mcq',
    options: [
      { option: 'O(1)', isCorrect: false },
      { option: 'O(n)', isCorrect: false },
      { option: 'O(log n)', isCorrect: true },
      { option: 'O(n log n)', isCorrect: false }
    ],
    correctAnswer: 'O(log n)',
    explanation: 'Binary search divides the search space by half with each iteration, resulting in O(log n) time complexity.',
    points: 10
  },
  {
    title: 'Which data structure uses LIFO principle?',
    description: 'Which of the following data structures follows the Last In First Out (LIFO) principle?',
    category: 'data-structures',
    difficulty: 'easy',
    type: 'mcq',
    options: [
      { option: 'Queue', isCorrect: false },
      { option: 'Stack', isCorrect: true },
      { option: 'Array', isCorrect: false },
      { option: 'Linked List', isCorrect: false }
    ],
    correctAnswer: 'Stack',
    explanation: 'A Stack follows LIFO principle where the last element added is the first one to be removed.',
    points: 10
  },
  {
    title: 'SQL - Find second highest salary',
    description: 'Write a SQL query to find the second highest salary from an Employee table.',
    category: 'database',
    difficulty: 'medium',
    type: 'coding',
    correctAnswer: 'SELECT MAX(salary) FROM Employee WHERE salary < (SELECT MAX(salary) FROM Employee);',
    explanation: 'This query first finds the maximum salary, then selects the maximum salary that is less than the maximum, which gives us the second highest.',
    points: 20
  }
];

const sampleCompanies = [
  {
    name: 'Tech Giants Corp',
    industry: 'Software Development',
    headquarters: 'Bangalore, India',
    description: 'A leading tech company specializing in cloud computing and AI solutions.',
    hiringStatus: 'active',
    eligibilityCriteria: {
      minCGPA: 7.0,
      maxBacklogs: 2,
      requiredBranches: ['CSE', 'ECE', 'IT']
    },
    recruitmentProcess: [
      { round: 'Online Assessment', description: 'Aptitude and coding test', topics: ['Aptitude', 'Coding'] },
      { round: 'Technical Interview', description: 'Data structures and algorithms', topics: ['DSA', 'System Design'] },
      { round: 'HR Interview', description: 'General discussion', topics: ['Communication', 'Behavioral'] }
    ],
    faqs: [
      { question: 'What is the bond period?', answer: '2 years bond' },
      { question: 'Is there any written test?', answer: 'Yes, online assessment first' }
    ]
  },
  {
    name: 'Global Services Ltd',
    industry: 'IT Services',
    headquarters: 'Hyderabad, India',
    description: 'A multinational IT services and consulting company.',
    hiringStatus: 'upcoming',
    eligibilityCriteria: {
      minCGPA: 6.0,
      maxBacklogs: 4,
      requiredBranches: ['CSE', 'ECE', 'IT', 'EEE', 'Mechanical']
    },
    recruitmentProcess: [
      { round: 'Aptitude Test', description: 'Quantitative and logical reasoning', topics: ['Aptitude', 'Reasoning'] },
      { round: 'Technical Interview', description: 'Core subjects', topics: ['C', 'C++', 'Java', 'DBMS'] },
      { round: 'HR Interview', description: 'Final round', topics: ['Communication'] }
    ]
  }
];

const sampleTests = [
  {
    title: 'Aptitude Master Test',
    description: 'Test your quantitative aptitude skills',
    category: 'aptitude',
    duration: 30,
    totalQuestions: 20,
    totalMarks: 20,
    passingMarks: 8
  },
  {
    title: 'Technical Assessment',
    description: 'Core technical subjects test',
    category: 'technical',
    duration: 45,
    totalQuestions: 30,
    totalMarks: 30,
    passingMarks: 12
  },
  {
    title: 'Full Length Mock Test',
    description: 'Complete placement simulation',
    category: 'full-length',
    duration: 60,
    totalQuestions: 50,
    totalMarks: 50,
    passingMarks: 20
  }
];

const AdminPanel = () => {
  const { success, error: showError } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ questions: 0, companies: 0, tests: 0, users: 0 });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [qStats, usersRes] = await Promise.all([
        questionsAPI.getStats(),
        authAPI.getAllUsers()
      ]);
      setStats({
        questions: qStats.data.total,
        companies: 0,
        tests: 0,
        users: usersRes.data.length
      });
      setUsers(usersRes.data);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  const handleSeedData = async (type) => {
    setLoading(true);
    try {
      if (type === 'questions') {
        await questionsAPI.bulkCreate({ questions: sampleQuestions });
        success(`${sampleQuestions.length} questions added successfully!`);
      } else if (type === 'companies') {
        for (const company of sampleCompanies) {
          await companiesAPI.create(company);
        }
        success(`${sampleCompanies.length} companies added successfully!`);
      } else if (type === 'tests') {
        for (const test of sampleTests) {
          await testsAPI.create(test);
        }
        success(`${sampleTests.length} tests added successfully!`);
      }
      fetchStats();
    } catch (err) {
      showError('Failed to seed data');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'questions', label: 'Questions', icon: FileQuestion },
    { id: 'companies', label: 'Companies', icon: Building2 },
    { id: 'tests', label: 'Tests', icon: Trophy }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <p className="text-gray-400 mt-1">Manage portal content and monitor activity</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-500" />
            </div>
          </div>
          <p className="text-3xl font-bold">{stats.users}</p>
          <p className="text-sm text-gray-400">Registered Users</p>
        </div>

        <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
              <FileQuestion className="w-5 h-5 text-green-500" />
            </div>
          </div>
          <p className="text-3xl font-bold">{stats.questions}</p>
          <p className="text-sm text-gray-400">Questions</p>
        </div>

        <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-purple-500" />
            </div>
          </div>
          <p className="text-3xl font-bold">{stats.companies}</p>
          <p className="text-sm text-gray-400">Companies</p>
        </div>

        <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
              <Trophy className="w-5 h-5 text-orange-500" />
            </div>
          </div>
          <p className="text-3xl font-bold">{stats.tests}</p>
          <p className="text-sm text-gray-400">Tests</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-semibold mb-4">Quick Actions - Seed Sample Data</h3>
        <p className="text-sm text-gray-400 mb-4">
          Click below to add sample data to get started quickly. This will add questions, companies, and tests.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => handleSeedData('questions')}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            Add Sample Questions
          </button>
          <button
            onClick={() => handleSeedData('companies')}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            Add Sample Companies
          </button>
          <button
            onClick={() => handleSeedData('tests')}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            Add Sample Tests
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-700">
        <div className="flex gap-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-400'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold mb-4">Welcome to Admin Panel</h3>
              <p className="text-gray-400 mb-4">
                Use this panel to manage all aspects of the Placement Portal.
              </p>
              <ul className="space-y-2 text-gray-300">
                <li>• Add and manage questions in the Questions tab</li>
                <li>• Add company information and interview experiences</li>
                <li>• Create and manage mock tests</li>
                <li>• Monitor user activity and progress</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
            <div className="p-4 border-b border-gray-700">
              <h3 className="font-semibold">Registered Users ({users.length})</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Email</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">College</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Role</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-700/30">
                      <td className="px-4 py-3">{user.name}</td>
                      <td className="px-4 py-3 text-gray-400">{user.email}</td>
                      <td className="px-4 py-3 text-gray-400">{user.college || 'N/A'}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          user.role === 'admin' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button className="p-1 hover:bg-gray-600 rounded">
                            <Edit2 className="w-4 h-4 text-gray-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'questions' && (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-600" />
            <h3 className="text-xl font-medium mb-2">Question Management</h3>
            <p className="text-gray-400 mb-4">Add, edit, or remove questions from the question bank</p>
            <button className="px-6 py-3 bg-primary-600 hover:bg-primary-700 rounded-lg font-medium">
              <Plus className="w-5 h-5 inline mr-2" />
              Add Question
            </button>
          </div>
        )}

        {activeTab === 'companies' && (
          <div className="text-center py-16">
            <Building2 className="w-16 h-16 mx-auto mb-4 text-gray-600" />
            <h3 className="text-xl font-medium mb-2">Company Management</h3>
            <p className="text-gray-400 mb-4">Manage company profiles and interview experiences</p>
            <button className="px-6 py-3 bg-primary-600 hover:bg-primary-700 rounded-lg font-medium">
              <Plus className="w-5 h-5 inline mr-2" />
              Add Company
            </button>
          </div>
        )}

        {activeTab === 'tests' && (
          <div className="text-center py-16">
            <Trophy className="w-16 h-16 mx-auto mb-4 text-gray-600" />
            <h3 className="text-xl font-medium mb-2">Test Management</h3>
            <p className="text-gray-400 mb-4">Create and manage mock tests</p>
            <button className="px-6 py-3 bg-primary-600 hover:bg-primary-700 rounded-lg font-medium">
              <Plus className="w-5 h-5 inline mr-2" />
              Create Test
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;