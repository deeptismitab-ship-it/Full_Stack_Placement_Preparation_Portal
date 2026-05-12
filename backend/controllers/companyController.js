const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { Op, fn, col } = require('sequelize');

const Company = sequelize.define('Company', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  logo: { type: DataTypes.STRING, defaultValue: '' },
  description: { type: DataTypes.STRING, defaultValue: '' },
  website: { type: DataTypes.STRING, defaultValue: '' },
  industry: { type: DataTypes.STRING, defaultValue: '' },
  headquarters: { type: DataTypes.STRING, defaultValue: '' },
  hiringStatus: { type: DataTypes.ENUM('active', 'upcoming', 'completed', 'not-hiring'), defaultValue: 'upcoming' },
  eligibilityCriteria: { type: DataTypes.JSON, defaultValue: {} },
  recruitmentProcess: { type: DataTypes.JSON, defaultValue: [] },
  interviewExperiences: { type: DataTypes.JSON, defaultValue: [] },
  previousPapers: { type: DataTypes.JSON, defaultValue: [] },
  faqs: { type: DataTypes.JSON, defaultValue: [] },
  createdBy: { type: DataTypes.INTEGER, defaultValue: null }
}, { timestamps: true, tableName: 'companies' });

// @desc    Get all companies
const getCompanies = async (req, res) => {
  try {
    const { status, industry, search, page = 1, limit = 12 } = req.query;
    const where = {};
    if (status) where.hiringStatus = status;
    if (industry) where.industry = industry;
    if (search) where[Op.or] = [
      { name: { [Op.like]: `%${search}%` } },
      { industry: { [Op.like]: `%${search}%` } }
    ];

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const { count, rows: companies } = await Company.findAndCountAll({
      where, offset, limit: parseInt(limit), order: [['name', 'ASC']]
    });

    res.json({ companies, total: count, page: parseInt(page), pages: Math.ceil(count / parseInt(limit)) });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get single company
const getCompanyById = async (req, res) => {
  try {
    const company = await Company.findByPk(req.params.id);
    if (!company) return res.status(404).json({ message: 'Company not found' });
    res.json(company);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create company (admin)
const createCompany = async (req, res) => {
  try {
    const { name, logo, description, website, industry, headquarters, hiringStatus, eligibilityCriteria, recruitmentProcess, previousPapers, faqs } = req.body;
    const company = await Company.create({
      name, logo, description, website, industry, headquarters, hiringStatus,
      eligibilityCriteria, recruitmentProcess, previousPapers, faqs, createdBy: req.user.id
    });
    res.status(201).json(company);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update company (admin)
const updateCompany = async (req, res) => {
  try {
    const company = await Company.findByPk(req.params.id);
    if (!company) return res.status(404).json({ message: 'Company not found' });

    const fields = ['name', 'logo', 'description', 'website', 'industry', 'headquarters', 'hiringStatus', 'eligibilityCriteria', 'recruitmentProcess', 'previousPapers', 'faqs'];
    fields.forEach(field => { if (req.body[field] !== undefined) company[field] = req.body[field]; });
    await company.save();
    res.json(company);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete company (admin)
const deleteCompany = async (req, res) => {
  try {
    const company = await Company.findByPk(req.params.id);
    if (!company) return res.status(404).json({ message: 'Company not found' });
    await company.destroy();
    res.json({ message: 'Company deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Add interview experience
const addInterviewExperience = async (req, res) => {
  try {
    const company = await Company.findByPk(req.params.id);
    if (!company) return res.status(404).json({ message: 'Company not found' });

    const { year, role, experience, tips } = req.body;
    let experiences = company.interviewExperiences || [];
    if (typeof experiences === 'string') experiences = JSON.parse(experiences);

    experiences.push({ student: req.user.id, studentName: req.user.name, year, role, experience, tips, createdAt: new Date() });
    company.interviewExperiences = experiences;
    await company.save();

    res.status(201).json({ message: 'Experience added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get companies by status
const getCompaniesByStatus = async (req, res) => {
  try {
    const companies = await Company.findAll({
      where: { hiringStatus: req.params.status },
      attributes: ['id', 'name', 'logo', 'industry', 'hiringStatus']
    });
    res.json(companies);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get company stats
const getCompanyStats = async (req, res) => {
  try {
    const stats = await Company.findAll({
      attributes: ['hiringStatus', [fn('COUNT', col('id')), 'count']],
      group: ['hiringStatus']
    });
    const industries = await Company.findAll({
      attributes: ['industry', [fn('COUNT', col('id')), 'count']],
      group: ['industry'], order: [[fn('COUNT', col('id')), 'DESC']], limit: 10
    });
    const total = await Company.count();
    res.json({ total, byStatus: stats, topIndustries: industries });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all industries
const getIndustries = async (req, res) => {
  try {
    const industries = await Company.findAll({
      attributes: ['industry'],
      where: { industry: { [Op.ne]: null } },
      group: ['industry']
    });
    res.json(industries.map(i => i.industry).filter(Boolean));
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getCompanies, getCompanyById, createCompany, updateCompany, deleteCompany, addInterviewExperience, getCompaniesByStatus, getCompanyStats, getIndustries };