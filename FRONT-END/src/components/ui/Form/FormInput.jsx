// src/components/ui/Form/FormInput.jsx
import './Form.css';

const FormInput = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  onBlur,
  error,
  touched,
  placeholder,
  required = false,
  disabled = false,
  className = ""
}) => {
  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label htmlFor={name}>
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        className={`form-input ${error && touched ? 'error' : ''}`}
      />
      {error && touched && (
        <div className="error-text">{error}</div>
      )}
    </div>
  );
};

export default FormInput;