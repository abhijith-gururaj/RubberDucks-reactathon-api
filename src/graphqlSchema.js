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
        feedback(feedbackId : Int!) : JobFeedback
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
        interviewDate : Date,
        lastDateToApply : Date
    }
    type Person{
        email : String!,
        password : String,
        role : String!,
        isValid : Boolean
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
    return JobApplication.create({candidateId : args.candidateId, jobId : args.jobId, createdOn : new Date()})
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
        feedbacks: getAllFeedbacks
};

module.exports.resolver = resolver;
module.exports.schema = schema;