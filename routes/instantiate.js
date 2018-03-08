const contractConnection = require('./contractConnection')
const contractBuilder = contractConnection.contractBuilder
const Registry = contractConnection.Registry
const RegistryAddress = contractConnection.RegistryAddress


let escrowContractInstance = contractBuilder("./contracts/CampaignRegistry.sol", RegistryAddress, ":CampaignRegistry");
let RegistryCaller = new Registry(escrowContractInstance);



module.exports = {
    RegistryCaller
}
