const mongoose = require('mongoose');
const slugify = require('slugify')
const validator = require('validator')

const surveySchema = new mongoose.Schema(
  {
    slug: String,
    question: {
      type: String,
      required: [true, 'A survey must have a question'],
      unique: true,
      trim: true,
      maxlength: [100, 'A survey question must be less than or equal to 100 characters'],
      minlength: [10, 'A survey question must be greater than 10 characters'],
      // validate: validator.isAplha.
    },
    answer:{
      type: [String],
      required: [true, 'A survey must have an answer'],
    },
    severity: {
      type: String,
      required: [true, 'A survey must have a Severity level'],
      enum: {
        values: ['low', 'medium', 'high'],
        message: 'severity level is either: low, medium, high'
      }
    },
    duration:{
      type: Number,
      default: 5,
      min: [1, 'Duration must be 1 or above'],
      max: [10, 'Duration must be 10 or below']
    },
    category:{
      type: String,
      default: 'normal'
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false
    },
    secretSurvey: {
      type: Boolean,
      default: false
    }
  })

  // DOCUMENT MIDDLEWARE: runs before .save() .create
  surveySchema.pre('save', function(next){
    this.slug = slugify(this.question, {lower: true})
    next()
  })
  
  // surveySchema.pre('save', function(next){
  //   console.log('Will Save Doc')
  // })
  // surveySchema.post('save', function(doc, next){
  //   console.log(doc)
  //   next()
  // })

  // QUERY MIDDLEWARE
  surveySchema.pre(/^find/, function(next){
  // surveySchema.pre('find', function(next){
    this.find({ secretSurvey: { $ne: true }})

    this.start = Date.now()
    next()
  })

  surveySchema.post(/^find/, function(docs, next){
    console.log(`Query Took ${Date.now() - this.start} milliseconds`)
    next()
  })

  // AGGREGATION MIDDLEWARE

  surveySchema.pre('aggregate', function(next){
    this.pipeline().unshift({ $match: { secretSurvey: { $ne: true}}})
    next()
  })
  const Survey = mongoose.model('Survey', surveySchema)

  module.exports = Survey;