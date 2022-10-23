import React, { useEffect, useState } from "react";
import Styles from "./startingUI.module.css";
import QRCode from "qrcode";

const StartingUI = () => {
  const [data, setData] = useState("");
  const [qrcode, setQrcode] = useState("");
  let connectionID;

  const setValue = () =>{
    sessionStorage.setItem('connection_id', connectionID.conID);
  }
  const getValue = () =>{
    sessionStorage.getItem('connection_id');
  }

  const handleSubmit = async (e) => {
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
 

  return (
    <div className={Styles.main}>
      <form onSubmit={handleSubmit}>
        <div className={Styles.container}>
          <div className={Styles.childDiv}>
            <button
              className={Styles.button}
              type="submit"
              // onClick={GenerateQRCode}
            >
              Create Invitation
            </button>
            <button className={Styles.button}>Release Credential</button>
            <button className={Styles.button}>Send Proof Request</button>

            <img className={Styles.image} src={qrcode} alt=""/>
          </div>
        </div>
      </form>
    </div>
  );
};


export default StartingUI;
