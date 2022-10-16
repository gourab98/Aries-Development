import React, {useEffect ,useState} from "react";
import Styles from "./startingUI.module.css";
import QRCode from 'qrcode';

const StartingUI = () => {

  const [data, setData] = useState("");
  const [qrcode, setQrcode] = useState("");

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

  const GenerateQRCode =() =>{
    // useEffect(()=>{
    //   QRCode.toDataURL(data).then((setQrcode));
    // },[])
    console.log(qrcode)

    QRCode.toDataURL(data,(err,data)=>{
      if(err) return console.error(err)

      console.log(data)
      setQrcode(data)
    })
  }


  return (
    <div className={Styles.main}>
      <form onSubmit={handleSubmit}>
      <div className={Styles.container}>
        <div className={Styles.childDiv}>
          <button className={Styles.button} type="submit" onClick={GenerateQRCode}>Create Invitation</button>
          <button className={Styles.button}>Release Credential</button>
          <button className={Styles.button}>Send Proof Request</button>
          {/* <img src={qrImage} alt=""/> */}
          <img className={Styles.image} src={qrcode}/>
        </div>
      </div>
      </form>
    </div>
  );
};

export default StartingUI;
