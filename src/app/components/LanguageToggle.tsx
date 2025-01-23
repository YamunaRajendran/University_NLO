"use client";

import { useLanguage } from '../context/LanguageContext';

export default function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="px-4 py-2 bg-[#15234A]/80 text-white rounded-md hover:bg-[#15234A] transition-colors font-['Roboto_regular'] text-sm flex items-center gap-2"
    >
      <span>{language === 'en' ? 'عربي' : 'English'}</span>
      {/* <span className="text-[#2CCAD3]">{language === 'en' ? 'AR' : 'EN'}</span> */}
    </button>
  );
}
