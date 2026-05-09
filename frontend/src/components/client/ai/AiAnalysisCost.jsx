'use client';

import { useState, useEffect } from 'react';

export default function AiCost({ costEstimation, onUpdateCost, onUpdateBreakdownItem }) {

  const [localCost, setLocalCost] = useState(costEstimation);

  useEffect(() => {
    setLocalCost(costEstimation);
  }, [costEstimation]);

  if (!localCost) return null;

  // Recalcul automatique du total
  const recalcTotal = (breakdown) => {
    return breakdown.reduce((sum, item) => {
      const val = parseFloat(String(item.cost).replace(/[^0-9.]/g, '')) || 0;
      return sum + val;
    }, 0);
  };

  const handleTotalChange = (value) => {
    setLocalCost(prev => ({ ...prev, estimatedTotalCost: value }));
  };

  const commitTotal = (value) => {
    onUpdateCost?.('estimatedTotalCost', value);
  };

  const handleCellChange = (rowIndex, field, value) => {
    setLocalCost(prev => {
      const breakdown = [...(prev.breakdown || [])];
      breakdown[rowIndex] = { ...breakdown[rowIndex], [field]: value };

      // Recalcul auto si on change un coût
      const newTotal = field === 'cost' ? recalcTotal(breakdown) : prev.estimatedTotalCost;

      return { ...prev, breakdown, estimatedTotalCost: newTotal };
    });
  };

  const commitCell = (rowIndex, field, value) => {
    onUpdateBreakdownItem?.(rowIndex, field, value);

    // Sync le nouveau total au parent aussi
    if (field === 'cost') {
      const breakdown = [...(localCost.breakdown || [])];
      breakdown[rowIndex] = { ...breakdown[rowIndex], [field]: value };
      const newTotal = recalcTotal(breakdown);
      onUpdateCost?.('estimatedTotalCost', newTotal);
    }
  };

  const totalInput = (
    <input
      value={localCost.estimatedTotalCost ?? ''}
      onChange={(e) => handleTotalChange(e.target.value)}
      onBlur={(e) => commitTotal(e.target.value)}
      onKeyDown={(e) => e.key === 'Enter' && e.target.blur()}
      className="text-lg font-semibold text-right focus:outline-none bg-transparent"
      style={{
        color: '#c9b479',
        border: 'none',
        borderBottom: '1px solid transparent',
        width: 120,
        cursor: 'text',
      }}
      onFocus={(e) => (e.target.style.borderBottomColor = '#e2d5a0')}
      onBlurCapture={(e) => (e.target.style.borderBottomColor = 'transparent')}
    />
  );

  const cellInput = (rowIndex, field, value, style = {}) => (
    <input
      value={value ?? ''}
      onChange={(e) => handleCellChange(rowIndex, field, e.target.value)}
      onBlur={(e) => commitCell(rowIndex, field, e.target.value)}
      onKeyDown={(e) => e.key === 'Enter' && e.target.blur()}
      style={{
        background: 'transparent',
        border: 'none',
        borderBottom: '1px solid transparent',
        outline: 'none',
        fontSize: 13,
        width: '100%',
        cursor: 'text',
        ...style,
      }}
      onFocus={(e) => (e.target.style.borderBottomColor = '#e2d5a0')}
      onBlurCapture={(e) => (e.target.style.borderBottomColor = 'transparent')}
    />
  );

  return (
    <div
      className="bg-white rounded-xl p-5"
      style={{ border: '1px solid #e8e0cc', display: 'flex', flexDirection: 'column', height: '100%' }}
    >
      <p className="text-xs font-semibold uppercase tracking-wide mb-4" style={{ color: '#a08c4a' }}>
        Estimation des coûts
      </p>

      {/* Total — mis à jour automatiquement */}
      <div
        className="flex items-center justify-between p-3 rounded-lg mb-3"
        style={{ backgroundColor: '#f3edd6', border: '1px solid #e2d5a0' }}
      >
        <span className="text-sm font-medium" style={{ color: '#a08c4a' }}>Total</span>
        <div className="flex items-center gap-1">
          {totalInput}
          <span className="text-sm font-medium" style={{ color: '#c9b479' }}>
            {localCost.currency}
          </span>
        </div>
      </div>

      {/* Tableau breakdown */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <colgroup>
            <col style={{ width: '50%' }} />
            <col style={{ width: '30%' }} />
            <col style={{ width: '20%' }} />
          </colgroup>
          <thead>
            <tr style={{ borderBottom: '1px solid #e8e0cc' }}>
              {['Tâche', 'Type', 'Coût'].map((h) => (
                <th key={h} style={{
                  textAlign: h === 'Coût' ? 'right' : 'left',
                  paddingBottom: 8,
                  fontWeight: 500,
                  fontSize: 11,
                  color: '#a08c4a',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {localCost.breakdown?.map((item, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #f0ebe0' }}>
                <td style={{ padding: '10px 8px 10px 0', color: '#374151' }}>
                  {cellInput(i, 'task', item.task)}
                </td>
                <td style={{ padding: '10px 8px', color: '#94a3b8' }}>
                  {cellInput(i, 'type', item.type)}
                </td>
                <td style={{ padding: '10px 0 10px 8px', textAlign: 'right', color: '#a08c4a', fontWeight: 500 }}>
                  {cellInput(i, 'cost', item.cost, { textAlign: 'right' })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}