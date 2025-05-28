import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, LogOut, User } from 'lucide-react';
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
  };

  const linkItems = [
    { name: 'Home', to: '/' },
    { name: 'Our Cards', to: '/our-cards' },
    { name: 'Apply for Loan', to: '/apply-loan' },
    { name: 'Hospital Registration', to: '/hospital-registration' },
    { name: 'About Us', to: '/about-us' }
  ];

  const serviceLinks = [
    { name: translations.financing, path: '/services/financing' },
    { name: translations.pharma, path: '/services/pharma' },
    { name: translations.ambulance, path: '/services/ambulance' },
    { name: translations.stores, path: '/services/stores' },
    { name: translations.pathology, path: '/services/pathology' },
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
              <img 
                src="/fca8c184-cea2-4af8-9ecb-338bf4292c6d.png" 
                alt="RI Medicare Logo" 
                className="h-11 w-auto"
              />
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
                  <span>{translations.services}</span>
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
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="font-medium bg-brand-600 hover:bg-brand-700">
                    <User className="h-4 w-4 mr-1" />
                    {authState.user?.firstName || translations.dashboard}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleDashboardClick}>
                    {translations.dashboard}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-1" />
                    {translations.logout}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link to="/login">
                  <Button className="font-medium bg-brand-600 hover:bg-brand-700">
                    {translations.login}
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="font-medium bg-brand-600 hover:bg-brand-700">
                    {translations.getStarted}
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
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
        className={`md:hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        } overflow-hidden`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 bg-white shadow-lg">
          {linkItems.map((link) => (
            <Link
              key={link.name}
              to={link.to}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                location.pathname === link.to
                  ? 'text-brand-600 bg-brand-50'
                  : 'text-gray-700 hover:text-brand-600 hover:bg-gray-50'
              }`}
            >
              {link.name}
            </Link>
          ))}
          
          {/* Mobile Services Links */}
          <div className="px-3 py-2">
            <div className="text-base font-medium text-gray-700 mb-2">
              {translations.services}
            </div>
            <div className="pl-4 space-y-2">
              {serviceLinks.map((service) => (
                <Link
                  key={service.name}
                  to={service.path}
                  className="block text-gray-600 hover:text-brand-600"
                >
                  {service.name}
                </Link>
              ))}
            </div>
          </div>

          {isAuthenticated ? (
            <>
              <button
                onClick={handleDashboardClick}
                className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-brand-600 hover:bg-gray-50"
              >
                {translations.dashboard}
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-brand-600 hover:bg-gray-50"
              >
                {translations.logout}
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-brand-600 hover:bg-gray-50"
              >
                {translations.login}
              </Link>
              <Link
                to="/signup"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-brand-600 hover:bg-gray-50"
              >
                {translations.getStarted}
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;