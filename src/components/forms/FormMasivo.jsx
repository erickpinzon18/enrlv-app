export default function FormMasivo({ data, onChange }) {
  return (
    <div id="form-masivo" className="form-section">
      <div className="mb-6 border-l-4 border-gob-gold pl-4">
        <h3 className="text-lg font-bold text-gob-maroon">Justificación Masiva (Académica)</h3>
        <p className="text-sm text-gray-500">
          Solicitud dirigida al Cuerpo Académico para grupos completos.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
            Dirigido A
          </label>
          <input
            type="text"
            value={data.dirigido}
            onChange={(e) => onChange('dirigido', e.target.value)}
            className="form-input"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
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

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Fecha del Oficio
            </label>
            <input
              type="text"
              value={data.fechaMas}
              onChange={(e) => onChange('fechaMas', e.target.value)}
              className="form-input"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              No. Oficio
            </label>
            <input
              type="text"
              value={data.folioMas}
              onChange={(e) => onChange('folioMas', e.target.value)}
              className="form-input"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
