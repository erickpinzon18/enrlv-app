export default function FormPractica({ data, onChange }) {
  return (
    <div id="form-practica" className="form-section">
      <div className="mb-6 border-l-4 border-gob-gold pl-4">
        <h3 className="text-lg font-bold text-gob-maroon">Justificante de Práctica (Externo)</h3>
        <p className="text-sm text-gray-500">
          Dirigido a Directores de Escuelas Primarias.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="col-span-2">
          <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
            Director de la Primaria
          </label>
          <input
            type="text"
            value={data.director}
            onChange={(e) => onChange('director', e.target.value)}
            className="form-input"
            placeholder="MTRO. ANDRES VIGUERAS VELAZQUEZ"
          />
        </div>
        <div className="col-span-2">
          <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
            Nombre de la Escuela Primaria
          </label>
          <input
            type="text"
            value={data.escuela}
            onChange={(e) => onChange('escuela', e.target.value)}
            className="form-input"
            placeholder="ESCUELA PRIMARIA ALVARO OBREGÓN"
          />
        </div>
        <div className="col-span-2">
          <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
            Atención A (Docente Titular)
          </label>
          <input
            type="text"
            value={data.atn}
            onChange={(e) => onChange('atn', e.target.value)}
            className="form-input"
            placeholder="MTRA. LIDIA ARTEAGA REYNA"
          />
        </div>
      </div>

      <div className="bg-red-50 p-4 rounded-lg mb-6 border border-red-100">
        <h4 className="text-sm font-bold text-gob-maroon mb-3">Datos del Practicante</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gob-maroon uppercase mb-1">
              Nombre Alumno
            </label>
            <input
              type="text"
              value={data.alumno}
              onChange={(e) => onChange('alumno', e.target.value)}
              className="form-input bg-white"
              placeholder="VIRIDIANA FUENTES BLANCO"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gob-maroon uppercase mb-1">
              Matrícula
            </label>
            <input
              type="text"
              value={data.pracMatricula}
              onChange={(e) => onChange('pracMatricula', e.target.value)}
              className="form-input bg-white"
              placeholder="221310790000"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gob-maroon uppercase mb-1">
              Semestre
            </label>
            <input
              type="text"
              value={data.pracSemestre}
              onChange={(e) => onChange('pracSemestre', e.target.value)}
              className="form-input bg-white"
              placeholder="SÉPTIMO"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gob-maroon uppercase mb-1">
              Fecha Inasistencia
            </label>
            <input
              type="text"
              value={data.fechaIna}
              onChange={(e) => onChange('fechaIna', e.target.value)}
              className="form-input bg-white"
              placeholder="martes 22 de octubre"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
