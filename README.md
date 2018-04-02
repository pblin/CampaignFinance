##Registration
webapp for registering


##CampaignBackend
Back end server used by government entity to approve and decline registraions

##CampaignDonation
webapp for registered contributors to donate to campaign


##Contracts
contains solidity contracts

flat contracts are used for deployment.

##IPFS
allow users to add info to IPfS



##Instructions for running locally
to start each service on your local machine, go into the each directory and npm install.
then npm start to start up the services

Registration: localhost:2345
CampaignDonation: localhost:1234
CampaignBackend: localhost:


#Example user flow for starting a new campaign
First Register as a candidate on the Registration app. a profile of you will be created on IPFS.
Then up load your campaign related info to ipfs. start a new campaign by deploying a campaignfund contract on
the Registration app.
Provide the IPFS hash of your logo as well (later on we will be providing UI to upload images to ipfs)

now go to your campaignManagement page and start managing your campaign fund!

#Example user flow for contributing to campaign
First Register as a contributor on the Registration app. a profile of you will be created on IPFS.
Then go to the campaign donation app to check out existing campaign/candidates.
Contribute by inputing the name of the campaign and amount to contribute (must either use metamask or uport)
