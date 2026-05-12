import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { authAPI } from '../services/api';
import { 
  User, 
  Mail, 
  Phone, 
  Building, 
  BookOpen, 
  Calendar,
  Save,
  Camera,
  Loader2
} from 'lucide-react';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const { success, error: showError } = useToast();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    college: user?.college || '',
    branch: user?.branch || '',
    year: user?.year || new Date().getFullYear(),
    skills: user?.skills?.join(', ') || ''
  });

  const [loading, setLoading] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = {
        name: formData.name,
        phone: formData.phone,
        college: formData.college,
        branch: formData.branch,
        year: parseInt(formData.year),
        skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean)
      };

      await authAPI.updateProfile(data);
      updateUser(data);
      success('Profile updated successfully!');
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showError('Passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      showError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await authAPI.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      success('Password changed successfully!');
      setShowPasswordForm(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">My Profile</h1>
        <p className="text-gray-400 mt-1">Manage your profile information and settings</p>
      </div>

      {/* Profile Header Card */}
      <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 bg-primary-500/20 rounded-full flex items-center justify-center text-4xl font-bold text-primary-400">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center hover:bg-primary-700 transition-colors">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <div>
            <h2 className="text-2xl font-bold">{user?.name}</h2>
            <p className="text-gray-400">{user?.email}</p>
            <span className="inline-block mt-2 px-3 py-1 bg-primary-500/20 text-primary-400 rounded-full text-sm">
              {user?.role === 'admin' ? 'Administrator' : 'Student'}
            </span>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-semibold mb-6">Personal Information</h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-gray-700 rounded-lg border border-gray-600 focus:border-primary-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={user?.email}
                  disabled
                  className="w-full pl-10 pr-4 py-3 bg-gray-600 rounded-lg border border-gray-500 text-gray-400 cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Phone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 9876543210"
                  className="w-full pl-10 pr-4 py-3 bg-gray-700 rounded-lg border border-gray-600 focus:border-primary-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">College</label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="college"
                  value={formData.college}
                  onChange={handleChange}
                  placeholder="Your College Name"
                  className="w-full pl-10 pr-4 py-3 bg-gray-700 rounded-lg border border-gray-600 focus:border-primary-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Branch</label>
              <div className="relative">
                <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  placeholder="CSE, ECE, etc."
                  className="w-full pl-10 pr-4 py-3 bg-gray-700 rounded-lg border border-gray-600 focus:border-primary-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Year</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  min={2000}
                  max={2030}
                  className="w-full pl-10 pr-4 py-3 bg-gray-700 rounded-lg border border-gray-600 focus:border-primary-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Skills (comma separated)</label>
            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="JavaScript, React, Node.js, Python"
              className="w-full px-4 py-3 bg-gray-700 rounded-lg border border-gray-600 focus:border-primary-500 focus:outline-none"
            />
            <p className="text-xs text-gray-500 mt-1">Separate skills with commas</p>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              Save Changes
            </button>
          </div>
        </form>
      </div>

      {/* Change Password */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Change Password</h3>
          <button
            onClick={() => setShowPasswordForm(!showPasswordForm)}
            className="text-primary-400 hover:text-primary-300 text-sm"
          >
            {showPasswordForm ? 'Cancel' : 'Change Password'}
          </button>
        </div>

        {showPasswordForm && (
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Current Password</label>
              <input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                className="w-full px-4 py-3 bg-gray-700 rounded-lg border border-gray-600 focus:border-primary-500 focus:outline-none"
                required
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">New Password</label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-700 rounded-lg border border-gray-600 focus:border-primary-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Confirm New Password</label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-700 rounded-lg border border-gray-600 focus:border-primary-500 focus:outline-none"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              Update Password
            </button>
          </form>
        )}
      </div>

      {/* Account Info */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-semibold mb-4">Account Information</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Account ID</span>
            <span className="font-mono">{user?._id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Member Since</span>
            <span>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Account Status</span>
            <span className="text-green-400">Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;