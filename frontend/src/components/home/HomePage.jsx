import "@/styles/home/globals.css";
import Navigation from "./Navigation";
import Hero from "./Hero";
import Features from "./Features";
import Preview from "./Preview";
import Benefits from "./Benefits";
import Footer from "./Footer";

export default function HomePage() {
  return (
    <div className="home-container">
      <Navigation />
      <Hero />
      <Features />
      <Preview />
      <Benefits />
      <Footer />
    </div>
  );
}
