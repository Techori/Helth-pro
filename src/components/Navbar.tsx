import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, Globe, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';

const Navbar = () => {
  const { authState, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [language, setLanguage] = useState('en'); // 'en' for English, 'hi' for Hindi
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'hi' : 'en');
    // In a real app, you would update the UI language here
  };

  const handleLogout = () => {
    signOut();
    navigate('/');
  };

  const handleDashboardClick = () => {
    if (authState.user) {
      navigate(`/${authState.user.role}-dashboard`);
    }
  };

  // Translations
  const translations = {
    en: {
      home: "Home",
      applyLoan: "Apply Loan",
      ourCards: "Our Cards",
      aboutUs: "About Us",
      services: "Our Services",
      login: "Login",
      dashboard: "Dashboard",
      logout: "Logout",
      getStarted: "Get Started",
      pharma: "RI Medicare Pharma",
      ambulance: "Quick Ambulance Service",
      stores: "Pharmacy Retail Stores",
      pathology: "RI Medicare Pathology",
      financing: "Healthcare Financing"
    },
    hi: {
      home: "होम",
      applyLoan: "लोन के लिए आवेदन करें",
      ourCards: "हमारे कार्ड",
      aboutUs: "हमारे बारे में",
      services: "हमारी सेवाएं",
      login: "लॉग इन",
      dashboard: "डैशबोर्ड",
      logout: "लॉग आउट",
      getStarted: "शुरू करें",
      pharma: "आरआई मेडिकेयर फार्मा",
      ambulance: "त्वरित एंबुलेंस सेवा",
      stores: "फार्मेसी रिटेल स्टोर्स",
      pathology: "आरआई मेडिकेयर पैथोलॉजी",
      financing: "हेल्थकेयर फाइनेंसिंग"
    }
  };

  const t = translations[language as keyof typeof translations];

  const linkItems = [
    { name: 'Home', to: '/' },
    { name: 'Our Cards', to: '/our-cards' },
    // Only show Apply Loan for authenticated patients
    ...(authState.user?.role === 'patient' ? [{ name: 'Apply for Loan', to: '/patient-dashboard?tab=loans' }] : []),
    { name: 'Hospital Registration', to: '/hospital-registration' },
    { name: 'About Us', to: '/about-us' }
  ];

  const serviceLinks = [
    { name: t.financing, path: '/services/financing' },
    { name: t.pharma, path: '/services/pharma' },
    { name: t.ambulance, path: '/services/ambulance' },
    { name: t.stores, path: '/services/stores' },
    { name: t.pathology, path: '/services/pathology' },
  ];

  const isAuthenticated = authState.initialized && authState.user !== null;

  return (
    <nav 
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'py-3 bg-white/80 backdrop-blur-md shadow-sm' 
          : 'py-5 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link 
              to="/" 
              className="flex items-center space-x-2"
              aria-label="RI Medicare"
            >
              <div className="font-display font-bold text-2xl text-gradient">
                RI <span className="text-medicare-600">Medicare</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {linkItems.map((link) => (
              <Link
                key={link.name}
                to={link.to}
                className={`font-medium transition-colors duration-200 ${
                  location.pathname === link.to
                    ? 'text-brand-600'
                    : 'text-gray-700 hover:text-brand-600'
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            {/* Services Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={`font-medium transition-colors duration-200 flex items-center space-x-1 text-gray-700 hover:text-brand-600`}
                >
                  <span>{t.services}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white w-56">
                {serviceLinks.map((service) => (
                  <DropdownMenuItem key={service.name} asChild>
                    <Link
                      to={service.path}
                      className="w-full px-2 py-2 cursor-pointer"
                    >
                      {service.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Button 
              variant="outline" 
              className="font-medium flex items-center space-x-1"
              onClick={toggleLanguage}
              title={language === 'en' ? 'Switch to Hindi' : 'अंग्रेजी में बदलें'}
            >
              <Globe className="h-4 w-4 mr-1" />
              {language === 'en' ? 'हिंदी' : 'English'}
            </Button>
            
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="font-medium bg-brand-600 hover:bg-brand-700">
                    <User className="h-4 w-4 mr-1" />
                    {authState.user?.firstName || t.dashboard}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleDashboardClick}>
                    {t.dashboard}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-1" />
                    {t.logout}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link to="/login">
                  <Button className="font-medium bg-brand-600 hover:bg-brand-700">
                    {t.login}
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="font-medium bg-brand-600 hover:bg-brand-700">
                    {t.getStarted}
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="icon"
              className="font-medium"
              onClick={toggleLanguage}
              title={language === 'en' ? 'Switch to Hindi' : 'अंग्रेजी में बदलें'}
            >
              <Globe className="h-4 w-4" />
            </Button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-brand-600 hover:bg-gray-100 focus:outline-none"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div
        className={`md:hidden glassmorphism overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-screen shadow-lg' : 'max-h-0'
        }`}
      >
        <div className="px-4 pt-2 pb-4 space-y-1 sm:px-6">
          {linkItems.map((link) => (
            <Link
              key={link.name}
              to={link.to}
              className={`block py-3 px-3 rounded-md font-medium ${
                location.pathname === link.to
                  ? 'bg-brand-50 text-brand-600'
                  : 'text-gray-700 hover:bg-brand-50 hover:text-brand-600'
              }`}
            >
              {link.name}
            </Link>
          ))}
          
          {/* Mobile Services Menu */}
          <div className="py-3 px-3">
            <div className="font-medium text-gray-700 mb-2">{t.services}</div>
            <div className="pl-4 space-y-1">
              {serviceLinks.map((service) => (
                <Link
                  key={service.name}
                  to={service.path}
                  className={`block py-2 px-3 rounded-md text-sm ${
                    location.pathname === service.path
                      ? 'bg-brand-50 text-brand-600'
                      : 'text-gray-600 hover:bg-brand-50 hover:text-brand-600'
                  }`}
                >
                  {service.name}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="pt-3 space-y-3">
            {isAuthenticated ? (
              <>
                <Button 
                  variant="outline" 
                  className="w-full font-medium"
                  onClick={handleDashboardClick}
                >
                  {t.dashboard}
                </Button>
                <Button 
                  className="w-full font-medium bg-brand-600 hover:bg-brand-700"
                  onClick={handleLogout}
                >
                  {t.logout}
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" className="block">
                  <Button variant="outline" className="w-full font-medium">
                    {t.login}
                  </Button>
                </Link>
                <Link to="/signup" className="block">
                  <Button className="w-full font-medium bg-brand-600 hover:bg-brand-700">
                    {t.getStarted}
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
