import React from "react";
import "./style.css";

const SendEmailPage = () => {
  return (
    <main className="postevent-page">
      <div className="postevent-container" id="activation-container">
        <h2>You're almost there!</h2>
        <p>
          Just <span className="pay-attention">check your email</span> for a
          message from us.
        </p>
        <p>We've sent you a quick note to activate your account.</p>
        <p>Make sure to peek inside your inbox!</p>
        <p>
          Didn't see our email? Don't sweat it!{" "}
          <span className="pay-attention">Check your spam folder too.</span>
        </p>
        <p>
          Once you find our email, just click on the special link inside, and
          voila! You're officially part of the crew.
        </p>
        <p>
          <span className="pay-attention">Can't wait to see you around!</span>
        </p>
      </div>
    </main>
  );
};

export default SendEmailPage;
