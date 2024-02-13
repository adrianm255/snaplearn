import { useState } from 'react';
import translations from './translations.json';

const useTranslation = () => {
  const [locale, setLocale] = useState('en');

  const t = (key) => {
    return translations[locale][key] || key;
  };

  return { t, setLocale };
};

export default useTranslation;
