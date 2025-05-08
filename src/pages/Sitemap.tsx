
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SitemapSection {
  title: string;
  links: Array<{
    name: string;
    url: string;
  }>;
}

const sitemapData: SitemapSection[] = [
  {
    title: "Main Pages",
    links: [
      { name: "Home", url: "/" },
      { name: "About Us", url: "/about-us" },
      { name: "Our Cards", url: "/our-cards" },
      { name: "Apply For EMI", url: "/apply-loan" },
    ]
  },
  {
    title: "Services",
    links: [
      { name: "Financing Service", url: "/services/financing" },
      { name: "Pharmacy Service", url: "/services/pharmacy" },
      { name: "Ambulance Service", url: "/services/ambulance" },
      { name: "Medical Stores", url: "/services/stores" },
      { name: "Pathology Service", url: "/services/pathology" },
    ]
  },
  {
    title: "Partner Areas",
    links: [
      { name: "Hospital Registration", url: "/hospital-registration" },
      { name: "Hospital Dashboard", url: "/hospital-dashboard" },
    ]
  },
  {
    title: "Patient Area",
    links: [
      { name: "Apply For EMI", url: "/apply-loan" },
      { name: "Patient Dashboard", url: "/patient-dashboard" },
    ]
  },
  {
    title: "Support",
    links: [
      { name: "Support Dashboard", url: "/support-dashboard" },
    ]
  },
  {
    title: "Admin Areas",
    links: [
      { name: "Admin Dashboard", url: "/admin-dashboard" },
      { name: "Sales Dashboard", url: "/sales-dashboard" },
      { name: "CRM Dashboard", url: "/crm-dashboard" },
      { name: "Agent Dashboard", url: "/agent-dashboard" },
    ]
  },
  {
    title: "Legal",
    links: [
      { name: "Privacy Policy", url: "/privacy-policy" },
      { name: "Terms and Conditions", url: "/terms-and-conditions" },
    ]
  }
];

const Sitemap = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-12">
        <h1 className={`text-4xl font-bold text-center mb-8 transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          Sitemap
        </h1>
        
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sitemapData.map((section, index) => (
              <Card 
                key={section.title}
                className={`transition-all duration-700 delay-${index * 100} ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              >
                <CardHeader>
                  <CardTitle>{section.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {section.links.map((link) => (
                      <li key={link.url} className="transition-all hover:translate-x-1 duration-200">
                        <Link 
                          to={link.url}
                          className="text-brand-600 hover:text-brand-800 hover:underline flex items-center"
                        >
                          <span className="mr-2">•</span>
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Sitemap;
