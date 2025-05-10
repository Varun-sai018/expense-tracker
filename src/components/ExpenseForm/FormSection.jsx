import React from 'react';
import styles from './FormSection.module.css';

const FormSection = ({ title, children }) => {
  return (
    <div className={styles.section}>
      {title && <h3 className={styles.sectionTitle}>{title}</h3>}
      <div className={styles.sectionContent}>
        {children}
      </div>
    </div>
  );
};

export default FormSection; 