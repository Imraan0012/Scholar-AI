"use client";
import React from "react";
import { HeroParallax } from "@/components/ui/hero-parallax";

export default function HeroParallaxDemo() {
  return <HeroParallax products={products} />;
}

export const products = [
  {
    title: "National Scholarship Portal (NSP)",
    link: "#scholarships",
    thumbnail: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1000&auto=format&fit=crop",
    category: "Central Govt",
    grant: "Up to ₹2,00,000/yr"
  },
  {
    title: "Tata Trusts Merit Scholarship",
    link: "#scholarships",
    thumbnail: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1000&auto=format&fit=crop",
    category: "Philanthropic Trust",
    grant: "100% Tuition Aid"
  },
  {
    title: "Reliance Foundation Undergraduate",
    link: "#scholarships",
    thumbnail: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1000&auto=format&fit=crop",
    category: "Merit-cum-Means",
    grant: "Up to ₹2,00,000"
  },
  {
    title: "INSPIRE Fellowship (DST)",
    link: "#scholarships",
    thumbnail: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=1000&auto=format&fit=crop",
    category: "Research Grant",
    grant: "₹80,000/yr + Mentorship"
  },
  {
    title: "Chevening UK Scholarships",
    link: "#scholarships",
    thumbnail: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=1000&auto=format&fit=crop",
    category: "Global Fellowship",
    grant: "Full Ride + Living"
  },
  {
    title: "PM-YASASVI Scheme",
    link: "#scholarships",
    thumbnail: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=1000&auto=format&fit=crop",
    category: "Ministry of Social Justice",
    grant: "Up to ₹1,25,000/yr"
  },
  {
    title: "Post-Matric State Aid",
    link: "#scholarships",
    thumbnail: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1000&auto=format&fit=crop",
    category: "State Domicile",
    grant: "Fee Concession"
  },
  {
    title: "DAAD Germany Study Grant",
    link: "#scholarships",
    thumbnail: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?q=80&w=1000&auto=format&fit=crop",
    category: "International Exchange",
    grant: "€934/Month Stipend"
  },
  {
    title: "Google Women Techmakers",
    link: "#scholarships",
    thumbnail: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1000&auto=format&fit=crop",
    category: "Women in STEM",
    grant: "$1,000 + Retreat"
  },
  {
    title: "Aditya Birla Scholarship",
    link: "#scholarships",
    thumbnail: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=1000&auto=format&fit=crop",
    category: "Premier Institutes",
    grant: "₹3,00,000/yr"
  },
  {
    title: "Fulbright-Nehru Fellowship",
    link: "#scholarships",
    thumbnail: "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1000&auto=format&fit=crop",
    category: "USA Master's & PhD",
    grant: "Full Funding"
  },
  {
    title: "Santoor Women's Scholarship",
    link: "#scholarships",
    thumbnail: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=1000&auto=format&fit=crop",
    category: "Underprivileged Support",
    grant: "₹24,000/yr"
  },
  {
    title: "Kishore Vaigyanik Protsahan (KVPY)",
    link: "#scholarships",
    thumbnail: "https://images.unsplash.com/photo-1507668077129-56e32842fceb?q=80&w=1000&auto=format&fit=crop",
    category: "Pure Sciences",
    grant: "₹7,000/mo + Contingency"
  },
  {
    title: "L'Oréal India For Young Women",
    link: "#scholarships",
    thumbnail: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1000&auto=format&fit=crop",
    category: "Science Graduation",
    grant: "₹2,50,000"
  },
  {
    title: "Inlaks Shivdasani Fellowship",
    link: "#scholarships",
    thumbnail: "https://images.unsplash.com/photo-1460518451282-47d0f1628e43?q=80&w=1000&auto=format&fit=crop",
    category: "Specialized Arts & Sci",
    grant: "$100,000 Max"
  }
];
