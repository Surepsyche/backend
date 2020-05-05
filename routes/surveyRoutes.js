const express = require('express');

const surveyControler = require('../controller/surveyController');

const router = express.Router();

// router.param('id', surveyControler.checkID);
router
  .route('/top-5-trend')
  .get(surveyControler.aliasTopSurvey, surveyControler.getAllSurveys);

router.route('/survey-stats').get(surveyControler.getSurveyStats);
router.route('/monthly-plan/:year').get(surveyControler.getMonthlyPlan);

router
  .route('/')
  .get(surveyControler.getAllSurveys)
  .post(surveyControler.createSurvey);

router
  .route('/:id')
  .get(surveyControler.getSurvey)
  .patch(surveyControler.updateSurvey)
  .delete(surveyControler.deleteSurvey);

module.exports = router;
