import { useState } from 'react';
import studentsData from '../../data/students.json';
import { PlusIcon, TrashIcon } from '../Icons';

export default function FormGrupal({ data, onChange, studentList, onAddStudent, onRemoveStudent }) {
  const [filterSem, setFilterSem] = useState('');
  const [filterGpo, setFilterGpo] = useState('');

  const handleDateChange = (e) => {
      const dateVal = e.target.value;
      const dateObj = new Date(dateVal + 'T00:00:00');
      const options = { day: 'numeric', month: 'long', year: 'numeric' };
      const formatted = dateObj.toLocaleDateString('es-ES', options); // "13 de octubre de 2026"
      
      onChange('rawDate', dateVal);
      onChange('fechaJust', formatted);
  };

  const handleLoadGroup = () => {
    if (!filterSem || !filterGpo) {
      alert('Seleccione Semestre y Grupo');
      return;
    }

    const filtered = studentsData.filter(
      (s) => s.sem === filterSem && s.gpo === filterGpo
    );

    if (filtered.length === 0) {
      alert('No hay alumnos en ese grupo en el catálogo.');
      return;
    }

    filtered.forEach(s => {
        onAddStudent({
            matricula: s.mat,
            nombre: s.nom,
            semestre: s.sem,
            grupo: s.gpo
        });
    });
  };

  return (
    <div id="form-grupal" className="form-section">
      <div className="mb-6 border-l-4 border-gob-gold pl-4 flex justify-between items-end">
        <div>
          <h3 className="text-lg font-bold text-gob-maroon">Lista de Estudiantes (Grupal)</h3>
          <p className="text-sm text-gray-500">
            Genere listas completas filtrando por grupo. Genera Original y Copia (2 hojas).
          </p>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
        <h4 className="text-sm font-bold text-gray-700 mb-3">Datos del Oficio</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
              Seleccionar Fecha
            </label>
             <input
              type="date"
              onChange={handleDateChange}
              className="form-input bg-white mb-2"
            />
            <label className="block text-[10px] text-gray-400 uppercase mb-1">
              Texto Generado
            </label>
            <input
              type="text"
              value={data.fechaJust}
              onChange={(e) => onChange('fechaJust', e.target.value)}
              className="form-input bg-gray-100"
              placeholder="Ej. 13 de octubre de 2026"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
              Horario
            </label>
            <input
              type="text"
              value={data.horario}
              onChange={(e) => onChange('horario', e.target.value)}
              className="form-input bg-white"
              placeholder="Ej. 8:00am a 15:10 Hrs"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
              Motivo
            </label>
            <input
              type="text"
              value={data.motivo}
              onChange={(e) => onChange('motivo', e.target.value)}
              className="form-input bg-white"
            />
          </div>
        </div>
      </div>

      {/* Filtro Masivo */}
      <div className="flex flex-col md:flex-row gap-4 mb-4 items-end bg-blue-50 p-3 rounded border border-blue-100">
        <div>
          <label className="block text-xs font-bold text-blue-800 uppercase mb-1">Cargar Grupo Completo</label>
          <select 
            value={filterSem} 
            onChange={(e) => setFilterSem(e.target.value)}
            className="form-input text-sm w-32"
          >
            <option value="">Semestre...</option>
            <option>PRIMERO</option>
            <option>TERCERO</option>
            <option>QUINTO</option>
            <option>SÉPTIMO</option>
          </select>
        </div>
        <div>
          <select 
            value={filterGpo}
            onChange={(e) => setFilterGpo(e.target.value)}
            className="form-input text-sm w-24"
          >
            <option value="">Gpo...</option>
            <option>A</option>
            <option>B</option>
            <option>C</option>
          </select>
        </div>
        <button
          onClick={handleLoadGroup}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition text-sm font-bold h-[38px]"
        >
          Filtrar y Cargar
        </button>
      </div>

      {/* Add Student Form */}
      <AddStudentForm onAddStudent={onAddStudent} />

      {/* Table */}
      <div className="overflow-x-auto border rounded-lg h-96 overflow-y-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-white uppercase bg-gob-maroon sticky top-0">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Matrícula</th>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Semestre</th>
              <th className="px-4 py-3">Grupo</th>
              <th className="px-4 py-3 text-right">Acción</th>
            </tr>
          </thead>
          <tbody>
            {studentList.map((st, index) => (
              <tr key={index} className="bg-white border-b hover:bg-gray-50">
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2 font-mono text-xs">{st.matricula}</td>
                <td className="px-4 py-2 font-semibold text-gray-700">{st.nombre}</td>
                <td className="px-4 py-2 text-xs">{st.semestre}</td>
                <td className="px-4 py-2 text-xs text-center">{st.grupo}</td>
                <td className="px-4 py-2 text-right">
                  <button
                    onClick={() => onRemoveStudent(index)}
                    className="text-red-500 hover:text-red-700 font-bold"
                  >
                    X
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {studentList.length === 0 && (
          <div className="text-center py-8 text-gray-400 text-xs italic">
            No hay estudiantes agregados a la lista.
          </div>
        )}
      </div>
    </div>
  );
}

function AddStudentForm({ onAddStudent }) {
  const [search, setSearch] = useState('');
  
  const handleSearchChange = (e) => {
      const val = e.target.value;
      setSearch(val);
      if(val.length >= 5) {
          const s = studentsData.find(st => st.mat === val);
          if(s) {
              document.getElementById('manual-nom-grup').value = s.nom;
              document.getElementById('manual-sem-grup').value = s.sem;
              document.getElementById('manual-gpo-grup').value = s.gpo;
          }
      }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const matricula = search;
    const nombre = document.getElementById('manual-nom-grup').value;
    const semestre = document.getElementById('manual-sem-grup').value;
    const grupo = document.getElementById('manual-gpo-grup').value;

    if (nombre) {
      onAddStudent({ matricula, nombre, semestre, grupo });
      setSearch('');
      document.getElementById('manual-nom-grup').value = '';
      document.getElementById('manual-sem-grup').value = '';
      document.getElementById('manual-gpo-grup').value = '';
    } else {
      alert('Ingrese alumno válido');
    }
  };

  return (
    <div className="flex gap-2 mb-4 items-end bg-gray-50 p-2 rounded">
      <datalist id="catalogo-alumnos2">
         {studentsData.map(s => (
            <option key={s.mat} value={s.mat}>{s.nom}</option>
         ))}
      </datalist>
      <div className="flex-1">
        <label className="text-[10px] text-gray-400 uppercase font-bold">Matrícula</label>
        <input
          list="catalogo-alumnos2"
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Buscar..."
          className="form-input text-sm h-[38px]"
        />
      </div>
      <div className="flex-[2]">
        <label className="text-[10px] text-gray-400 uppercase font-bold">Nombre</label>
        <input
          id="manual-nom-grup"
          type="text"
          placeholder="Nombre Completo"
          className="form-input text-sm bg-gray-100 h-[38px]"
          readOnly
        />
      </div>
      <div className="w-24">
         <label className="text-[10px] text-gray-400 uppercase font-bold">Sem</label>
        <input
          id="manual-sem-grup"
          type="text"
          placeholder="Sem"
          className="form-input text-sm bg-gray-100 h-[38px]"
          readOnly
        />
      </div>
      <div className="w-20">
         <label className="text-[10px] text-gray-400 uppercase font-bold">Gpo</label>
        <input
          id="manual-gpo-grup"
          type="text"
          placeholder="Gpo"
          className="form-input text-sm bg-gray-100 h-[38px]"
          readOnly
        />
      </div>
      <button
        onClick={handleSubmit}
        className="bg-gob-gold text-white px-4 py-2 rounded hover:bg-yellow-600 transition h-[38px] font-bold"
      >
        +
      </button>
    </div>
  );
}
