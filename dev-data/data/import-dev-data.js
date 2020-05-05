const fs = require('fs')
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Survey = require('./../../models/surveyModel')

dotenv.config({ path: './config.env'})


const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.PASSWORD)

mongoose.connect(DB, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
}).then( () => {
  console.log('DB connection Successful')
})


// READ JSON FILE

const surveys = JSON.parse(fs.readFileSync(`${__dirname}/survey-simple.json`, 'utf-8'))

// IMPORT DATA INTO DB

const importData = async () => {
    try {
        await Survey.create(surveys)
        console.log('Data Successfully Loaded!')
    } catch (err) {
        console.log(err)
    }
    process.exit()
}


// Delete All DATA FROM COLLECTION

const deleteData = async () => {
    try {
        await Survey.deleteMany()
        console.log('Data Successfully Deleted!')
    } catch (err) {
        console.log(err)
    }
    process.exit()
}

if (process.argv[2] === '--import') {
    importData()   
}else if (process.argv[2] === '--delete') {
    deleteData()
}
console.log(process.argv)