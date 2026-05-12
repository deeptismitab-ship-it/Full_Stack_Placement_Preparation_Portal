import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { companiesAPI } from '../services/api';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { 
  ArrowLeft, 
  Building2, 
  MapPin, 
  Globe, 
  Briefcase,
  Target,
  MessageSquare,
  FileText,
  Star,
  Plus
} from 'lucide-react';

const CompanyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { success, error: showError } = useToast();

  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showExperienceForm, setShowExperienceForm] = useState(false);
  const [experience, setExperience] = useState({ year: new Date().getFullYear(), role: '', experience: '', tips: '' });

  useEffect(() => {
    fetchCompany();
  }, [id]);

  const fetchCompany = async () => {
    try {
      const response = await companiesAPI.getById(id);
      setCompany(response.data);
    } catch (err) {
      showError('Failed to load company details');
      navigate('/companies');
    } finally {
      setLoading(false);
    }
  };

  const handleAddExperience = async (e) => {
    e.preventDefault();
    try {
      await companiesAPI.addExperience(id, experience);
      success('Experience shared successfully!');
      setShowExperienceForm(false);
      setExperience({ year: new Date().getFullYear(), role: '', experience: '', tips: '' });
      fetchCompany();
    } catch (err) {
      showError('Failed to share experience');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return { bg: 'bg-green-500/20', text: 'text-green-400', label: 'Actively Hiring' };
      case 'upcoming':
        return { bg: 'bg-blue-500/20', text: 'text-blue-400', label: 'Upcoming' };
      case 'completed':
        return { bg: 'bg-gray-500/20', text: 'text-gray-400', label: 'Completed' };
      default:
        return { bg: 'bg-gray-500/20', text: 'text-gray-400', label: status };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!company) return null;

  const status = getStatusBadge(company.hiringStatus);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Back Button */}
      <button
        onClick={() => navigate('/companies')}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Companies
      </button>

      {/* Company Header */}
      <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-primary-600 to-purple-600"></div>
        <div className="p-6 -mt-16">
          <div className="flex items-end justify-between">
            <div className="flex items-end gap-4">
              <div className="w-24 h-24 bg-gray-700 rounded-xl flex items-center justify-center text-4xl border-4 border-gray-800">
                {company.logo || '🏢'}
              </div>
              <div className="mb-2">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold">{company.name}</h1>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${status.bg} ${status.text}`}>
                    {status.label}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-gray-400">
                  {company.industry && (
                    <span className="flex items-center gap-1">
                      <Building2 className="w-4 h-4" />
                      {company.industry}
                    </span>
                  )}
                  {company.headquarters && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {company.headquarters}
                    </span>
                  )}
                  {company.website && (
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 hover:text-primary-400"
                    >
                      <Globe className="w-4 h-4" />
                      Website
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* About */}
          {company.description && (
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h2 className="text-xl font-bold mb-4">About {company.name}</h2>
              <p className="text-gray-300 leading-relaxed">{company.description}</p>
            </div>
          )}

          {/* Eligibility Criteria */}
          {company.eligibilityCriteria && (
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-primary-400" />
                Eligibility Criteria
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <p className="text-sm text-gray-400 mb-1">Minimum CGPA</p>
                  <p className="text-xl font-bold">{company.eligibilityCriteria.minCGPA || 'N/A'}</p>
                </div>
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <p className="text-sm text-gray-400 mb-1">Max Backlogs</p>
                  <p className="text-xl font-bold">{company.eligibilityCriteria.maxBacklogs || 'N/A'}</p>
                </div>
                {company.eligibilityCriteria.requiredBranches?.length > 0 && (
                  <div className="col-span-2 bg-gray-700/50 rounded-lg p-4">
                    <p className="text-sm text-gray-400 mb-2">Eligible Branches</p>
                    <div className="flex flex-wrap gap-2">
                      {company.eligibilityCriteria.requiredBranches.map((branch, idx) => (
                        <span key={idx} className="px-3 py-1 bg-primary-500/20 text-primary-400 rounded-full text-sm">
                          {branch}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Recruitment Process */}
          {company.recruitmentProcess?.length > 0 && (
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-primary-400" />
                Recruitment Process
              </h2>
              <div className="space-y-4">
                {company.recruitmentProcess.map((round, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold">
                        {index + 1}
                      </div>
                      {index < company.recruitmentProcess.length - 1 && (
                        <div className="w-0.5 h-full bg-gray-600 my-2"></div>
                      )}
                    </div>
                    <div className="flex-1 pb-6">
                      <h3 className="text-lg font-semibold mb-1">{round.round}</h3>
                      {round.description && (
                        <p className="text-gray-400 mb-2">{round.description}</p>
                      )}
                      {round.topics?.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {round.topics.map((topic, idx) => (
                            <span key={idx} className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">
                              {topic}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Previous Year Papers */}
          {company.previousPapers?.length > 0 && (
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary-400" />
                Previous Year Papers
              </h2>
              <div className="space-y-3">
                {company.previousPapers.map((paper, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                    <div>
                      <p className="font-medium">{paper.year} Placement Paper</p>
                      {paper.description && (
                        <p className="text-sm text-gray-400">{paper.description}</p>
                      )}
                    </div>
                    <button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded-lg text-sm">
                      Download
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Interview Experiences */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary-400" />
                Interview Experiences
              </h2>
              <button
                onClick={() => setShowExperienceForm(!showExperienceForm)}
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded-lg text-sm"
              >
                <Plus className="w-4 h-4" />
                Share Experience
              </button>
            </div>

            {/* Experience Form */}
            {showExperienceForm && (
              <form onSubmit={handleAddExperience} className="mb-6 p-4 bg-gray-700/50 rounded-xl">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Year</label>
                    <input
                      type="number"
                      value={experience.year}
                      onChange={(e) => setExperience({ ...experience, year: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-primary-500 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Role</label>
                    <input
                      type="text"
                      value={experience.role}
                      onChange={(e) => setExperience({ ...experience, role: e.target.value })}
                      placeholder="Software Engineer"
                      className="w-full px-4 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-primary-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm text-gray-400 mb-1">Your Experience *</label>
                  <textarea
                    value={experience.experience}
                    onChange={(e) => setExperience({ ...experience, experience: e.target.value })}
                    placeholder="Share the interview process, questions asked, etc."
                    rows={4}
                    className="w-full px-4 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-primary-500 focus:outline-none resize-none"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm text-gray-400 mb-1">Tips for Future Applicants</label>
                  <textarea
                    value={experience.tips}
                    onChange={(e) => setExperience({ ...experience, tips: e.target.value })}
                    placeholder="Any advice for future candidates..."
                    rows={2}
                    className="w-full px-4 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-primary-500 focus:outline-none resize-none"
                  />
                </div>
                <div className="flex gap-3">
                  <button type="submit" className="px-6 py-2 bg-primary-600 hover:bg-primary-700 rounded-lg font-medium">
                    Submit
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowExperienceForm(false)}
                    className="px-6 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* Experiences List */}
            {company.interviewExperiences?.length > 0 ? (
              <div className="space-y-4">
                {company.interviewExperiences.map((exp, index) => (
                  <div key={index} className="p-4 bg-gray-700/50 rounded-xl">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-500/20 rounded-full flex items-center justify-center">
                          <span className="text-primary-400 font-bold">
                            {exp.student?.name?.charAt(0) || 'A'}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{exp.student?.name || 'Anonymous'}</p>
                          <p className="text-sm text-gray-400">
                            {exp.year} • {exp.role}
                          </p>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-300 mb-3">{exp.experience}</p>
                    {exp.tips && (
                      <div className="pt-3 border-t border-gray-600">
                        <p className="text-sm text-yellow-400">
                          💡 Tip: {exp.tips}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No interview experiences shared yet</p>
                <p className="text-sm">Be the first to share your experience!</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-bold mb-4">Quick Info</h3>
            <div className="space-y-4">
              {company.industry && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Industry</span>
                  <span className="font-medium">{company.industry}</span>
                </div>
              )}
              {company.headquarters && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Headquarters</span>
                  <span className="font-medium">{company.headquarters}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Experiences</span>
                <span className="font-medium">{company.interviewExperiences?.length || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Previous Papers</span>
                <span className="font-medium">{company.previousPapers?.length || 0}</span>
              </div>
            </div>
          </div>

          {/* FAQs */}
          {company.faqs?.length > 0 && (
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400" />
                FAQs
              </h3>
              <div className="space-y-4">
                {company.faqs.map((faq, index) => (
                  <div key={index}>
                    <h4 className="font-medium mb-1">{faq.question}</h4>
                    <p className="text-sm text-gray-400">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyDetail;