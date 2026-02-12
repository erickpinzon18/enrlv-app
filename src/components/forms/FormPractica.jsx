import { useState, useEffect } from 'react';
import schoolsData from '../../data/schools.json';
import studentsData from '../../data/students.json';

export default function FormPractica({ data, onChange }) {
  const [searchMatricula, setSearchMatricula] = useState('');
  const [selectedSchoolId, setSelectedSchoolId] = useState('');

  // Auto-fill student
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

  // Auto-fill school
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

  const handleDateChange = (e) => {
      const dateVal = e.target.value;
      const dateObj = new Date(dateVal + 'T00:00:00');
      const options = { weekday: 'long', day: 'numeric', month: 'long' };
      const formatted = dateObj.toLocaleDateString('es-ES', options); // "martes 22 de octubre"
      
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="col-span-2">
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
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

        <div className="col-span-2 md:grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
              Director (Auto)
            </label>
            <input
              type="text"
              value={data.director}
              readOnly
              className="form-input bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
              Escuela (Auto)
            </label>
            <input
              type="text"
              value={data.escuela}
              readOnly
              className="form-input bg-gray-100"
            />
          </div>
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
            placeholder="Ej. MTRA. LIDIA ARTEAGA REYNA"
          />
        </div>
      </div>

      <div className="bg-red-50 p-4 rounded-lg mb-6 border border-red-100">
        <h4 className="text-sm font-bold text-gob-maroon mb-3">Datos del Practicante</h4>
        
        {/* Search for Practicante */}
        <div className="flex gap-2 items-end mb-4">
             <datalist id="catalogo-alumnos-prac">
                {studentsData.map(s => (
                    <option key={s.mat} value={s.mat}>{s.nom}</option>
                ))}
            </datalist>
            <div className="flex-1">
                <label className="text-[10px] uppercase font-bold text-gob-maroon">Buscar Matrícula</label>
                <input 
                    list="catalogo-alumnos-prac"
                    className="form-input bg-white text-sm"
                    value={searchMatricula}
                    onChange={(e) => setSearchMatricula(e.target.value)}
                    placeholder="Buscar..."
                />
            </div>
             <div className="flex-[2]">
                <label className="text-[10px] uppercase font-bold text-gob-maroon">Nombre Alumno</label>
                <input 
                    className="form-input bg-gray-100 text-sm"
                    value={data.alumno}
                    readOnly
                />
            </div>
            <div className="w-24">
                <label className="text-[10px] uppercase font-bold text-gob-maroon">Sem</label>
                <input 
                    className="form-input bg-gray-100 text-sm"
                    value={data.pracSemestre}
                    readOnly
                />
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
             <input type="hidden" value={data.pracMatricula} />
            <label className="block text-xs font-bold text-gob-maroon uppercase mb-1">
              Fecha Inasistencia
            </label>
             <input
              type="date"
              onChange={handleDateChange}
              className="form-input bg-white mb-2"
            />
            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">
              Texto Generado
            </label>
            <input
              type="text"
              value={data.fechaIna}
              onChange={(e) => onChange('fechaIna', e.target.value)}
              className="form-input bg-white border-red-200"
              placeholder="Ej. martes 22 de octubre"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
