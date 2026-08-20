import "./page.scss";
import HubspotForm from "@/app/globals/components/forms/HubspotForm";

export default function ContactPageSection() {
  return (
    <main id="About">
      <section className="contact-section">
        <HubspotForm />
      </section>
    </main>
  );
}