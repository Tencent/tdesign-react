import React from 'react';

const FormContext = React.createContext({});

export const useFormContext = () => React.useContext(FormContext);

export default FormContext;
