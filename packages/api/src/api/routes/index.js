const express = require('express');
const router = express.Router();

// Import route modules
const jobsRoutes = require('./jobs');
const sarkariJobsRoutes = require('./sarkari-jobs');
const adminRoutes = require('./admin');
const aiRoutes = require('./ai');
const s3Routes = require('./s3');
const subscriptionRoutes = require('./subscription');

// Public routes
router.use('/jobs', jobsRoutes);
router.use('/sarkari-jobs', sarkariJobsRoutes);
router.use('/sarkari-results', sarkariJobsRoutes);
router.use('/subscribe', subscriptionRoutes);
router.use('/ai', aiRoutes);
router.use('/s3', s3Routes);

// Admin routes
router.use('/admin', adminRoutes);

module.exports = router;