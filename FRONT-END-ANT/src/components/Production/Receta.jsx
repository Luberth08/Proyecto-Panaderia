import React from 'react'

const Receta =  ({ setVerRecetas, selected, handleModify, handleDelete, productos, recetas }) => {
    const selectedReceta = recetas.find((receta) => receta.ide === selected);
    const selectedProducto = productos.find((prod) => prod.ide_producto === selectedReceta?.ide_producto);
  
    return (
      <div className="item-detail">
        <button onClick={() => setVerRecetas(true)}>Volver a la lista</button>
        {selected && (
          <>
            <div className="action-buttons">
              <button className="modify-btn" onClick={handleModify} disabled={!selected}>
                Modificar
              </button>
              <button className="delete-btn" onClick={handleDelete} disabled={!selected}>
                Eliminar
              </button>
            </div>
            <h2>{selectedProducto?.nombre}</h2>
            <p>Unidades: {selectedReceta?.unidades}</p>
            <p>Tiempo: {selectedReceta?.tiempo}</p>
          </>
        )}
      </div>
    );
  };
  

export default Receta