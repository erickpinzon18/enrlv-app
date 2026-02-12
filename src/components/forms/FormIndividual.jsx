import { useState, useEffect } from 'react';
import studentsData from '../../data/students.json';
import { PlusIcon, TrashIcon } from '../Icons';

export default function FormIndividual({ data, onChange, studentList, onAddStudent, onRemoveStudent, showAlert }) {
  const [searchMatricula, setSearchMatricula] = useState('');
  const [foundStudent, setFoundStudent] = useState(null);
  
  // Date selection state
  const [tempDate, setTempDate] = useState('');
  // We rely on data.rawDates if it exists, otherwise empty array
  const selectedDates = data.rawDates || [];

  // Auto-fill logic when matricula changes
  useEffect(() => {
    if (searchMatricula.length >= 5) {
      const student = studentsData.find(s => s.mat === searchMatricula);
      if (student) {
        setFoundStudent(student);
      } else {
        setFoundStudent(null);
      }
    } else {
      setFoundStudent(null);
    }
  }, [searchMatricula]);

  const handleAdd = () => {
    if (foundStudent) {
      onAddStudent({
        matricula: foundStudent.mat,
        nombre: foundStudent.nom,
        semestre: foundStudent.sem,
        grupo: foundStudent.gpo
      });
      setSearchMatricula('');
      setFoundStudent(null);
    }
  };

  // Date Logic
  const handleAddDate = () => {
      if (!tempDate) return;
      if (selectedDates.includes(tempDate)) {
          setTempDate('');
          return;
      }
      
      const newDates = [...selectedDates, tempDate].sort();
      updateDates(newDates);
      setTempDate('');
  };

  const handleRemoveDate = (dateToRemove) => {
      const newDates = selectedDates.filter(d => d !== dateToRemove);
      updateDates(newDates);
  };

  const updateDates = (newDates) => {
      // 1. Update Raw Dates for Validation
      onChange('rawDates', newDates);

      // 2. Generate Text for Document
      if (newDates.length === 0) {
          onChange('fechas', '');
          return;
      }

      const options = { day: 'numeric', month: 'long', year: 'numeric' }; 
      
      // Parse dates to verify consecutiveness
      const sortedDates = newDates.map(d => new Date(d + 'T00:00:00')).sort((a, b) => a - b);
      
      let text = "";
      if (sortedDates.length === 1) {
           text = `el día ${sortedDates[0].toLocaleDateString('es-ES', options)}`;
      } else {
          // Check if consecutive
          let isConsecutive = true;
          for (let i = 0; i < sortedDates.length - 1; i++) {
              const diffTime = Math.abs(sortedDates[i+1] - sortedDates[i]);
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
              if (diffDays > 1) {
                  isConsecutive = false;
                  break;
              }
          }

          if (isConsecutive && sortedDates.length >= 2) { // User said "si son 3", but usually range implies >= 2. Let's start with user request "3".
              // Actually user said "si son 3". Let's apply for >= 2 ranges generally or strictly >= 3?
              // "si son 3 fechas ponga del (fecha inicio) al (fecha fin)". 
              // Usually ranges are better for >=2 consecutive days. 
              // I'll apply for >= 2 consecutive to be consistent with "Rango".
              
              const first = sortedDates[0];
              const last = sortedDates[sortedDates.length - 1];
              
              const firstStr = first.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' });
              const lastStr = last.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
              
              // If same month: "del 20 al 22 de mayo de 2024"
              if (first.getMonth() === last.getMonth() && first.getFullYear() === last.getFullYear()) {
                  text = `del ${first.getDate()} al ${lastStr}`;
              } else {
                  text = `del ${firstStr} al ${lastStr}`;
              }
          } else {
              // Not consecutive or simple list
              const formattedDates = sortedDates.map(d => d.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' }));
              const last = formattedDates.pop();
              const rest = formattedDates.join(', ');
              const year = sortedDates[0].getFullYear();
              text = `los días ${rest} y ${last} de ${year}`;
          }
      }
      onChange('fechas', text);
  };

  return (
    <div id="form-individual" className="form-section block">
      <div className="mb-4 border-l-4 border-gob-gold pl-4">
        <h3 className="text-lg font-bold text-gob-maroon">Estudiantes a Justificar</h3>
        <p className="text-sm text-gray-500">
          Agregue uno o más alumnos. Se generará un oficio con Copia integrada (por cada alumno).
        </p>
      </div>

      {/* Buscador / Agregador */}
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-end">
            <datalist id="catalogo-alumnos">
                {studentsData.map(s => (
                    <option key={s.mat} value={s.mat}>{s.nom}</option>
                ))}
            </datalist>

            <div className="md:col-span-3">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Buscar Matrícula</label>
                <input
                    list="catalogo-alumnos"
                    className="form-input text-sm"
                    placeholder="Ej. 11135..."
                    value={searchMatricula}
                    onChange={(e) => setSearchMatricula(e.target.value)}
                />
            </div>
            
             <div className="md:col-span-5">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nombre</label>
                <input 
                    type="text" 
                    className="form-input bg-gray-100 text-sm" 
                    value={foundStudent ? foundStudent.nom : ''} 
                    readOnly={!!foundStudent}
                    placeholder="Nombre del estudiante"
                    id="ind-manual-nom"
                />
            </div>
             <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Semestre</label>
                 <input 
                    type="text" 
                    className="form-input bg-gray-100 text-sm" 
                    value={foundStudent ? foundStudent.sem : ''} 
                    readOnly={!!foundStudent}
                    placeholder="Sem"
                    id="ind-manual-sem"
                />
            </div>
             <div className="md:col-span-1">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Gpo</label>
                 <input 
                    type="text" 
                    className="form-input bg-gray-100 text-sm" 
                    value={foundStudent ? foundStudent.gpo : ''} 
                    readOnly={!!foundStudent}
                    placeholder="Gpo"
                     id="ind-manual-gpo"
                />
            </div>

            <div className="md:col-span-1">
                 <button
                    onClick={() => {
                        if(foundStudent) {
                            handleAdd();
                        } else {
                            const nom = document.getElementById('ind-manual-nom').value;
                            const sem = document.getElementById('ind-manual-sem').value;
                            const gpo = document.getElementById('ind-manual-gpo').value;
                            if(nom) onAddStudent({ matricula: searchMatricula, nombre: nom, semestre: sem, grupo: gpo });
                            setSearchMatricula('');
                        }
                    }}
                    className="w-full bg-gob-maroon text-white h-[38px] rounded hover:bg-red-900 transition font-bold text-sm flex items-center justify-center"
                >
                    + Add
                </button>
            </div>
        </div>
      </div>

      {/* Lista Visual */}
      <div className="mb-6">
        <ul className="space-y-2 text-sm text-gray-600">
            {studentList.map((st, i) => (
                <li key={i} className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded border border-gray-200">
                    <span className="font-mono"><b>{st.matricula}</b> - {st.nombre} <span className="text-gray-400 text-xs">({st.semestre} {st.grupo})</span></span>
                    <button onClick={() => onRemoveStudent(i)} className="text-red-500 font-bold hover:text-red-700">
                        <TrashIcon className="w-4 h-4" />
                    </button>
                </li>
            ))}
            {studentList.length === 0 && <p className="text-xs text-gray-400 italic">No hay estudiantes seleccionados.</p>}
        </ul>
      </div>

      <div className="mb-4 border-l-4 border-gob-gold pl-4">
        <h3 className="text-lg font-bold text-gob-maroon">Detalles de la Justificación</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Seleccionar Fechas (Validación Automática)
            </label>
            
            {/* Range Selector UI */}
            <div className="bg-gray-50 p-3 rounded border border-gray-200 mb-3">
                <div className="flex gap-2 mb-2 text-xs font-bold text-gray-500">
                    <label className="flex items-center gap-1 cursor-pointer">
                        <input type="radio" name="dateMode" defaultChecked onChange={() => document.getElementById('range-inputs').classList.add('hidden')} /> 
                        Fecha Única
                    </label>
                    <label className="flex items-center gap-1 cursor-pointer">
                        <input type="radio" name="dateMode" onChange={() => document.getElementById('range-inputs').classList.remove('hidden')} /> 
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
                    
                    <div id="range-inputs" className="hidden">
                         <span className="text-[10px] uppercase text-gray-400 font-bold block">Fecha Fin</span>
                        <input 
                            id="date-end"
                            type="date" 
                            className="form-input w-40 text-sm h-[38px]"
                        />
                    </div>

                    <button 
                        onClick={() => {
                            const dateEndVal = document.getElementById('date-end').value;
                            const isRange = !document.getElementById('range-inputs').classList.contains('hidden');

                            if (!tempDate) return;

                            let datesToAdd = [];

                            if (isRange && dateEndVal) {
                                // Generate range
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
                                // Single date
                                datesToAdd.push(tempDate);
                            }

                            // Filter duplicates
                            const unique = datesToAdd.filter(d => !selectedDates.includes(d));
                            if (unique.length === 0) return;

                            const newDates = [...selectedDates, ...unique].sort();
                            updateDates(newDates);
                            
                            // Reset inputs
                            setTempDate('');
                            document.getElementById('date-end').value = '';
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

          <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
            Texto Generado (Editable si es necesario)
          </label>
          <input
            type="text"
            value={data.fechas}
            onChange={(e) => onChange('fechas', e.target.value)}
            className="form-input bg-gray-50"
            placeholder="Se generará automáticamente..."
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
            placeholder="Ej. han presentado la documentación necesaria para justificar la inasistencia por motivos de salud."
          />
        </div>
      </div>
    </div>
  );
}
