import { PlusIcon, TrashIcon } from '../Icons';

export default function FormGrupal({ data, onChange, studentList, onAddStudent, onRemoveStudent }) {
  return (
    <div id="form-grupal" className="form-section">
      <div className="mb-6 border-l-4 border-gob-gold pl-4 flex justify-between items-end">
        <div>
          <h3 className="text-lg font-bold text-gob-maroon">Lista de Estudiantes (Guardia)</h3>
          <p className="text-sm text-gray-500">
            Agregue estudiantes a la tabla para generar la lista.
          </p>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
        <h4 className="text-sm font-bold text-gray-700 mb-3">Datos Generales</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
              Fecha Justificación
            </label>
            <input
              type="text"
              value={data.fechaJust}
              onChange={(e) => onChange('fechaJust', e.target.value)}
              className="form-input bg-white"
              placeholder="Ej. 13 de OCTUBRE de 2025"
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

      {/* Add Student Form */}
      <AddStudentForm onAddStudent={onAddStudent} />

      {/* Table */}
      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-white uppercase bg-gob-maroon">
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
                    className="text-red-500 hover:text-red-700"
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

function AddStudentForm({ onAddStudent }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const matricula = formData.get('matricula');
    const nombre = formData.get('nombre');
    const semestre = formData.get('semestre');
    const grupo = formData.get('grupo');

    if (matricula && nombre) {
      onAddStudent({ matricula, nombre, semestre, grupo });
      e.target.reset();
    } else {
      alert('Ingrese al menos Matrícula y Nombre');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-4 items-end">
      <div className="flex-1">
        <input
          type="text"
          name="matricula"
          placeholder="Matrícula"
          className="form-input text-sm"
        />
      </div>
      <div className="flex-[2]">
        <input
          type="text"
          name="nombre"
          placeholder="Nombre Completo"
          className="form-input text-sm"
        />
      </div>
      <div className="w-24">
        <input
          type="text"
          name="semestre"
          placeholder="Sem"
          className="form-input text-sm"
        />
      </div>
      <div className="w-20">
        <input
          type="text"
          name="grupo"
          placeholder="Gpo"
          className="form-input text-sm"
        />
      </div>
      <button
        type="submit"
        className="bg-gob-gold text-white px-4 py-2 rounded hover:bg-yellow-600 transition h-[38px] flex items-center"
      >
        <PlusIcon className="w-5 h-5" />
      </button>
    </form>
  );
}
