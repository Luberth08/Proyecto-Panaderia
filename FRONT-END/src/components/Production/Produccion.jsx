import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddProdModal from './AddProdModal';

export const Produccion = () => {
  const [inProgressProcesses, setInProgressProcesses] = useState([]);
  const [completedProcesses, setCompletedProcesses] = useState([]);
  const [selectedProcess, setSelectedProcess] = useState(null);
  const [empleados, setEmpleados] = useState([]);
  const [selectedEmpleado, setSelectedEmpleado] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  
  const [isAddModalOpen, setisAddModalOpen] = useState(false)

  const token = localStorage.getItem('token');

  // Fetch processes and employees
  useEffect(() => {
    
    fetchData();
  }, []);
  const fetchData = async () => {
    try {
      const [processRes, employeesRes, asignadoRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/api/producciones`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${import.meta.env.VITE_API_URL}/api/usuarios`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${import.meta.env.VITE_API_URL}/api/participa`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      
      const procesos = processRes.data.map((process) => {
        // Encuentra el registro de asignado correspondiente al proceso
         const asignado = asignadoRes.data.find(
          (asignado) => asignado.ide_produccion === process.ide
        );
        // Encuentra el empleado correspondiente al codigo_usuario del asignado
        const responsable = employeesRes.data.find(
          (empleado) => empleado.codigo === asignado?.codigo_usuario // Usa '?' para evitar errores si asignado es null
        );
        // Retorna el nuevo objeto del proceso con datos adicionales
        return {
          ...process,
          fecha: process.fecha ? new Date(process.fecha).toLocaleDateString() : 'No asignada',
          asignado: responsable?.nombre || "No asignado", // Si no hay responsable, muestra 'No asignado'
          asignado_id: responsable?.codigo || "N/A",     // Si no hay código, usa 'N/A'
          
        };
      });
      

      setInProgressProcesses(procesos.filter((process) => process.terminado === false));
      setCompletedProcesses(procesos.filter((process) => process.terminado === true));

      setEmpleados(employeesRes.data.filter((empleado) => empleado.ide_rol !== 'RL01'));

    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Error al cargar datos.');
    }
  };

  // Finalize production process
  const handleFinalizeProcess = async (processId) => {
    setLoading(true);
    setError('');
    try {
        console.error('Error finalizando proceso:', token);
        await axios.put(
          `${import.meta.env.VITE_API_URL}/api/producciones/${processId}/finalizar`,
          {}, // Deja el cuerpo vacío si no necesitas enviar datos adicionales
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      setCompletedProcesses((prev) => [
        ...prev,
        inProgressProcesses.find((process) => process.ide === processId),
      ]);
      setInProgressProcesses((prev) =>
        prev.filter((process) => process.ide !== processId)
    );
      setSelectedProcess(null);
    } catch (error) {
      console.error('Error finalizando proceso:', error);
      setError('Ocurrió un error al finalizar el proceso.');
    } finally {
      setLoading(false);
    }
  };

  // Asignar responsable a produccion
  const handleAssignEmployee = async (processId) => {
    if (!selectedEmpleado) {
      setError('Seleccione un empleado para asignar.');
      return;
    }
    
    setLoading(true);
    setError('');
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/producciones/${processId}/asignar-responsable`,
        { codigo_usuario: selectedEmpleado },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchData();

    } catch (error) {
      console.error('Error assigning employee:', error);
      setError('Ocurrió un error al asignar el empleado.');
    } finally {
      setLoading(false);
      setSelectedEmpleado('');
    }
  };

  return (
    <div className="background">
      <h2>Gestión de Producción</h2>
      {error && <p className="error-message">{error}</p>}
      
      <div className="section">
        <h3>En Proceso</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Descripcion</th>
              <th>Fecha Inicio</th>
              <th>Hora</th>
              <th>Responsable</th>
            </tr>
          </thead>
          <tbody>
            {inProgressProcesses.map((process) => (
              <tr
                key={process.ide}
                className={selectedProcess === process.ide ? 'selected' : ''}
                onClick={() => setSelectedProcess(process.ide)}
              >
                <td>{process.descripcion}</td>
                <td>{process.fecha || 'No asignada'}</td>
                <td>{process.hora_inicio || 'No asignada'}</td>
                <td>{process.asignado}</td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div className="action-buttons">
          
          
          <select
            className="assign-select"
            value={selectedEmpleado}
            onChange={(e) => setSelectedEmpleado(e.target.value)}
          >
            <option value="">Seleccionar Empleado</option>
            {empleados.map((empleado) => (
              <option key={empleado.codigo} value={empleado.codigo}>
                {empleado.nombre}
              </option>
            ))}
          </select>
          <button
            className="assign-btn"
            onClick={() => handleAssignEmployee(selectedProcess)}
            disabled={!selectedProcess || loading}
          >
            {loading ? 'Asignando...' : 'Asignar Responsable'}
          </button>
          <button
            className="Add-btn"
            onClick={() => setisAddModalOpen(true)}
          >
            Nuevo proceso
          </button>
          <button
            className="finalize-btn"
            onClick={() => handleFinalizeProcess(selectedProcess)}
            disabled={!selectedProcess || loading}
          >
            {loading ? 'Finalizando...' : 'Finalizar Producción'}
          </button>
        </div>
      </div>

      <div className="section">
        <h3>Procesos Finalizados</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Descripcion</th>
              <th>Fecha</th>
              <th>Responsable</th>
              
            </tr>
          </thead>
          <tbody>
            {completedProcesses.map((process) => (
              <tr key={process.ide}>
                <td>{process.descripcion}</td>
                <td>{process.fecha}</td>
                <td>{process.asignado}</td>
                
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isAddModalOpen && (
      <AddProdModal
        onClose={() => setisAddModalOpen(false)}
        onUpdate={fetchData}
      />)
    }
    </div>
    
    
  );
};

export default Produccion;
