const data = require("../storage/data");
const apiController = require("./apiController");

const Issue = async (req, res, next) => {
  axios
    .get("http://127.0.0.1:8021/credential-definitions/created") //use this get the credential ID
    .then((resp) => {
      // const credID = resp.data["credential_definition_ids"][0];
      const credID = data.data; 

      if (credID) {
        req.session.credID = credID;
        const data = {
          auto_issue: true,
          auto_remove: true,
          connection_id: req.session.conID, // you store the session when you create an invitation via the AgentService API.
          cred_def_id: credID,
          comment: "Offer on cred def id " + credID,
          credential_preview: {
            "@type":
              "https://didcomm.org/issue-credential/1.0/credential-preview",
            attributes: [
              {
                name: "name",
                value: "Will Smith",
              },
              {
                name: "email",
                value: "sfr@er.et",
              },
              {
                name: "address",
                value: "Ringstraße 43, 53225 Bonn, Germany",
              },
              {
                name: "birthdate_dateint",
                value: "19980204",
              },
              {
                name: "role",
                value: "faculty",
              },
              {
                name: "timestamp",
                value: "" + Date.now(),
              },
            ],
          },
        };

        const response = axios.post("http://127.0.0.1:8021/issue-credential/send-offer", data);
        console.log(response);
        res.json({data: response});
        // DO what you need to do after sending the credential...may be showing a message to the website!

      }
    })
    .catch((err) => {
      console.error(err);
    });
};

module.exports = { Issue };
