'use client'

import { ContactModal } from "@/components/contact-modal";
import { useState, useEffect } from "react";
import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { UpcomingFeatures } from "@/components/landing/UpcomingFeatures";
import { CallToAction } from "@/components/landing/CallToAction";
import { FAQ } from "@/components/landing/FAQ";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleOpenContact = () => setIsContactModalOpen(true);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Header onOpenContact={handleOpenContact} />
      
      <Hero />
      
      <Features />
      
      <HowItWorks />
      
      <UpcomingFeatures onOpenContact={handleOpenContact} />
      
      <CallToAction />
      
      <FAQ onOpenContact={handleOpenContact} />
      
      <Footer onOpenContact={handleOpenContact} />

      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(50px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }
        .animate-slide-up {
          animation: slideUp 1s ease-out forwards;
        }
        .animate-fade-in.delay-100 {
          animation-delay: 0.1s;
        }
        .animate-fade-in.delay-200 {
          animation-delay: 0.2s;
        }
        .animate-fade-in.delay-300 {
          animation-delay: 0.3s;
        }
      `}</style>
    </div>
  );
}