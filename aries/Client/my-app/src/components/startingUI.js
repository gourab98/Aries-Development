import React, {useState, useEffect} from "react";
import Styles from "./startingUI.module.css";
import QRCode from 'qrcode';

const StartingUI = () => {

  const [data, setData] = useState("");
  const [qrImage, setQrImage] = useState();

  const handleSubmit = async (e) => {
    console.log("hello");
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/create-invitation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const responseData = await response.json();
      setData(responseData.data.invitation_url);
      console.log(responseData.data.invitation_url);
    } catch (err) {
      throw err;
    }
  };


  return (
    <div className={Styles.main}>
      <form onSubmit={handleSubmit}>
      <div className={Styles.container}>
        <div className={Styles.childDiv}>
          <button className={Styles.button} type="submit">Create Invitation</button>
          <button className={Styles.button}>Release Credential</button>
          <button className={Styles.button}>Send Proof Request</button>
          {/* <img src={qrImage} alt=""/> */}
        </div>
      </div>
      </form>
    </div>
  );
};

export default StartingUI;
