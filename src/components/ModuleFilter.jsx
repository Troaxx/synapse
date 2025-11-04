import React, { useState, useEffect } from 'react';
import { moduleAPI } from '../services/api';

const ModuleFilter = ({ selectedModuleCode, onModuleChange, label = 'Module Code', className = '' }) => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadModules();
  }, []);

  const loadModules = async () => {
    try {
      const response = await moduleAPI.getAllModules();
      setModules(response.data || []);
    } catch (error) {
      console.error('Error loading modules:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={className}>
      <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
      <select 
        value={selectedModuleCode || ''}
        onChange={(e) => onModuleChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        disabled={loading}
      >
        <option value="">All Modules</option>
        {modules.map(module => (
          <option key={module._id || module.moduleCode} value={module.moduleCode}>
            {module.moduleCode} - {module.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ModuleFilter;

