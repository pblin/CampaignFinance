var axios = require("axios")

function RegisterForCandidate(_name, _publicAddress, _info, _age){
  return axios.post('http://localhost:9001/candidate',{
      name: _name,
      publicAddress: _publicAddress,
      info: _info,
      age: _age,
    });
}

function RegisterForContributor(_name, _publicAddress, _info, _age){
  return axios.post('http://localhost:9001/contributor',{
      name: _name,
      publicAddress: _publicAddress,
      info: _info,
      age: _age,
    });
}


module.exports= {
  RegisterForCandidate,
  RegisterForContributor
}
