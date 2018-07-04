var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
//Setup mongodb connection
mongoose.connect('mongodb://localhost:6000/local')
var db = mongoose.connection;
db.on('error', ()=> {console.log( '---FAILED to connect to mongoose')})
db.once('open', () => {
 console.log( '+++Connected to mongoose')
});
autoIncrement.initialize(mongoose.connection);
//DB Schema
var Schema = mongoose.Schema;

var jobSchema = new Schema({
    jobId : Number,
    jobPortfolio : String,
    createdOn : Date,
    jobName : String,
    closedOn : Date,
    isActive : Boolean,
    jobDescription : String,
    interviewDate : Date,
    lastDateToApply : Date
}, {collection : "verizonJobs"});
jobSchema.plugin(autoIncrement.plugin, {model: 'jobOpening', field: 'jobId'});

var JobOpening = mongoose.model('jobOpening', jobSchema);

// // Duplicate the ID field.
// jobSchema.virtual('id').get(function(){
//     return this._id.toHexString();
// });

// // Ensure virtual fields are serialised.
// jobSchema.set('toJSON', {
//     virtuals: true
// });

module.exports.JobOpening = JobOpening;

var candidateSchema = new Schema({
    candidateId : Number,
    candidateName : String,
    candidateAge : Number,
    registrationDate : Date,
    workExperience : Number,
    email : String,
    role : String,
    password : String
}, {collection:"candidates"});
candidateSchema.plugin(autoIncrement.plugin, {model: 'candidate', field: 'candidateId'});
var Candidate = mongoose.model('candidate', candidateSchema);
module.exports.Candidate = Candidate;


var adminSchema = new Schema({
    adminId : Number,
    adminName : String,
    role : String,
    email : String
}, {collection:"admins"});
adminSchema.plugin(autoIncrement.plugin, {model: 'admin', field: 'adminId'});
var Admin = mongoose.model('admin', adminSchema);
module.exports.Admin = Admin;

var applicationSchema = new Schema({
    applicationId : Number,
    jobId : Number,
    candidateId : Number,
    appliedOn : Date
}, {collection:"applications"});
applicationSchema.plugin(autoIncrement.plugin, {model: 'application', field: 'applicationId'});
var JobApplication = mongoose.model('application', applicationSchema);
module.exports.JobApplication = JobApplication;


var jobFeedbackSchema = new Schema({
    feedbackId : Number,
    candidateId : Number,
    jobId : Number,
    feedback : String,
    createdOn : Date,
    positive : Boolean,
    rating : Number
}, {collection:"jobFeedback"});
adminSchema.plugin(autoIncrement.plugin, {model: 'feedback', field: 'feedbackId'});
var JobFeedback = mongoose.model('feedback', jobFeedbackSchema);
module.exports.JobFeedback = JobFeedback;


var personSchema = new Schema({
    personId : Number,
    candidateName : String,
    candidateAge : Number,
    registrationDate : Date,
    workExperience : Number,
    email : String,
    role : String,
    adminId : Number,
    adminName : String,
    isValid : Boolean,
    password : String
}, {collection:"Person"});
personSchema.plugin(autoIncrement.plugin, {model: 'person', field: 'personId'});
var Person = mongoose.model('person', personSchema);
module.exports.Person = Person;