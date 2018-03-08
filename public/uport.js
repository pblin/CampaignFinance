const Connect = window.uportconnect.Connect
const SimpleSigner = window.uportconnect.SimpleSigner


// const credentials = new Connect('Terry\'s new app', {
//   clientId: '2ojQCY9AFsB2FgWYyNk7hiXyoGyYczU4z8V',
//   network: 'rinkeby',
//   signer: SimpleSigner('bec71def7b1718851726cd2b020000ee63f5c3456335d33674ef96a52929ef6f'),
//   //networks: {'0x4': {'registry' : '0x2cc31912b2b0f3075a87b3640923d45a26cef3ee', 'rpcUrl' : 'https://rinkeby.infura.io'}}
//
// })


const credentials = new Connect("HuangJyunYu\'s new app", {
clientId: "2orZ8SPR2jApEMaX6H5BzYFXx5kyBi6TQXA",
signer: SimpleSigner("73fb2900f051fcf38d5369514ad9a904da77d5bb5a3a05e5ffaff2ea7f6c4a31"),
network: 'rinkeby'
})



uportConnect = function(){
  credentials.requestCredentials({
    requested: ['name', 'phone','avatar', 'country'],
    notifications: true // We want this if we want to recieve credentials
  }).then((credential)=>{
    console.log(credential)
  })
}


handleIt = function(Campaign,amount){


}


function getWeb3(callback) {
  if (typeof window.web3 === 'undefined') {
    // no web3, use fallback
    console.error("Please use a web3 browser");
  } else {
    // window.web3 == web3 most of the time. Don't override the provided,
    // web3, just wrap it in your Web3.
    var myWeb3 = new Web3(window.web3.currentProvider);

    // the default account doesn't seem to be persisted, copy it to our
    // new instance
    myWeb3.eth.defaultAccount = window.web3.eth.defaultAccount;

    callback(myWeb3);
  }
}


function startApp(web3) {
  console.log(web3)
}

window.addEventListener('load', function() {
  getWeb3(startApp);
});
