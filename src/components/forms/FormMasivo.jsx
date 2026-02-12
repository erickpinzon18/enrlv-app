export default function FormMasivo({ data, onChange, showAlert }) {
  return (
    <div id="form-masivo" className="form-section">
      <div className="mb-6 border-l-4 border-gob-gold pl-4">
        <h3 className="text-lg font-bold text-gob-maroon">Justificación Masiva (Académica)</h3>
        <p className="text-sm text-gray-500">
          Solicitud dirigida al Cuerpo Académico para grupos completos.
        </p>
      </div>

      <div className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h4 className="text-xs font-bold text-gray-700 uppercase mb-3">Datos del Oficio</h4>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
              Dirigido A
            </label>
            <input
              type="text"
              value={data.dirigido}
              onChange={(e) => onChange('dirigido', e.target.value)}
              className="form-input"
              placeholder="Ej. CUERPO ACADÉMICO - ESCUELA NORMAL RURAL LUIS VILLARREAL"
            />
          </div>

          <div className="mt-4">
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
              Cuerpo del Texto
            </label>
            <textarea
              value={data.cuerpo}
              onChange={(e) => onChange('cuerpo', e.target.value)}
              rows="8"
              className="form-input leading-relaxed"
              placeholder="Escriba aquí la solicitud..."
            />
            <p className="text-xs text-gray-400 mt-1">
              El texto se justificará automáticamente en el PDF.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
