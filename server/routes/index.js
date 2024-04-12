const Router = require('express')
const router = new Router()
const userRouter = require('./userRouter')
const violationReportRouter = require('./violationReportRouter')

router.use('/user', userRouter)
router.use('/violation-reports', violationReportRouter)

module.exports = router