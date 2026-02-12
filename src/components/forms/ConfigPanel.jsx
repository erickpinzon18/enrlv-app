import { useState } from 'react';
import studentsData from '../../data/students.json';
import schoolsData from '../../data/schools.json';

// ── Sub-tab selector ──
function ConfigTabs({ activeTab, onTabChange }) {
  const tabs = [
    { id: 'alumnos', label: 'Administrar Alumnos' },
    { id: 'escuelas', label: 'Administrar Escuelas' },
  ];
  return (
    <div className="flex border-b border-gray-200 mb-6">
      {tabs.map(t => (
        <button
          key={t.id}
          onClick={() => onTabChange(t.id)}
          className={`px-6 py-3 text-sm font-bold transition-all border-b-2 ${
            activeTab === t.id
              ? 'border-gob-maroon text-gob-maroon'
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

// ── ALUMNOS SECTION ──
function AlumnosSection({ showAlert }) {
  const semestres = ['PRIMERO', 'SEGUNDO', 'TERCERO', 'CUARTO', 'QUINTO', 'SEXTO', 'SÉPTIMO', 'OCTAVO', 'NOVENO', 'DÉCIMO', 'UNDÉCIMO', 'DUODÉCIMO'];
  const grupos = ['A', 'B', 'C', 'D', 'E', 'F'];

  const [filterSem, setFilterSem] = useState('');
  const [filterGpo, setFilterGpo] = useState('');
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);

  // New student form
  const [newStudent, setNewStudent] = useState({ mat: '', nom: '', sem: 'PRIMERO', gpo: 'A' });

  const handleFilter = () => {
    if (!filterSem) {
      if (showAlert) showAlert('Seleccione al menos un semestre.', { variant: 'warning' });
      return;
    }
    const filtered = studentsData.filter(s => {
      const matchSem = s.sem === filterSem;
      const matchGpo = filterGpo ? s.gpo === filterGpo : true;
      return matchSem && matchGpo;
    });
    setFilteredStudents(filtered);
    setSelectedStudents(new Set());
    setSelectAll(false);
  };

  const toggleStudent = (mat) => {
    setSelectedStudents(prev => {
      const next = new Set(prev);
      if (next.has(mat)) next.delete(mat);
      else next.add(mat);
      return next;
    });
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedStudents(new Set());
    } else {
      setSelectedStudents(new Set(filteredStudents.map(s => s.mat)));
    }
    setSelectAll(!selectAll);
  };

  const handleBatchPromotion = () => {
    if (selectedStudents.size === 0) {
      if (showAlert) showAlert('Seleccione al menos un alumno.', { variant: 'warning' });
      return;
    }
    if (showAlert) showAlert(`${selectedStudents.size} alumno(s) promovidos al siguiente semestre. (Demo)`, { variant: 'success', title: 'Promoción Aplicada' });
  };

  const handleBatchGroupChange = (newGpo) => {
    if (selectedStudents.size === 0) {
      if (showAlert) showAlert('Seleccione al menos un alumno.', { variant: 'warning' });
      return;
    }
    if (showAlert) showAlert(`${selectedStudents.size} alumno(s) movidos al Grupo ${newGpo}. (Demo)`, { variant: 'success', title: 'Cambio de Grupo' });
  };

  const handleDrop = () => {
    if (selectedStudents.size === 0) {
      if (showAlert) showAlert('Seleccione al menos un alumno para dar de baja.', { variant: 'warning' });
      return;
    }
    if (showAlert) showAlert(`${selectedStudents.size} alumno(s) dados de baja. (Demo)`, { variant: 'warning', title: 'Baja Registrada' });
  };

  const handleAddStudent = () => {
    if (!newStudent.mat || !newStudent.nom) {
      if (showAlert) showAlert('Complete matrícula y nombre del alumno.', { variant: 'warning' });
      return;
    }
    const exists = studentsData.find(s => s.mat === newStudent.mat);
    if (exists) {
      if (showAlert) showAlert(`La matrícula ${newStudent.mat} ya existe en el catálogo.`, { variant: 'error' });
      return;
    }
    if (showAlert) showAlert(`Alumno "${newStudent.nom}" registrado exitosamente. (Demo)`, { variant: 'success', title: 'Alta Registrada' });
    setNewStudent({ mat: '', nom: '', sem: 'PRIMERO', gpo: 'A' });
  };

  return (
    <div className="space-y-6">
      {/* ── Alta de Alumnos ── */}
      <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
        <h4 className="text-xs font-bold text-gray-700 uppercase mb-4 flex items-center gap-2">
          <span className="w-2 h-2 bg-gob-maroon rounded-full"></span>
          Alta de Alumno
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
          <div>
            <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">Matrícula</label>
            <input
              type="text"
              className="form-input text-sm"
              placeholder="Ej. 261305120099"
              value={newStudent.mat}
              onChange={(e) => setNewStudent(p => ({ ...p, mat: e.target.value }))}
            />
          </div>
          <div className="lg:col-span-2">
            <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">Nombre Completo</label>
            <input
              type="text"
              className="form-input text-sm"
              placeholder="APELLIDO PATERNO MATERNO NOMBRE(S)"
              value={newStudent.nom}
              onChange={(e) => setNewStudent(p => ({ ...p, nom: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">Semestre</label>
            <select
              className="form-input text-sm"
              value={newStudent.sem}
              onChange={(e) => setNewStudent(p => ({ ...p, sem: e.target.value }))}
            >
              {semestres.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">Grupo</label>
            <select
              className="form-input text-sm"
              value={newStudent.gpo}
              onChange={(e) => setNewStudent(p => ({ ...p, gpo: e.target.value }))}
            >
              {grupos.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div>
            <button
              onClick={handleAddStudent}
              className="bg-green-600 text-white px-5 py-2 rounded text-sm font-bold hover:bg-green-700 transition whitespace-nowrap w-full"
            >
              + Registrar
            </button>
          </div>
        </div>
      </div>

      {/* ── Filtrar y Gestionar ── */}
      <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
        <h4 className="text-xs font-bold text-gray-700 uppercase mb-4 flex items-center gap-2">
          <span className="w-2 h-2 bg-gob-maroon rounded-full"></span>
          Gestión de Alumnos
        </h4>

        <div className="flex flex-wrap gap-3 items-end mb-4">
          <div>
            <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">Semestre</label>
            <select className="form-input text-sm" value={filterSem} onChange={(e) => setFilterSem(e.target.value)}>
              <option value="">Todos</option>
              {semestres.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">Grupo</label>
            <select className="form-input text-sm" value={filterGpo} onChange={(e) => setFilterGpo(e.target.value)}>
              <option value="">Todos</option>
              {grupos.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <button
            onClick={handleFilter}
            className="bg-gob-maroon text-white px-5 py-2 rounded text-sm font-bold hover:bg-red-900 transition"
          >
            Filtrar
          </button>

          {filteredStudents.length > 0 && (
            <span className="text-xs text-gray-500 ml-auto">
              {filteredStudents.length} alumno(s) · {selectedStudents.size} seleccionados
            </span>
          )}
        </div>

        {/* ── Action bar ── */}
        {filteredStudents.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4 p-3 bg-white rounded border border-gray-200">
            <span className="text-[10px] text-gray-500 font-bold uppercase self-center mr-2">Acciones:</span>
            <button
              onClick={handleBatchPromotion}
              className="bg-blue-600 text-white px-3 py-1.5 rounded text-xs font-bold hover:bg-blue-700 transition"
            >
              Promover Semestre
            </button>
            {grupos.map(g => (
              <button
                key={g}
                onClick={() => handleBatchGroupChange(g)}
                className="bg-amber-500 text-white px-3 py-1.5 rounded text-xs font-bold hover:bg-amber-600 transition"
              >
                Mover a Gpo. {g}
              </button>
            ))}
            <button
              onClick={handleDrop}
              className="bg-red-600 text-white px-3 py-1.5 rounded text-xs font-bold hover:bg-red-700 transition ml-auto"
            >
              Dar de Baja
            </button>
          </div>
        )}

        {/* ── Student Table ── */}
        {filteredStudents.length > 0 && (
          <div className="overflow-auto max-h-[400px] rounded border border-gray-200">
            <table className="w-full text-sm">
              <thead className="bg-gob-maroon text-white sticky top-0">
                <tr>
                  <th className="p-2 text-left w-10">
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAll}
                      className="accent-gob-gold"
                    />
                  </th>
                  <th className="p-2 text-left w-12">#</th>
                  <th className="p-2 text-left">Matrícula</th>
                  <th className="p-2 text-left">Nombre Completo</th>
                  <th className="p-2 text-left w-28">Semestre</th>
                  <th className="p-2 text-left w-16">Gpo</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((s, i) => (
                  <tr
                    key={s.mat}
                    className={`border-b border-gray-100 transition ${
                      selectedStudents.has(s.mat) ? 'bg-blue-50' : 'hover:bg-gray-50'
                    }`}
                  >
                    <td className="p-2">
                      <input
                        type="checkbox"
                        checked={selectedStudents.has(s.mat)}
                        onChange={() => toggleStudent(s.mat)}
                        className="accent-gob-maroon"
                      />
                    </td>
                    <td className="p-2 text-gray-400 font-mono text-xs">{i + 1}</td>
                    <td className="p-2 font-mono text-xs">{s.mat}</td>
                    <td className="p-2 font-medium">{s.nom}</td>
                    <td className="p-2 text-gray-600">{s.sem}</td>
                    <td className="p-2 text-gray-600">{s.gpo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filteredStudents.length === 0 && (
          <p className="text-center text-gray-400 text-sm py-10">
            Seleccione semestre y/o grupo y presione "Filtrar" para ver alumnos.
          </p>
        )}
      </div>
    </div>
  );
}

// ── ESCUELAS SECTION ──
function EscuelasSection({ showAlert }) {
  const [schools] = useState(schoolsData);
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({ dir: '', esc: '' });

  // New school form
  const [newSchool, setNewSchool] = useState({ dir: '', esc: '' });

  const handleEdit = (school) => {
    setEditingId(school.id);
    setEditValues({ dir: school.dir, esc: school.esc });
  };

  const handleSave = () => {
    if (showAlert) showAlert('Escuela actualizada correctamente. (Demo)', { variant: 'success', title: 'Cambios Guardados' });
    setEditingId(null);
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  const handleDelete = (school) => {
    if (showAlert) showAlert(`"${school.esc}" dada de baja del catálogo. (Demo)`, { variant: 'warning', title: 'Baja de Escuela' });
  };

  const handleAddSchool = () => {
    if (!newSchool.dir || !newSchool.esc) {
      if (showAlert) showAlert('Complete todos los campos para registrar la escuela.', { variant: 'warning' });
      return;
    }
    if (showAlert) showAlert(`"${newSchool.esc}" registrada exitosamente. (Demo)`, { variant: 'success', title: 'Escuela Registrada' });
    setNewSchool({ dir: '', esc: '' });
  };

  return (
    <div className="space-y-6">
      {/* ── Alta de Escuela ── */}
      <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
        <h4 className="text-xs font-bold text-gray-700 uppercase mb-4 flex items-center gap-2">
          <span className="w-2 h-2 bg-gob-maroon rounded-full"></span>
          Alta de Escuela
        </h4>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">Nombre de la Escuela</label>
            <input
              type="text"
              className="form-input text-sm"
              placeholder="Ej. ESCUELA PRIMARIA BENITO JUÁREZ"
              value={newSchool.esc}
              onChange={(e) => setNewSchool(p => ({ ...p, esc: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">Director(a)</label>
            <input
              type="text"
              className="form-input text-sm"
              placeholder="Ej. MTRO. NOMBRE APELLIDO APELLIDO"
              value={newSchool.dir}
              onChange={(e) => setNewSchool(p => ({ ...p, dir: e.target.value }))}
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleAddSchool}
              className="bg-green-600 text-white px-5 py-2 rounded text-sm font-bold hover:bg-green-700 transition w-full"
            >
              + Registrar Escuela
            </button>
          </div>
        </div>
      </div>

      {/* ── Catálogo de Escuelas ── */}
      <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
        <h4 className="text-xs font-bold text-gray-700 uppercase mb-4 flex items-center gap-2">
          <span className="w-2 h-2 bg-gob-maroon rounded-full"></span>
          Catálogo de Escuelas ({schools.length})
        </h4>

        <div className="space-y-3">
          {schools.map((school) => (
            <div
              key={school.id}
              className={`p-4 rounded border transition ${
                editingId === school.id
                  ? 'bg-blue-50 border-blue-300'
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
            >
              {editingId === school.id ? (
                /* Edit Mode */
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] text-blue-600 uppercase font-bold mb-1">Nombre de la Escuela</label>
                      <input
                        type="text"
                        className="form-input text-sm border-blue-300"
                        value={editValues.esc}
                        onChange={(e) => setEditValues(p => ({ ...p, esc: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-blue-600 uppercase font-bold mb-1">Director(a)</label>
                      <input
                        type="text"
                        className="form-input text-sm border-blue-300"
                        value={editValues.dir}
                        onChange={(e) => setEditValues(p => ({ ...p, dir: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleSave}
                      className="bg-blue-600 text-white px-4 py-1.5 rounded text-xs font-bold hover:bg-blue-700 transition"
                    >
                      Guardar Cambios
                    </button>
                    <button
                      onClick={handleCancel}
                      className="bg-gray-400 text-white px-4 py-1.5 rounded text-xs font-bold hover:bg-gray-500 transition"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                /* View Mode */
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-bold text-sm text-gray-800">{school.esc}</p>
                    <p className="text-xs text-gray-500 mt-0.5">Director(a): {school.dir}</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleEdit(school)}
                      className="bg-amber-500 text-white px-3 py-1.5 rounded text-xs font-bold hover:bg-amber-600 transition"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(school)}
                      className="bg-red-500 text-white px-3 py-1.5 rounded text-xs font-bold hover:bg-red-600 transition"
                    >
                      Baja
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── MAIN CONFIG PANEL ──
export default function ConfigPanel({ showAlert }) {
  const [activeTab, setActiveTab] = useState('alumnos');

  return (
    <div className="form-section">
      <div className="mb-6 border-l-4 border-gob-gold pl-4">
        <h3 className="text-lg font-bold text-gob-maroon">Configuración del Sistema</h3>
        <p className="text-sm text-gray-500">
          Administre el catálogo de alumnos y escuelas de práctica.
        </p>
      </div>

      <ConfigTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'alumnos' && <AlumnosSection showAlert={showAlert} />}
      {activeTab === 'escuelas' && <EscuelasSection showAlert={showAlert} />}
    </div>
  );
}
