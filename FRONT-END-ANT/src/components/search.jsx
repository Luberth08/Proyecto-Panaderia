import React from 'react';
import styles from '../styles/search.module.css'; 
import img from '../img/search.svg';

const Search = ({ value, onChange }) => {
  return (
    <label htmlFor="search" className={styles.label}>
      <input 
        type="search" 
        id="search" 
        className={styles.input} 
        value={value} // Valor de búsqueda
        onChange={onChange} // Maneja cambios
        placeholder="Buscar" // Placeholder opcional
      />
      <img src={img} className={styles.img} alt="Search icon" />
    </label>
  );
};

export default Search;


