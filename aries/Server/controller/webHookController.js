const webHooks = async (req, res, next) => {
    
	console.log("Webhooks: ");
    const conID = req.body['connection_id'] //Whenver webhooks is activated from aca-py, a connection ID is passed and you can retrieve it like this....
	const conStatus = req.body['rfc23_state'] // Different methods have different status. You retrieve the status and then check what functionaliy was completed....
	
	if(conID){
		if(conStatus === "completed"){
			console.log("Invitation Completed with conID:" + conID)
			// .....
		}
		if(req.body['state'] === 'credential_acked'){
			console.log("Credential acked...")
			// ....
		}
		if(req.body['verified'] === 'true'){
			console.log("Credential verified after proof request..:")
			
			// You can now retrieve the attributes from the proof request via this way.....
			var base64data = JSON.stringify(req.body['presentation_request_dict']['request_presentations~attach'][0]['data']['base64'])
			const decodedString = Buffer.from(base64data, "base64");
			const jsonData = JSON.parse(decodedString.toString());
			proofStatus = true
			retrievedAttribute = jsonData['requested_attributes']['0_role']['value']
			// ....now decide what you need to do, for example store in a database...
		}
	}
	req.session.conID = 123;
    req.session.save();
    console.log(req.session.conID);
	res.json({conID : conID});
  };

const session = async (req, res, next) =>{
	console.log(req.session.conID);
  	res.send("hello");
}


module.exports = {webHooks, session};