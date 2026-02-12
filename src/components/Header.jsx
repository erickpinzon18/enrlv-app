import { useLocation } from 'react-router-dom';

const titles = {
  individual: 'Justificante Individual',
  grupal: 'Justificante Grupal (Lista)',
  masivo: 'Justificante Masivo',
  practica: 'Oficio de Práctica',
  configuracion: 'Configuración',
};

export default function Header() {
  const location = useLocation();
  const currentTab = location.pathname.replace('/', '') || 'individual';

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm z-10">
      <div className="px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="md:hidden text-gob-maroon font-bold text-xl">ENRLV</div>
          <h1 className="text-lg font-bold text-gob-grey hidden md:block">
            {titles[currentTab] || 'ENRLV'}
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-gob-maroon">
              MTRA. ADELINA MENDOZA AGUILAR
            </p>
            <p className="text-[10px] text-gray-500">Coordinación Docente</p>
          </div>
          <div className="h-8 w-8 bg-gob-gold rounded-full flex items-center justify-center text-white font-bold text-xs">
            AM
          </div>
        </div>
      </div>
    </header>
  );
}
