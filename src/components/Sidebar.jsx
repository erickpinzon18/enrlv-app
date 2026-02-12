import { NavLink } from 'react-router-dom';
import { UserIcon, UsersIcon, DocumentDuplicateIcon, BriefcaseIcon, CogIcon } from './Icons';

const tabs = [
  { to: '/individual', label: 'Justificante Individual', Icon: UserIcon },
  { to: '/grupal', label: 'Justificante Grupal (Lista)', Icon: UsersIcon },
  { to: '/masivo', label: 'Justificante Masivo', Icon: DocumentDuplicateIcon },
  { to: '/practica', label: 'Oficio de Práctica', Icon: BriefcaseIcon },
];

export default function Sidebar() {
  const linkClass = ({ isActive }) =>
    `sidebar-link w-full text-left px-6 py-3 flex items-center space-x-3 ${
      isActive ? 'active bg-gob-gold text-white pl-6' : ''
    }`;

  return (
    <aside className="w-64 bg-gob-maroon text-white flex-shrink-0 hidden md:flex flex-col shadow-xl z-20">
      <div className="p-6 border-b border-white/20">
        <h2 className="text-xl font-bold tracking-wider">ENRLV</h2>
        <p className="text-xs text-gray-300 mt-1">Gestión Documental</p>
      </div>
      <nav className="flex-1 py-6 space-y-1">
        {tabs.map(({ to, label, Icon }) => (
          <NavLink key={to} to={to} className={linkClass}>
            <Icon className="w-5 h-5" />
            <span className="text-sm font-medium">{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Config button anchored to bottom */}
      <div className="border-t border-white/20">
        <NavLink to="/configuracion" className={linkClass}>
          <CogIcon className="w-5 h-5" />
          <span className="text-sm font-medium">Configuración</span>
        </NavLink>
      </div>

      <div className="p-4 border-t border-white/20 text-xs text-center text-gray-300">
        &copy; 2026 ENRLV - El Mexe
      </div>
    </aside>
  );
}
