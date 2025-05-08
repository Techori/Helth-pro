
import React from 'react';
import { Button } from '@/components/ui/button';

interface LanguageSwitcherProps {
  currentLanguage: 'english' | 'hindi';
  onLanguageChange: (language: 'english' | 'hindi') => void;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ currentLanguage, onLanguageChange }) => {
  return (
    <div className="flex justify-end mb-6">
      <div className="bg-gray-100 rounded-lg p-1 inline-flex">
        <Button
          variant={currentLanguage === 'english' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onLanguageChange('english')}
          className={currentLanguage === 'english' ? 'bg-brand-600 text-white' : 'text-gray-600'}
        >
          English
        </Button>
        <Button
          variant={currentLanguage === 'hindi' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onLanguageChange('hindi')}
          className={currentLanguage === 'hindi' ? 'bg-brand-600 text-white' : 'text-gray-600'}
        >
          हिंदी
        </Button>
      </div>
    </div>
  );
};

export default LanguageSwitcher;
