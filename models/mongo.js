var mongoose = require("mongoose");
var url= process.env.MongoURL
//var url= "mongodb://hodler:hodl@ds139138.mlab.com:39138/teststuff"
mongoose.connect(url, function (err) {

   if (err) throw err;

   console.log('Successfully connected to mongo server');

});


var SHA256 = require("js-sha3").sha3_256;

/*
##########################################
*/
var escrowDepositSchema = mongoose.Schema({
    eventName: {
      type: String,
      default: "addCampaign"
    },
    eventArgs: {
        token: String,
        user: String,
        amount:Number,
        balance:Number
    },
    blockData:{
      blocknumber:Number,
      blockhash:String
    },
    transactionHash: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    id: {type: String, index: {unique: true, dropDups: true}}

});

var escrowDeposit = mongoose.model('escrowDeposit', escrowDepositSchema);

saveDepositData= function(data,callBack){
  try{
    var depositEventData = new escrowDeposit({
      eventName:data.df,
      eventArgs: {
          token: data.args.token,
          user: data.args.user,
          amount:data.args.amount.toNumber(),
          balance:data.args.balance.toNumber()
      },
      blockData:{
        blocknumber:data.blockNumber.toNumber(),
        blockhash:data.blockHash
      },
      transactionHash:data.transactionHash,
      id : SHA256(data.transactionHash+data.blockHash+data.logIndex)
    });
  }
  catch(err) {
    saveErrorData("deposit",err.message);
    return;
  }
  depositEventData.save(function(err) {
    if (err){
      saveErrorData("deposit",err.message);
      console.log(err.message);
    }
      else {console.log('Deposit Data successfully saved.');}
  });
}


/*
##########################################
*/

var escrowDistributionSchema = mongoose.Schema({
    eventName: {
      type: String,
      default: "escrowDistribution"
    },
    eventArgs: {
        token: String,
        host: String,
        hunter:String,
        amount:Number,
        timestamp:Number
    },
    blockData:{
      blocknumber:Number,
      blockhash:String
    },
    transactionHash: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    id:{type: String, index: {unique: true, dropDups: true}}

});

var escrowDistribution = mongoose.model('escrowDistribution', escrowDistributionSchema);

saveDistributionData= function(data){
  try{
  var distributionEventData = new escrowDistribution({
    eventName:data.event,
    eventArgs: {
        token: data.args.token,
        host: data.args.host,
        hunter:data.args.hunter,
        amount:data.args.amount.toNumber(),
        timestamp: data.args.timestamp.toNumber()
    },
    blockData:{
      blocknumber:data.blockNumber.toNumber(),
      blockhash:data.blockHash
    },
      transactionHash:data.transactionHash,
      id : SHA256(data.transactionHash+data.blockHash+data.logIndex)
  });
}
catch(err) {
  saveErrorData("distribution",err.message);
  return;
}

  distributionEventData.save(function(err) {
    if (err){
      saveErrorData("distribution",err.message);
      console.log(err.message);
    }
      else{console.log('Distribution Data successfully saved.');}
  });
}


/*
##########################################
*/

var stakeRecievedSchema = mongoose.Schema({
    eventName: {
      type: String,
      default: "stakeRecieved"
    },
    eventArgs: {
        BountyID: Number,
        hunter: String,
        amount:Number
    },
    blockData:{
      blocknumber:Number,
      blockhash:String
    },
    transactionHash: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    id: {type: String, index: {unique: true, dropDups: true}}

});

var stakeRecieved = mongoose.model('stakeRecieved', stakeRecievedSchema);

saveStakeRecievedData= function(data){
  try{
  var stakeRecievedEventData = new stakeRecieved({
    eventName:data.event,
    eventArgs: {
        BountyId: data.args.bountyId.toNumber(),
        hunter: data.args.hunter,
        amount:data.args.amount.toNumber()
    },
    blockData:{
      blocknumber:data.blockNumber.toNumber(),
      blockhash:data.blockHash
    },
      transactionHash:data.transactionHash,
      id : SHA256(data.transactionHash+data.blockHash+data.logIndex)
  });
  }
  catch(err) {
    saveErrorData("recieved",err.message);
    return;
  }
  stakeRecievedEventData.save(function(err) {
    if (err){
      saveErrorData("recieved",err.message);
      console.log(err.message);
    }
      else{console.log('stake recieved Data successfully saved.');}
  });
}

/*
##########################################
*/

var stakeReleasedSchema = mongoose.Schema({
    eventName: {
      type: String,
      default: "stakeReleased"
    },
    eventArgs: {
        bountyId: Number,
        from: String,
        to: String,
        amount:Number
    },
    blockData:{
      blocknumber:Number,
      blockhash:String
    },
    transactionHash: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    id:{type: String, index: {unique: true, dropDups: true}}

});


var stakeReleased = mongoose.model('stakeReleased', stakeReleasedSchema);

saveStakeReleasedData= function(data){
  try{
  var stakeReleasedEventData = new stakeReleased({
    eventName:data.event,
    eventArgs: {
        bountyId: data.args.bountyId.toNumber(),
        from: data.args.from,
        to: data.args.to,
        amount:data.args.amount.toNumber()
    },
    blockData:{
      blocknumber:data.blockNumber.toNumber(),
      blockhash:data.blockHash
    },
      transactionHash:data.transactionHash,
      id : SHA256(data.transactionHash+data.blockHash+data.logIndex)
  });
  }
  catch(err) {
    saveErrorData("released",err.message);
    return;
  }

  stakeReleasedEventData.save(function(err) {
      if (err){
        saveErrorData("released",err.message);
        console.log(err.message);
      }
      else{console.log('Stake release Data successfully saved.');}
  });
}


/*
##########################################
*/



var errorLogSchema = mongoose.Schema({
    eventName: String,
    erroString: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
});


var errorLog = mongoose.model('errorLog', errorLogSchema);

saveErrorData= function(_eventName,data){
  var errorLogData = new errorLog({
    eventName:_eventName,
    erroString: data
  });
  errorLogData.save(function(err) {
      if (err) {console.log(err.message);}
      else{
        console.log('error message successfully saved.');
      }
  });
}

module.exports= {
  saveErrorData,
  saveStakeReleasedData,
  saveStakeRecievedData,
  saveDistributionData,
  saveDepositData
}
