import { useState, useEffect } from 'react';
import schoolsData from '../../data/schools.json';
import studentsData from '../../data/students.json';

export default function FormPractica({ data, onChange, showAlert }) {
  const [searchMatricula, setSearchMatricula] = useState('');
  const [selectedSchoolId, setSelectedSchoolId] = useState('');

  // Auto-fill student from catalog
  useEffect(() => {
    if (searchMatricula.length >= 5) {
      const student = studentsData.find(s => s.mat === searchMatricula);
      if (student) {
        onChange('alumno', student.nom);
        onChange('pracMatricula', student.mat);
        onChange('pracSemestre', student.sem);
      }
    }
  }, [searchMatricula]);

  // Auto-fill school from catalog
  const handleSchoolChange = (e) => {
    const id = e.target.value;
    setSelectedSchoolId(id);
    const school = schoolsData.find(s => s.id == id);
    if (school) {
      onChange('director', school.dir);
      onChange('escuela', school.esc);
    } else {
      onChange('director', '');
      onChange('escuela', '');
    }
  };

  // Date → auto-generate formatted text
  const handleDateChange = (e) => {
    const dateVal = e.target.value;
    if (!dateVal) return;
    const dateObj = new Date(dateVal + 'T00:00:00');
    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    const formatted = dateObj.toLocaleDateString('es-ES', options);

    onChange('rawDate', dateVal);
    onChange('fechaIna', formatted);
  };

  return (
    <div id="form-practica" className="form-section">
      <div className="mb-6 border-l-4 border-gob-gold pl-4">
        <h3 className="text-lg font-bold text-gob-maroon">Justificante de Práctica (Externo)</h3>
        <p className="text-sm text-gray-500">
          Dirigido a Directores de Escuelas Primarias. Seleccione del catálogo.
        </p>
      </div>

      {/* ── Escuela ── */}
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
        <h4 className="text-xs font-bold text-gray-700 uppercase mb-3">Datos de la Escuela</h4>

        <div className="mb-3">
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
            Seleccionar Escuela (Catálogo)
          </label>
          <select
            className="form-input"
            onChange={handleSchoolChange}
            value={selectedSchoolId}
          >
            <option value="">Seleccione una escuela primaria...</option>
            {schoolsData.map(s => (
              <option key={s.id} value={s.id}>{s.esc}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
          <div>
            <label className="block text-[10px] text-gray-400 uppercase font-bold mb-1">
              Director (Auto)
            </label>
            <input
              type="text"
              value={data.director}
              readOnly
              className="form-input bg-gray-100 text-sm"
            />
          </div>
          <div>
            <label className="block text-[10px] text-gray-400 uppercase font-bold mb-1">
              Escuela (Auto)
            </label>
            <input
              type="text"
              value={data.escuela}
              readOnly
              className="form-input bg-gray-100 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
            Atención A (Docente Titular)
          </label>
          <input
            type="text"
            value={data.atn}
            onChange={(e) => onChange('atn', e.target.value)}
            className="form-input"
            placeholder="Ej. MTRA. LIDIA ARTEAGA REYNA"
          />
        </div>
      </div>

      {/* ── Practicante ── */}
      <div className="bg-red-50 p-4 rounded-lg border border-red-100 mb-4">
        <h4 className="text-xs font-bold text-gob-maroon uppercase mb-3">Datos del Practicante</h4>

        <datalist id="catalogo-alumnos-prac">
          {studentsData.map(s => (
            <option key={s.mat} value={s.mat}>{s.nom}</option>
          ))}
        </datalist>

        <div className="flex flex-wrap gap-3 items-end mb-4">
          <div className="flex-1 min-w-[140px]">
            <label className="text-[10px] uppercase font-bold text-gob-maroon block">Buscar Matrícula</label>
            <input
              list="catalogo-alumnos-prac"
              className="form-input bg-white text-sm"
              value={searchMatricula}
              onChange={(e) => setSearchMatricula(e.target.value)}
              placeholder="Ej. 241305120001"
            />
          </div>
          <div className="flex-[2] min-w-[200px]">
            <label className="text-[10px] uppercase font-bold text-gob-maroon block">Nombre Alumno</label>
            <input
              className="form-input bg-gray-100 text-sm"
              value={data.alumno}
              readOnly
              placeholder="Se llenará automáticamente..."
            />
          </div>
          <div className="w-28">
            <label className="text-[10px] uppercase font-bold text-gob-maroon block">Semestre</label>
            <input
              className="form-input bg-gray-100 text-sm"
              value={data.pracSemestre}
              readOnly
            />
          </div>
        </div>

        <input type="hidden" value={data.pracMatricula} />
      </div>

      {/* ── Fecha ── */}
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h4 className="text-xs font-bold text-gray-700 uppercase mb-3">Fecha de Inasistencia</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] text-gray-400 uppercase font-bold mb-1">
              Seleccionar Fecha
            </label>
            <input
              type="date"
              value={data.rawDate || ''}
              onChange={handleDateChange}
              className="form-input bg-white"
            />
          </div>
          <div>
            <label className="block text-[10px] text-gray-400 uppercase font-bold mb-1">
              Texto Generado
            </label>
            <input
              type="text"
              value={data.fechaIna}
              disabled
              className="form-input bg-gray-100"
              placeholder="Se generará automáticamente..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
