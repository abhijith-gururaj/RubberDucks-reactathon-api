var { buildSchema } = require('graphql');
var GraphQLDate = require('graphql-date')
var mongoStuff = require('./mongoSchema')
global.atob = require("atob");
var JobOpening = mongoStuff.JobOpening;
var Candidate = mongoStuff.Candidate;
var Admin = mongoStuff.Admin;

// GraphQL schema
var schema = buildSchema(`
    scalar Date
    type Query {
        message: String,
        language: String,
        job(jobId : Int!) : Job,
        jobs : [Job],
        isValidUser(email : String, password : String) : User
    },
    type Mutation {
        createJobOpening(jobPortfolio : String, jobDescription : String) : Job,
        createCandidate(candidateName : String, candidateAge : Int, workExperience : Int, email : String) : Candidate,
        createAdmin(adminName : String, email : String) : Admin,
        createJobApplication(candidateId : Int!, jobId : Int!) : JobApplication
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
    interface User{
        email : String!,
        password : String!,
        role : String!,
        isValid : Boolean
    }
    type Candidate implements User{
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
    type Admin implements User{
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
    var candidate = Candidate.findOne({email : args.email, password : args.password});
    if(candidate){
        return candidate;
    } else {
        return Admin.findOne({email : args.email, password : args.password});
    }
}

function createAdmin(args){

}

function createJobApplication(args){

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
        createJobApplication : createJobApplication
};

module.exports.resolver = resolver;
module.exports.schema = schema;