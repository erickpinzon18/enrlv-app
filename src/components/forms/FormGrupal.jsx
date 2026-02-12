import { useState } from 'react';
import studentsData from '../../data/students.json';
import { PlusIcon, TrashIcon } from '../Icons';

export default function FormGrupal({ data, onChange, studentList, onAddStudent, onRemoveStudent, showAlert }) {
  const [filterSem, setFilterSem] = useState('');
  const [filterGpo, setFilterGpo] = useState('');

  // Date selection state (same pattern as FormIndividual)
  const [tempDate, setTempDate] = useState('');
  const selectedDates = data.rawDates || [];

  // Time selection state
  const [allDay, setAllDay] = useState(false);
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFin, setHoraFin] = useState('');

  // Format time from 24h to readable text (e.g., "08:00" -> "8:00 am")
  const formatTime = (time24) => {
    if (!time24) return '';
    const [h, m] = time24.split(':').map(Number);
    const period = h >= 12 ? 'pm' : 'am';
    const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `${h12}:${m.toString().padStart(2, '0')} ${period}`;
  };

  // Update horario text when time changes
  const updateHorario = (inicio, fin, isAllDay) => {
    if (isAllDay) {
      onChange('horario', 'Todo el día');
    } else if (inicio && fin) {
      onChange('horario', `${formatTime(inicio)} a ${formatTime(fin)} Hrs`);
    } else if (inicio) {
      onChange('horario', `${formatTime(inicio)} Hrs`);
    } else {
      onChange('horario', '');
    }
  };

  const handleAllDayChange = (checked) => {
    setAllDay(checked);
    if (checked) {
      setHoraInicio('');
      setHoraFin('');
    }
    updateHorario('', '', checked);
  };

  const handleHoraInicioChange = (val) => {
    setHoraInicio(val);
    updateHorario(val, horaFin, false);
  };

  const handleHoraFinChange = (val) => {
    setHoraFin(val);
    updateHorario(horaInicio, val, false);
  };

  // Date Logic — generates formatted text from raw dates
  const updateDates = (newDates) => {
    onChange('rawDates', newDates);

    if (newDates.length === 0) {
      onChange('rawDate', '');
      onChange('fechaJust', '');
      return;
    }

    // Keep rawDate as first date for security validation in App.jsx
    onChange('rawDate', newDates[0]);

    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    const sortedDates = newDates.map(d => new Date(d + 'T00:00:00')).sort((a, b) => a - b);

    let text = "";
    if (sortedDates.length === 1) {
      text = sortedDates[0].toLocaleDateString('es-ES', options);
    } else {
      // Check if consecutive
      let isConsecutive = true;
      for (let i = 0; i < sortedDates.length - 1; i++) {
        const diffDays = Math.ceil(Math.abs(sortedDates[i + 1] - sortedDates[i]) / (1000 * 60 * 60 * 24));
        if (diffDays > 1) { isConsecutive = false; break; }
      }

      if (isConsecutive && sortedDates.length >= 2) {
        const first = sortedDates[0];
        const last = sortedDates[sortedDates.length - 1];
        const firstStr = first.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' });
        const lastStr = last.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });

        if (first.getMonth() === last.getMonth() && first.getFullYear() === last.getFullYear()) {
          text = `del ${first.getDate()} al ${lastStr}`;
        } else {
          text = `del ${firstStr} al ${lastStr}`;
        }
      } else {
        const formattedDates = sortedDates.map(d => d.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' }));
        const last = formattedDates.pop();
        const rest = formattedDates.join(', ');
        const year = sortedDates[0].getFullYear();
        text = `los días ${rest} y ${last} de ${year}`;
      }
    }
    onChange('fechaJust', text);
  };

  const handleAddDate = () => {
    if (!tempDate) return;
    if (selectedDates.includes(tempDate)) { setTempDate(''); return; }
    const newDates = [...selectedDates, tempDate].sort();
    updateDates(newDates);
    setTempDate('');
  };

  const handleRemoveDate = (dateToRemove) => {
    updateDates(selectedDates.filter(d => d !== dateToRemove));
  };

  const handleLoadGroup = () => {
    if (!filterSem || !filterGpo) {
      if (showAlert) showAlert('Seleccione Semestre y Grupo', { variant: 'warning' });
      return;
    }

    const filtered = studentsData.filter(
      (s) => s.sem === filterSem && s.gpo === filterGpo
    );

    if (filtered.length === 0) {
      if (showAlert) showAlert('No hay alumnos en ese grupo en el catálogo.', { variant: 'warning' });
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

      {/* Datos del oficio */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
        <h4 className="text-sm font-bold text-gray-700 mb-3">Datos del Oficio</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Fecha con selector mejorado */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Seleccionar Fechas de Justificación
            </label>

            <div className="bg-white p-3 rounded border border-gray-200 mb-3">
              <div className="flex gap-2 mb-2 text-xs font-bold text-gray-500">
                <label className="flex items-center gap-1 cursor-pointer">
                  <input type="radio" name="dateModeGrupal" defaultChecked onChange={() => document.getElementById('range-inputs-grupal').classList.add('hidden')} />
                  Fecha Única
                </label>
                <label className="flex items-center gap-1 cursor-pointer">
                  <input type="radio" name="dateModeGrupal" onChange={() => document.getElementById('range-inputs-grupal').classList.remove('hidden')} />
                  Rango de Fechas
                </label>
              </div>

              <div className="flex flex-wrap gap-2 items-end">
                <div>
                  <span className="text-[10px] uppercase text-gray-400 font-bold block">Fecha Inicio / Única</span>
                  <input
                    type="date"
                    className="form-input w-40 text-sm h-[38px]"
                    value={tempDate}
                    onChange={(e) => setTempDate(e.target.value)}
                  />
                </div>

                <div id="range-inputs-grupal" className="hidden">
                  <span className="text-[10px] uppercase text-gray-400 font-bold block">Fecha Fin</span>
                  <input
                    id="date-end-grupal"
                    type="date"
                    className="form-input w-40 text-sm h-[38px]"
                  />
                </div>

                <button
                  onClick={() => {
                    const dateEndVal = document.getElementById('date-end-grupal').value;
                    const isRange = !document.getElementById('range-inputs-grupal').classList.contains('hidden');

                    if (!tempDate) return;

                    let datesToAdd = [];

                    if (isRange && dateEndVal) {
                      let current = new Date(tempDate + 'T00:00:00');
                      const end = new Date(dateEndVal + 'T00:00:00');

                      if (current > end) {
                        if (showAlert) showAlert("Fecha inicio debe ser menor a fecha fin", { variant: 'warning' });
                        return;
                      }

                      while (current <= end) {
                        datesToAdd.push(current.toISOString().split('T')[0]);
                        current.setDate(current.getDate() + 1);
                      }
                    } else {
                      datesToAdd.push(tempDate);
                    }

                    const unique = datesToAdd.filter(d => !selectedDates.includes(d));
                    if (unique.length === 0) return;

                    const newDates = [...selectedDates, ...unique].sort();
                    updateDates(newDates);

                    setTempDate('');
                    document.getElementById('date-end-grupal').value = '';
                  }}
                  className="bg-gob-maroon text-white px-4 py-2 rounded hover:bg-red-900 transition text-sm font-bold h-[38px] flex items-center"
                >
                  <PlusIcon className="w-4 h-4 mr-1" />
                  Agregar
                </button>

                <button
                  onClick={() => updateDates([])}
                  className="text-red-500 text-xs underline ml-auto self-center"
                >
                  Limpiar Todo
                </button>
              </div>
            </div>

            {/* Chips de fechas */}
            <div className="flex flex-wrap gap-2 mb-3">
              {selectedDates.map(date => (
                <span key={date} className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                  {date}
                  <button onClick={() => handleRemoveDate(date)} className="text-blue-500 hover:text-blue-700 font-bold">×</button>
                </span>
              ))}
            </div>

            <label className="block text-[10px] text-gray-400 uppercase mb-1">
              Texto Generado
            </label>
            <input
              type="text"
              value={data.fechaJust}
              onChange={(e) => onChange('fechaJust', e.target.value)}
              disabled
              className="form-input bg-gray-100"
              placeholder="Se generará automáticamente..."
            />
          </div>

          {/* Horario Selector */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Horario
            </label>
            <div className="bg-white p-3 rounded border border-gray-200">
              <div className="flex items-center gap-4 mb-2">
                <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600">
                  <input
                    type="checkbox"
                    checked={allDay}
                    onChange={(e) => handleAllDayChange(e.target.checked)}
                    className="w-4 h-4 accent-gob-maroon rounded"
                  />
                  <span className="font-semibold">Todo el día</span>
                </label>
              </div>
              
              {!allDay && (
                <div className="flex flex-wrap gap-3 items-end">
                  <div>
                    <span className="text-[10px] uppercase text-gray-400 font-bold block">Hora Inicio</span>
                    <input
                      type="time"
                      value={horaInicio}
                      onChange={(e) => handleHoraInicioChange(e.target.value)}
                      className="form-input w-36 text-sm h-[38px]"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-gray-400 font-bold block">Hora Fin</span>
                    <input
                      type="time"
                      value={horaFin}
                      onChange={(e) => handleHoraFinChange(e.target.value)}
                      className="form-input w-36 text-sm h-[38px]"
                    />
                  </div>
                </div>
              )}
              
              <div className="mt-2">
                <span className="text-[10px] uppercase text-gray-400 font-bold block">Texto Generado</span>
                <input
                  type="text"
                  value={data.horario}
                  disabled
                  className="form-input bg-gray-100 text-sm"
                  placeholder="Se generará automáticamente..."
                />
              </div>
            </div>
          </div>

          {/* Motivo - full width */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
              Motivo
            </label>
            <textarea
              value={data.motivo}
              onChange={(e) => onChange('motivo', e.target.value)}
              rows="2"
              className="form-input bg-white"
              placeholder="Ej. Por citado a miembro de la base estudiantil por guardia"
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
      <AddStudentForm onAddStudent={onAddStudent} showAlert={showAlert} />

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
                    <TrashIcon className="w-4 h-4" />
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

function AddStudentForm({ onAddStudent, showAlert }) {
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
      if (showAlert) showAlert('Ingrese alumno válido', { variant: 'warning' });
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
