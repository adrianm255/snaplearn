import { useState } from 'react';
import translations from './translations.json';

interface TranslationArgs {
  [key: string]: string | number;
}

const useTranslation = () => {
  const [locale, setLocale] = useState('en');

  const t = (key: string, args?: TranslationArgs): string => {
    let translation = translations[locale][key] || key;
    if (args) {
      Object.keys(args).forEach(argKey => {
        translation = translation.replace(new RegExp(`{${argKey}}`, 'g'), args[argKey].toString());
      });
    }
    return translation;
  };

  return { t, setLocale };
};


export default useTranslation;
