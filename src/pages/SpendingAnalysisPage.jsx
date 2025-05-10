import React from 'react';
import SpendingAnalysis from '../components/SpendingAnalysis';

const SpendingAnalysisPage = ({ transactions, wallets }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', minHeight: '100vh', background: '#f3f6fa' }}>
      <div style={{ maxWidth: 900, width: '100%', margin: '40px 0', padding: 24, background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.07)' }}>
        <SpendingAnalysis transactions={transactions} wallets={wallets} />
      </div>
    </div>
  );
};

export default SpendingAnalysisPage; 