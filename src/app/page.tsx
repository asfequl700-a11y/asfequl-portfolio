import Loader from "./components/Loader";
import HexagonVideo from "./components/HexagonVideo";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Experience from "./components/Experience";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import BottomNav from "./components/BottomNav";
import ScrollReveal from "./components/ScrollReveal";
import ThemeToggle from "./components/ThemeToggle";

export default function Home() {
  return (
    <>
      <ThemeToggle />
      <Loader />
      <HexagonVideo />
      <div className="noise"></div>

      <main>
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Contact />
      </main>

      <Footer />
      <BottomNav />
      <ScrollReveal />
    </>
  );
}
