const Survey = require('../models/surveyModel')
const APIFeatures = require('./../utils/apiFeatures')
const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/appError')

exports.aliasTopSurvey = (req, res, next) => {
  req.query.limit = '5'
  req.query.sort = 'duration'
  req.query.fields = 'question,answer,category,severity'
  next()
}

exports.getAllSurveys = catchAsync(async (req, res, next) => {
  
    const features = new APIFeatures(Survey.find(), req.query).filter().sort().limit().paginate()
    const surveys = await features.query

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      requestedAt: req.requestTime,
      results: surveys.length,
      data: {
        surveys,
      },
    });
  
});

exports.getSurvey = catchAsync(async (req, res, next) => {
  
    const survey = await Survey.findById(req.params.id)
    // Survey.findOne({_id: req.params.id})
    
    if(!survey) {
      return next(new AppError('No survey found with that ID', 404))
    }

    res.status(200).json({
      status: 'success',
      data: {
        survey,
      },
    });

});



exports.createSurvey = catchAsync(async (req, res, next) => {
  const newSurvey = await Survey.create(req.body)

  res.status(201).json({
    status: 'success',
    data: {
      survey: newSurvey,
    },
  });

});


exports.updateSurvey = catchAsync(async (req, res, next) => {
    const survey = await Survey.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })

    if(!survey) {
      return next(new AppError('No survey found with that ID', 404))
    }

    res.status(200).json({
      status: 'success',
      data: {
        survey
      },
    });

});

exports.deleteSurvey = catchAsync(async (req, res, next) => {
    const survey = await Survey.findByIdAndDelete(req.params.id)

    if(!survey) {
      return next(new AppError('No survey found with that ID', 404))
    }

    res.status(204).json({
      status: 'success',
      data: null
    });
  
});

exports.getSurveyStats = catchAsync(async (req, res, next) => {
  
    const stats = await Survey.aggregate([
      {
        $match: { duration: { $gte: 5 } }
      },
      {
        $group: {
          _id: { $toUpper: '$severity'},
          numSurveys: { $sum: 1 },
          avgDuration: { $avg: '$duration'},
          minDuration: { $min: '$duration'},
          maxDuration: { $max: '$duration'},
        }
      },
      {
        $sort: { avgDuration: 1}
      },
      // {
      //   $match: { _id: { $ne: 'LOW'}}
      // }
    ])

    res.status(200).json({
      status: 'success',
      data: {
        stats,
      },
    })


})

// TODO

exports.getMonthlyPlan = async (req, res, next) => { 
  try {
    const year = req.params.year * 1
    const plan = await Survey.aggregate([])

    res.status(200).json({
      status: 'success',
      data: {
        plan,
      },
    })

  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    })
  }
}