var { buildSchema } = require('graphql');
var GraphQLDate = require('graphql-date')
var mongoStuff = require('./mongoSchema')
global.atob = require("atob");
var JobOpening = mongoStuff.JobOpening;
var Candidate = mongoStuff.Candidate;
var Admin = mongoStuff.Admin;
var JobApplication = mongoStuff.JobApplication;
var JobFeedback = mongoStuff.JobFeedback;
var Person = mongoStuff.Person;
// // GraphQL schema
// interface User{
//     email : String!,
//     password : String,
//     role : String!,
//     isValid : Boolean
// }
var schema = buildSchema(`
    scalar Date
    type Query {
        message: String,
        language: String,
        job(jobId : Int!) : Job,
        jobs : [Job],
        isValidUser(email : String, password : String) : Person,
        candidate(email : String!) : Candidate,
        candidates : [Candidate],
        feedback(feedbackId : Int!) : JobFeedback,
        jobApplications(candidateId : Int) : [AppWrapper],
        application(applicationId : Int) : AppWrapper
    },
    type Mutation {
        createJobOpening(jobPortfolio : String, jobDescription : String) : Job,
        createCandidate(candidateName : String, candidateAge : Int, workExperience : Int, email : String, password : String) : Candidate,
        createAdmin(adminName : String, email : String) : Admin,
        createJobApplication(candidateId : Int!, jobId : Int!) : JobApplication,
        createFeedback(candidateId : Int, jobId : Int, feedback : String, rating : Int, positive : Boolean) : JobFeedback
    }
    type Job {
        jobId : Int!,
        jobPortfolio : String!,
        createdOn : Date,
        jobName : String,
        closedOn : Date,
        isActive : Boolean!,
        jobDescription : String!,
        lastDateToApply : Date,
        interviewDate : Date
    }
    type Person{
        email : String!,
        password : String,
        role : String!,
        isValid : Boolean
    }
    type AppWrapper{
        jobId : Int,
        candidateId : Int,
        applicationId : Int,
        candidateName : String,
        jobName : String,
        interviewDate : Date,
        jobDescription : String,
        appliedOn : Date
    }
    type Candidate{
        email : String!,
        password : String!,
        role : String!,
        isValid : Boolean,
        candidateId : Int!,
        candidateName : String,
        candidateAge : Int,
        registrationDate : Date,
        workExperience : Int
    }
    type Admin{
        email : String!,
        password : String!,
        role : String!,
        isValid : Boolean,
        adminId : Int!,
        adminName : String
    }
    type JobApplication {
        applicationId : Int!,
        jobId : Int!,
        candidateId : Int!,
        appliedOn : Date
    }
    type JobFeedback {
        feedbackId : Int!,
        candidateId : Int!,
        jobId : Int!,
        feedback : String,
        createdOn : Date,
        positive : Boolean,
        rating : Int
    }
`);

function getSingleJob(args){
    console.log("db? lol");
    return JobOpening.findOne({jobId : args.jobId}, function(err){
        if(err){
            console.log('lol error');
        }
    });
}

function getAllJobs(args){
    return JobOpening.find({});
}

function insertJobOpening(args){
    return JobOpening.create({jobPortfolio : args.jobPortfolio, jobDescription : args.jobDescription, createdOn : new Date(), isActive : true})
    .then(newDoc => JobOpening.findOne({jobId : newDoc.jobId}));
}

function isValidUser(args){
    return Person.findOne({email : args.email, password : args.password});
}

function createAdmin(args){

}

function createJobApplication(args){
    return JobApplication.create({candidateId : args.candidateId, jobId : args.jobId, appliedOn : new Date()})
    .then(newDoc => JobApplication.findOne({applicationId : newDoc.applicationId}));
}

function createCandidate(args){
    Person.create({candidateName : args.candidateName, candidateAge : args.candidateAge, workExperience : args.workExperience, isActive : true , 
        email : args.email, password : args.password, registrationDate : new Date(), role : "candidate"})
    return Candidate.create({candidateName : args.candidateName, candidateAge : args.candidateAge, workExperience : args.workExperience, isActive : true , 
        email : args.email, password : args.password, registrationDate : new Date(), role : "candidate"})
    .then(newDoc => Candidate.findOne({candidateId : newDoc.candidateId}));
}

function getSingleCandidate(args){
    return Candidate.findOne({email : args.email})
}

function getAllCandidates(args){
    return Candidate.find({});
}

function createFeedback(args){
    return JobFeedback.create({candidateId : args.candidateId, jobId : args.jobId, feedback : args.feedback, rating : args.rating, positive : args.positive, createdOn : new Date()}).then(newDoc => JobFeedback.findOne({feedbackId : newDoc.feedbackId}));
}

function getSingleFeedBack(args){
    return JobFeedback.findOne({feedbackId : args.feedbackId});
}

function getAllFeedbacks(args){
    return JobFeedback.find({});
}

async function getAllApplications(args){
    
    var objs = [];

    await JobApplication.find({"candidateId" : args.candidateId},(err, apps) => {
        apps.forEach(function (app){
            var job = JobOpening.findOne({"jobId" : app.jobId});
            var candidate = Candidate.findOne({"candidateId" : args.candidateId});
            var obj = {};
            obj.applicationId = app.applicationId;
            obj.jobId = app.jobId;
            obj.jobName = job.jobName;
            obj.candidateName = candidate.candidateName;
            obj.interviewDate = job.interviewDate;
            obj.appliedOn = app.appliedOn;
            objs.push(obj);
            console.log("app id");
            console.log(obj.applicationId);
        });
    });
    console.log("objs")
    console.log(objs)
    return objs;
}

async function getApplication(args){
    var obj = {};
    console.log(applicationId);
    await JobApplication.findOne({"applicationId" : args.applicationId}, (err, app) => {
        var job = JobOpening.findOne({"jobId" : app.jobId});
            var candidate = Candidate.findOne({"candidateId" : app.candidateId});
            obj.applicationId = app.applicationId;
            obj.jobId = app.jobId;
            obj.jobName = job.jobName;
            obj.jobDescription = job.jobDescription;
            obj.candidateName = candidate.candidateName;
            obj.interviewDate = job.interviewDate;
            console.log("app id");
            console.log(obj.applicationId);
    });
    return obj;
}
// Root resolver
var resolver = {
        Date : GraphQLDate,
        message: () => 'Hello World!',
        language: () => 'Italian',
        job : getSingleJob,
        jobs : getAllJobs,
        createJobOpening : insertJobOpening,
        isValidUser : isValidUser,
        createAdmin : createAdmin,
        createJobApplication : createJobApplication,
        createCandidate : createCandidate,
        candidate : getSingleCandidate,
        candidates : getAllCandidates,
        createFeedback : createFeedback,
        feedback: getSingleFeedBack,
        feedbacks: getAllFeedbacks,
        jobApplications: getAllApplications,
        application: getApplication
};

module.exports.resolver = resolver;
module.exports.schema = schema;