// src/components/ui/PageHeader.jsx
import './PageHeader.css';

const PageHeader = ({ 
  title, 
  description, 
  actionButton,
  children 
}) => {
  return (
    <div className="page-header">
      <div className="header-content">
        <div className="header-text">
          <h1>{title}</h1>
          {description && <p>{description}</p>}
          {children}
        </div>
        {actionButton && (
          <div className="header-action">
            {actionButton}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;