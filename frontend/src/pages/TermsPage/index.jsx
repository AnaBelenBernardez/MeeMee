import React from "react";
import "./style.css";
import ScrollToTop from "../../components/ScrollToTop";
import { useTranslation } from "react-i18next";

function TermsPage() {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;

  return (
    <main className="terms-page">
      <ScrollToTop />
      <div id="terms-page">
        <h1>Terms of Service for Meemee</h1>
        <h2>
          Welcome to Meemee! Before you dive into the app, here's a quick
          rundown of our straightforward Terms of Service:
        </h2>

        <p>
          <strong>Acceptance of Terms</strong>
          <br />
          By using MeeMee, you agree to abide by these Terms of Service. If
          these terms don't vibe with you, feel free to step away from our
          gathering.
        </p>

        <p>
          <strong>Community Spirit</strong>
          <br />
          MeeMee thrives on community vibes. No vibes that dampen the spirit of
          togetherness will be tolerated.
        </p>

        <p>
          <strong>Your MeeMee Space</strong>
          <br />
          Your account is your MeeMee space. Safeguard it like you would your
          secret recipe for the perfect potluck dish.
        </p>

        <p>
          <strong>Event Contributions</strong>
          <br />
          Your events, your rules. While hosting a gathering, be the gracious
          host you'd want to meet at someone else's event.
        </p>

        <p>
          <strong>Privacy and Mingling</strong>
          <br />
          We respect your privacy like a whispered conversation in a cozy
          corner. Check our <a href="/privacy">Privacy Policy</a> for the inside
          scoop.
        </p>

        <p>
          <strong>Intellectual Gathering</strong>
          <br />
          MeeMee is our collective masterpiece. No swiping ideas – let's keep
          the creative potluck going.
        </p>

        <p>
          <strong>Limitation of Event Liability</strong>
          <br />
          The real magic happens when people connect. We're not liable for any
          extraordinary connections or memorable moments.
        </p>

        <p>
          <strong>Harmony Law</strong>
          <br />
          These terms dance to the rhythm of community harmony. Any disputes
          will be settled with a friendly dialogue, not a courtroom drama.
        </p>

        <p>
          Questions or want to share your event tales? Drop us a line at{" "}
          <a href="mailto:support@meemee.com">support@MeeMee.com</a>.
        </p>

        <p>
          Happy MeeMee-ing!
          <br />
          MeeMee Team
          <br />
        </p>
      </div>
    </main>
  );
}

export default TermsPage;
