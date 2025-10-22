// src/components/ui/Table/DataTable.jsx
import './DataTable.css';
import LoadingSpinner from '../LoadingSpinner'; 

const DataTable = ({
  columns = [],
  data = [],
  loading = false,
  emptyMessage = "No hay datos disponibles",
  className = "",
  onRowClick,
  rowKey = "id"
}) => {
  if (loading) {
    return (
      <div className="table-loading">
        <LoadingSpinner text="Cargando datos..." />
      </div>
    );
  }

  return (
    <div className={`data-table-container ${className}`}>
      <table className="data-table">
        <thead>
          <tr>
            {columns.map(column => (
              <th key={column.key} style={{ width: column.width }}>
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="empty-message">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map(item => (
              <tr 
                key={item[rowKey]} 
                className={onRowClick ? 'clickable' : ''}
                onClick={() => onRowClick && onRowClick(item)}
              >
                {columns.map(column => (
                  <td key={column.key}>
                    {column.render ? column.render(item) : item[column.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;