// src/components/ui/SearchBar.jsx
import './SearchBar.css';

const SearchBar = ({ 
  placeholder = "Buscar...", 
  value, 
  onChange,
  className = "" 
}) => {
  return (
    <div className={`search-bar ${className}`}>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="search-input"
      />
      <span className="search-icon">🔍</span>
    </div>
  );
};

export default SearchBar;