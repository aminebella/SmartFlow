import Navigation from "./Navigation";
import Hero from "./Hero";
import Features from "./Features";
import Preview from "./Preview";
import Benefits from "./Benefits"; 
import Testimonials from "./Testimonials";
import Footer from "./Footer";

export default function HomePage() {
  return (
    <div className="home-container">
        {/* NAVIGATION */}
        <Navigation />
        {/* HERO */}
        <Hero />
        

      {/* Placeholder for next sections: logos-strip, features, preview, benefits, testimonials, cta, footer */}
      <div className="logos-strip">
        <div className="container">
          <div className="logos-inner">
            <div className="logos-label">Trusted by leading teams at</div>
            <div className="logos-row">
              <div className="logo-item">Acme</div>
              <div className="logo-item">Stripe</div>
              <div className="logo-item">Figma</div>
              <div className="logo-item">Notion</div>
              <div className="logo-item">Shopify</div>
              <div className="logo-item">CupGemini</div>
              <div className="logo-item">Emsi</div>
            </div>
          </div>
        </div>
      </div>

        {/* FEATURES */}
        <Features />

        {/* PREVIEW */}
        <Preview />

        {/* BENEFITS SECTION */}

      <Benefits />

      {/* TESTIMONIALS */}
      <Testimonials />

      {/* FOOTER (template) */}
      <Footer />
      
    </div>
  );
}