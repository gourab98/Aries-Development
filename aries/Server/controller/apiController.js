const data = require("../storage/data")
const http = require('http');

const hostname = process.env.ACME_AGENT_HOST || 'localhost';
const port = 8021;

// console.log('Agent is running on: ' + `http://${hostname}:${port}`);

function httpAsync(options, body) {
    return new Promise(function (resolve, reject) {
        const req = http.request(options, (res) => {
            const { statusCode } = res;
            const contentType = res.headers['content-type'];
            
            let e;
            if (statusCode !== 200) {
                e = new Error('Request Failed.\n' + `Status Code: ${statusCode}`);
            } else if (!/^application\/json/.test(contentType)) {
                e = new Error('Invalid content-type.\n' + `Expected application/json but received ${contentType}`);
            }

            if (e) {
                // Consume response data to free up memory
                res.resume();
                return reject(e);
            }
            res.setEncoding('utf8');
            let rawData = '';
            res.on('data', (chunk) => { rawData += chunk;});
            res.on('end', () => {
                try {
                    const parsedData = JSON.parse(rawData);
                    return resolve(parsedData);
                } catch (e) {
                    return reject(e);
                }
            });
        }).on('error', (e) => {
            return reject(e);
        });
        
        if (body) {
            req.write(body || '');
        }
        
        req.end();
    });
}

class AgentService {
    async getStatus() {
        try {
            const response = await httpAsync({
                hostname: hostname,
                port: port,
                path: '/status',
                method: 'GET'
            });
            return response;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async getConnections() {
        try {
            const response = await httpAsync({
                hostname: hostname,
                port: port,
                path: '/connections',
                method: 'GET'
            });
            return response.results;
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    issueCredential = async (data) => {
        try {
            const response = await httpAsync({
                hostname: hostname,
                port: port,
                path: encodeURI('/issue-credential/send-offer'),
                method: 'POST',
                headers:{
                    'content-type' : 'application/json'
                }
            }, JSON.stringify(data));
            return response;
        } catch (error) {
            console.error(error);
            return {};
        }
    }
    createInvitation = async(req,res,next) => {
        const data ="{'service_endpoint': https://6c64-27-147-234-77.ap.ngrok.io}";
        
        let response;
        try {
            response = await httpAsync({
                hostname: hostname,
                port: port,
                path: encodeURI('/connections/create-invitation?alias='+data),
                method: 'POST'
            });
            console.log(response);
            res.json({data: response})
            return response;
        } catch (error) {
            console.log(error);
            return {};
        }
    }

    async receiveInvitation(invitation) {
        try {
            const response = await httpAsync({
                hostname: hostname,
                port: port,
                path: '/connections/receive-invitation',
                method: 'POST'
            }, invitation);
            return response;
        } catch (error) {
            console.error(error);
            return;
        }
    }

    async removeConnection(connectionId) {
        try {
            await httpAsync({
                hostname: hostname,
                port: port,
                path: `/connections/${connectionId}/remove`,
                method: 'POST'
            });
        } catch (error) {
            console.error(error);
        } finally {
            return;
        }
    }

    async getProofRequests() {
        try {
            const response = await httpAsync({
                hostname: hostname,
                port: port,
                path: '/present-proof/records',
                method: 'GET'
            });
            return response.results;
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    async sendProofRequest(proofRequest) {
        try {
            await httpAsync({
                hostname: hostname,
                port: port,
                path: '/present-proof/send-request',
                method: 'POST'
            }, proofRequest);
        } catch (error) {
            console.error(error);
        } finally {
            return;
        }
    }
    //
    releaseCredential = async (req, res, next) => {
        let resp;
        try {
            resp = await httpAsync({
                hostname: hostname,
                port: port,
                path: encodeURI('/credential-definitions/created'),
                method: 'GET'
            });
            const credID = resp.credential_definition_ids[0];
            if (credID) {
                req.session.credID = credID;
                const value = {
                  auto_issue: true,
                  auto_remove: true,
                  connection_id: `${data.data}`, // you store the session when you create an invitation via the AgentService API.
                  cred_def_id: `${credID}`,
                  comment: `Offer on cred def id ${credID}`,
                  credential_preview: {
                    "@type":
                      "https://didcomm.org/issue-credential/1.0/credential-preview",
                    attributes: [
                        {
                            name: "birthdate_dateint",
                            value: "34895495454"
                          },
                          {
                            name: "name",
                            value: "Will Smith"
                          },
                          {
                            name: "timestamp",
                            value: `${Date.now()}`
                          },
                          {
                            name: "degree",
                            value: "Math"
                          },
                          {
                            name: "date",
                            value: `${Date.now()}`
                          }
                    ],
                  },
                  trace: true
                }
                const retrieveCredential = await this.issueCredential(value);
                console.log(retrieveCredential);
                res.json({Data: retrieveCredential});
                // DO what you need to do after sending the credential...may be showing a message to the website!
              }
        } catch (error) {
            console.error(error);
        } finally {
            return;
        }
    }

}

module.exports = new AgentService();