import React, { useEffect, useState } from "react";
import Styles from "./startingUI.module.css";
import QRCode from "qrcode";


const StartingUI = () => {
  const [data, setData] = useState("");
  const [qrcode, setQrcode] = useState("");
  const [screenMsg, setScreenMsg] = useState(""); 

  // Create Invitation
  const handleCreateInvitation = async (e) => {
    console.log("Here is the invitation Link: ");
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:5000/create-invitation",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const responseData = await response.json();
      setScreenMsg("");
      setData(responseData.data.invitation_url);
      console.log(responseData.data.invitation_url);

    } catch (err) {
      throw err;
    }
  };

  useEffect(()=>{
    const GenerateQRCode = () => {
      QRCode.toDataURL(data, (err, data) => {
        if (err) return console.error(err);
        setQrcode(data);
      });
    };
    GenerateQRCode();
  }, [data])
 
  // Release Credential 
  const handleCredentialIssue = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "http://localhost:5000/credential",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      ); 

      const responseData = await response.json();
      if(response.ok){
          setScreenMsg(responseData.Data.connection_id);
          console.log(responseData.Data.connection_id);
      }
    } catch (err) {
      throw err;
    }
  };

   // Send Proof Request 
   const handleProofReq = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "http://localhost:5000/proofReq",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      ); 

      const responseData = await response.json();
      console.log(responseData);
    } catch (err) {
      throw err;
    }
  };

  return (
    <div className={Styles.main}>
      <form>
        <div className={Styles.container}>
          <div className={Styles.childDiv}>
            <button
              className={Styles.button}
              type="submit"
              onClick={handleCreateInvitation}
            >
              Create Invitation
            </button>
            <button className={Styles.button} onClick={handleCredentialIssue} type="submit">Release Credential</button>
            <button className={Styles.button} onClick={handleProofReq} type="submit">Send Proof Request</button>

            <img className={Styles.image} src={qrcode} alt=""/>
            {screenMsg? <p>Successfully Issued Credential to this {screenMsg}</p> : <p></p>}
          </div>
        </div>
      </form>
    </div>
  );
};


export default StartingUI;
