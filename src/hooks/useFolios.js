import { useState, useEffect } from 'react';

const STORAGE_KEY = 'enrlv_folios';

const initialFolios = {
  individual: 1,
  grupal: 1,
  masivo: 1,
  practica: 1,
};

export function useFolios() {
  const [folios, setFolios] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : initialFolios;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(folios));
  }, [folios]);

  const incrementFolio = (type) => {
    setFolios((prev) => ({
      ...prev,
      [type]: (prev[type] || 0) + 1,
    }));
  };

  const getFolioDisplay = (type) => {
    const num = folios[type] || 1;
    return String(num).padStart(4, '0');
  };

  return { folios, incrementFolio, getFolioDisplay };
}
