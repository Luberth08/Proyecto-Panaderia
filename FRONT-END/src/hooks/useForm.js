// src/hooks/useForm.js
import { useState } from 'react';
import { ERROR_MESSAGES } from '../utils/constants';

export const useForm = (initialState = {}, validations = {}) => {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Limpiar error cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    // Validar campo cuando pierde el foco
    validateField(name, form[name]);
  };

  const validateField = (fieldName, value) => {
    const fieldValidations = validations[fieldName];
    if (!fieldValidations) return true;

    let error = '';

    if (fieldValidations.required && !value) {
      error = ERROR_MESSAGES.REQUIRED;
    } else if (fieldValidations.minLength && value && value.length < fieldValidations.minLength) {
      error = ERROR_MESSAGES.MIN_LENGTH.replace('{n}', fieldValidations.minLength);
    } else if (fieldValidations.pattern && value && !fieldValidations.pattern.test(value)) {
      error = fieldValidations.message || 'Formato inválido';
    } else if (fieldValidations.custom && value) {
      const customError = fieldValidations.custom(value);
      if (customError) error = customError;
    }

    setErrors(prev => ({
      ...prev,
      [fieldName]: error
    }));

    return !error;
  };

  const validateForm = () => {
    //const newErrors = {};
    let isValid = true;

    Object.keys(validations).forEach(fieldName => {
      const fieldError = validateField(fieldName, form[fieldName]);
      if (!fieldError) {
        isValid = false;
      }
    });

    setTouched(
      Object.keys(validations).reduce((acc, fieldName) => {
        acc[fieldName] = true;
        return acc;
      }, {})
    );

    return isValid;
  };

  const resetForm = (newState = initialState) => {
    setForm(newState);
    setErrors({});
    setTouched({});
  };

  const setFieldValue = (name, value) => {
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const setFormData = (data) => {
    setForm(data);
  };

  return {
    form,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateForm,
    resetForm,
    setFieldValue,
    setFormData,
    isValid: Object.values(errors).every(error => !error)
  };
};