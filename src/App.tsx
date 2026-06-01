import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import AuthSystem from "./components/AuthSystem";
import Hero from "./components/Hero";
import Statistics from "./components/Statistics";
import About from "./components/About";
import AboutPillars from "./components/AboutPillars";
import Campaigns from "./components/Campaigns";
import OrganizationIdentity from "./components/OrganizationIdentity";
import NewsSection from "./components/NewsSection";
import Gallery from "./components/Gallery";
import GuideSection from "./components/GuideSection";
import Partners from "./components/Partners";
import JoinForm from "./components/JoinForm";
import DonationSection from "./components/DonationSection";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";
import { dbInstance } from "./lib/db";

export default function App() {
  const [activeSection, setActiveSection] = useState("home");
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Check auth state on start and updates
  const checkAuthStatus = () => {
    try {
      const stored = localStorage.getItem("pvp_current_user");
      if (stored) {
        const user = JSON.parse(stored);
        setIsLoggedIn(true);
        setIsAdmin(user.role === "admin" && user.email.toLowerCase() === "tomarvansh475@gmail.com");
      } else {
        setIsLoggedIn(false);
        setIsAdmin(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Monitor and dynamically apply siteTitle and siteFavicon 
  useEffect(() => {
    const handleUpdateIdentity = () => {
      try {
        const content = dbInstance.getSiteContent();
        document.title = content.siteTitle || "पश्चिमांचल विकास परिषद";
        
        let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
        if (!link) {
          link = document.createElement('link');
          link.rel = 'icon';
          document.getElementsByTagName('head')[0].appendChild(link);
        }
        
        const faviconValue = content.siteFavicon || "🌱";
        // Check if value is basic symbol/emoji or image URL
        if (faviconValue.length <= 4) {
          const canvas = document.createElement("canvas");
          canvas.width = 32;
          canvas.height = 32;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.clearRect(0, 0, 32, 32);
            ctx.font = "26px sans-serif";
            ctx.textBaseline = "middle";
            ctx.textAlign = "center";
            ctx.fillText(faviconValue, 16, 17);
            link.href = canvas.toDataURL();
          }
        } else {
          link.href = faviconValue;
        }
      } catch (err) {
        console.error("Error setting dynamic favicon:", err);
      }
    };

    handleUpdateIdentity();
    window.addEventListener("storage", handleUpdateIdentity);
    const interval = setInterval(handleUpdateIdentity, 2000);
    return () => {
      window.removeEventListener("storage", handleUpdateIdentity);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    // List of keys corresponding to sections to track in real-time scroll
    const sectionIds = [
      "home",
      "about",
      "pillars",
      "campaigns",
      "news",
      "join",
      "donate",
      "contact"
    ];

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 180; // offset header height

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    // Trigger on initial render
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#f5f1e8] text-stone-900 font-sans" id="pvp-root-layout">
      
      {/* 1. Navigation Panel Header */}
      <Header 
        activeSection={activeSection} 
        onOpenAuth={() => setIsAuthOpen(true)}
        isLoggedIn={isLoggedIn}
        isAdmin={isAdmin}
      />

      <AuthSystem
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginStatusChange={checkAuthStatus}
      />

      {/* Main Sections Body List */}
      <main aria-label="NGO PVP Main Content container">
        
        {/* 2. Hero Section (Home) */}
        <Hero />

        {/* 3. Horizontal Stats metrics ribbon */}
        <Statistics />

        {/* 4. About Organisation Intro */}
        <About />

        {/* 5. 7 Action Pillars detailed card grids */}
        <AboutPillars />

        {/* 6. Active Campaigns with informational dialog popups */}
        <Campaigns />

        {/* 7. Organization Identity Board */}
        <OrganizationIdentity />

        {/* 8. News, media announcements and Press block */}
        <NewsSection />

        {/* 9. Imagery Ground Works Gallery masonry grid and Lightbox */}
        <Gallery />

        {/* 10. Operational Guides and Mentors Advisory board */}
        <GuideSection />

        {/* 11. Infinite auto scrolling brand partners marquee */}
        <Partners />

        {/* 12. Digital environment volunteer registration induction */}
        <JoinForm />

        {/* 13. Collaborative campaigns danyatra support & scan QR panel */}
        <DonationSection />

        {/* 14. Contact Form, locations and embed Google map block */}
        <ContactSection />

      </main>

      {/* 15. Forest deep green footer */}
      <Footer />

    </div>
  );
}
