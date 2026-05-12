const express = require('express');
const router = express.Router();
const {
  getCompanies, getCompanyById, createCompany, updateCompany,
  deleteCompany, addInterviewExperience, getCompaniesByStatus,
  getCompanyStats, getIndustries
} = require('../controllers/companyController');
const { protect, admin } = require('../middleware/auth');

router.get('/', getCompanies);
router.get('/industries', getIndustries);
router.get('/stats', protect, admin, getCompanyStats);
router.get('/status/:status', getCompaniesByStatus);
router.get('/:id', getCompanyById);
router.post('/:id/experience', protect, addInterviewExperience);
router.post('/', protect, admin, createCompany);
router.put('/:id', protect, admin, updateCompany);
router.delete('/:id', protect, admin, deleteCompany);

module.exports = router;