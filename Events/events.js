const instantiate= require('./instantiate')
const mongo = require("../models/mongo")
const addCampaginEvent =  instantiate.addCampaginEvent
const addContributorEvent=instantiate.addContributorEvent
const addPayeeEvent =  instantiate.addPayeeEvent
const addCandidateEvent=instantiate.addCandidateEvent


const web3 = require("./contractConnection").web3

addCampaginEvent.watch(function(error,result){
    if (!error){
        mongo.saveCampaignData(result);
    }
    else{
      mongo.saveErrorData("Campaign",error.message);
    }
})


addContributorEvent.watch(function(error,result){
    if (!error){
        mongo.saveContributorData(result);
    }
    else{
      mongo.saveErrorData("Contributor",error.message);
    }

})



addPayeeEvent.watch(function(error,result){
    if (!error){
        mongo.savePayeeData(result);
    }
    else{
      mongo.saveErrorData("Payee",error.message);
    }

})



addCandidateEvent.watch(function(error,result){
    if (!error){
        mongo.saveCandidateData(result);
      }
      else{
        mongo.saveErrorData("Candidate",error.message);
      }
})
