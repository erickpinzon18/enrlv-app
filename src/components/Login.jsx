import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!user || !pass) {
      setError('Ingrese usuario y contraseña.');
      return;
    }

    setLoading(true);

    // Simulate auth delay
    setTimeout(() => {
      if (user === 'admin' && pass === 'admin123') {
        sessionStorage.setItem('enrlv_auth', 'true');
        navigate('/individual');
      } else {
        setError('Credenciales incorrectas. Intente de nuevo.');
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#691c32] via-[#4a1323] to-[#2d0b15] flex items-center justify-center p-4">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gob-gold via-gob-gold/50 to-transparent"></div>
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-gob-gold/5 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-gob-gold/5 blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 border border-white/20 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-gob-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-wide">ENRLV</h1>
          <p className="text-gob-gold/80 text-sm mt-1">Sistema de Gestión Documental</p>
          <p className="text-white/40 text-xs mt-0.5">Escuela Normal Rural "Luis Villarreal"</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-gob-gold to-gob-gold/60"></div>

          <div className="p-8">
            <h2 className="text-lg font-bold text-gray-800 mb-1">Iniciar Sesión</h2>
            <p className="text-xs text-gray-400 mb-6">Ingrese sus credenciales para acceder al sistema.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">Usuario</label>
                <input
                  type="text"
                  className="form-input text-sm"
                  placeholder="Ingrese su usuario"
                  value={user}
                  onChange={(e) => setUser(e.target.value)}
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">Contraseña</label>
                <input
                  type="password"
                  className="form-input text-sm"
                  placeholder="Ingrese su contraseña"
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg px-4 py-2.5 font-medium">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gob-maroon text-white font-bold py-3 rounded-lg hover:bg-red-900 transition text-sm disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                      <path fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" className="opacity-75" />
                    </svg>
                    Verificando...
                  </span>
                ) : (
                  'Acceder al Sistema'
                )}
              </button>
            </form>
          </div>

          <div className="bg-gray-50 px-8 py-3 text-center">
            <p className="text-[10px] text-gray-400">© 2026 ENRLV - El Mexe · Coordinación Docente</p>
          </div>
        </div>
      </div>
    </div>
  );
}
