const Router = require('express');
const router = new Router();
const violationReportController = require('../controllers/ViolationReportController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', violationReportController.createViolationReport);
router.get('/', violationReportController.getAllViolationReports);
router.get('/current',authMiddleware, violationReportController.getUserViolationReports);
router.delete('/:id', violationReportController.deleteViolationReport);
router.put('/:id', violationReportController.updateViolationReportStatus);

module.exports = router; 
