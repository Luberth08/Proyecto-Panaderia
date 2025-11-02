import './Form.css';

const FormRow = ({ children, className = "" }) => {
  return (
    <div className={`form-row ${className}`}>
      {children}
    </div>
  );
};

export default FormRow;