export default function FormIndividual({ data, onChange }) {
  return (
    <div id="form-individual" className="form-section block">
      <div className="mb-6 border-l-4 border-gob-gold pl-4">
        <h3 className="text-lg font-bold text-gob-maroon">Datos del Estudiante</h3>
        <p className="text-sm text-gray-500">
          Genere justificantes por motivos de salud o personales.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
            Nombre Completo
          </label>
          <input
            type="text"
            value={data.nombre}
            onChange={(e) => onChange('nombre', e.target.value)}
            className="form-input"
            placeholder="Ej. TANIA ELIZABETH LOPEZ SANCHEZ"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
            Matrícula
          </label>
          <input
            type="text"
            value={data.matricula}
            onChange={(e) => onChange('matricula', e.target.value)}
            className="form-input"
            placeholder="Ej. 11135ZSAL78810"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
            Semestre
          </label>
          <select
            value={data.semestre}
            onChange={(e) => onChange('semestre', e.target.value)}
            className="form-input"
          >
            <option>PRIMERO</option>
            <option>TERCERO</option>
            <option>QUINTO</option>
            <option>SÉPTIMO</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
            Grupo
          </label>
          <select
            value={data.grupo}
            onChange={(e) => onChange('grupo', e.target.value)}
            className="form-input"
          >
            <option>A</option>
            <option>B</option>
            <option>C</option>
          </select>
        </div>
      </div>

      <div className="mb-6 border-l-4 border-gob-gold pl-4">
        <h3 className="text-lg font-bold text-gob-maroon">Detalles de la Justificación</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
            Fechas a Justificar
          </label>
          <input
            type="text"
            value={data.fechas}
            onChange={(e) => onChange('fechas', e.target.value)}
            className="form-input"
            placeholder="Ej. del día 02 y 03 de octubre de 2025"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
            Motivo (Breve)
          </label>
          <textarea
            value={data.motivo}
            onChange={(e) => onChange('motivo', e.target.value)}
            rows="2"
            className="form-input"
            placeholder="Ej. ha presentado la documentación necesaria para justificar la inasistencia..."
          />
        </div>
      </div>
    </div>
  );
}
