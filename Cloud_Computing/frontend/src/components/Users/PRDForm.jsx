import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../Layout/Sidebar';
import Navbar from '../Layout/Navbar';
import PRDDisplay from './PRDDisplay';
import api from '../../utils/api';

const PersonilTag = ({ name, onRemove }) => {
  return (
    <div className="inline-flex items-center gap-1 bg-gray-200 px-2 py-1 rounded">
      <span className="text-sm">{name}</span>
      <button
        type="button"
        onClick={onRemove}
        className="text-gray-400 hover:text-gray-600 ml-1"
      >
        ×
      </button>
    </div>
  );
};

const SelectWithTags = ({ label, value, onChange, options, selectedIds, onAdd, onRemove, error }) => (
  <div className="space-y-2">
    <label className="text-sm font-medium">{label}</label>
    <div className="flex gap-2">
      <select 
        className="select select-bordered flex-1"
        value={value}
        onChange={onChange}
      >
        <option value="">Select personil</option>
        {options.map(option => (
          <option key={option.personil_id} value={option.personil_id}>
            {option.personil_name}
          </option>
        ))}
      </select>
      <button
        type="button"
        className="btn btn-active"
        onClick={onAdd}
      >
        Add
      </button>
    </div>
    {error && <p className="text-red-500 text-sm">{error}</p>}
    <div className="flex flex-wrap gap-2 mt-2">
      {selectedIds.map(id => {
        const personil = options.find(option => option.personil_id === Number(id));
        return (
          <PersonilTag
            key={id}
            name={personil ? personil.personil_name : 'Unknown'}
            onRemove={() => onRemove(id)}
          />
        );
      })}
    </div>
  </div>
);

const PRDForm = () => {
  const [productName, setProductName] = useState('');
  const [documentVersion, setDocumentVersion] = useState('');
  const [documentOwner, setDocumentOwner] = useState([]);
  const [developer, setDeveloper] = useState([]);
  const [stakeholder, setStakeholder] = useState([]);
  const [projectOverview, setProjectOverview] = useState('');
  const [darciRoles, setDarciRoles] = useState({
    decider: [],
    accountable: [],
    responsible: [],
    consulted: [],
    informed: []
  });
  const [selectedPersonil, setSelectedPersonil] = useState({
    documentOwner: '',
    developer: '',
    stakeholder: '',
    decider: '',
    accountable: '',
    responsible: '',
    consulted: '',
    informed: ''
  });
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [generatedPRD, setGeneratedPRD] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [personil, setPersonil] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchPersonil = async () => {
      try {
        const response = await api.get('/personil');
        setPersonil(response.data);
      } catch (error) {
        console.error('Error fetching personil:', error);
        setError(error.message);
      }
    };

    fetchPersonil();
  }, []);

  const handleAddPersonil = (role) => {
    if (selectedPersonil[role]) {
      setDarciRoles({
        ...darciRoles,
        [role]: [...darciRoles[role], Number(selectedPersonil[role])]
      });
      setSelectedPersonil({ ...selectedPersonil, [role]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!documentVersion) newErrors.documentVersion = 'Document version is required';
    if (!productName) newErrors.productName = 'Product name is required';
    if (!projectOverview) newErrors.projectOverview = 'Project overview is required';
    if (!startDate) newErrors.startDate = 'Start date is required';
    if (!endDate) newErrors.endDate = 'End date is required';
    if (documentOwner.length === 0) newErrors.documentOwner = 'At least one document owner is required';
    if (developer.length === 0) newErrors.developer = 'At least one developer is required';
    if (stakeholder.length === 0) newErrors.stakeholder = 'At least one stakeholder is required';
    if (darciRoles.decider.length === 0) newErrors.decider = 'At least one decider is required';
    if (darciRoles.accountable.length === 0) newErrors.accountable = 'At least one accountable is required';
    if (darciRoles.responsible.length === 0) newErrors.responsible = 'At least one responsible is required';
    if (darciRoles.consulted.length === 0) newErrors.consulted = 'At least one consulted is required';
    if (darciRoles.informed.length === 0) newErrors.informed = 'At least one informed is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    setError(null);

    const prdData = {
      document_version: documentVersion,
      product_name: productName,
      document_owner: documentOwner,
      developer: developer,
      stakeholder: stakeholder,
      project_overview: projectOverview,
      darci_roles: darciRoles,
      start_date: startDate,
      end_date: endDate
    };

    try {
      const response = await api.post('/prd', prdData);
      setGeneratedPRD(response.data);
    } catch (error) {
      console.error("Error generating PRD:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (generatedPRD) {
    return <PRDDisplay prdData={generatedPRD} />;
  }

  return (
    <div className="flex min-h-screen bg-base-100">
      {loading && (
        <div className="loading-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999
        }}>
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      )}
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <div className="p-8">
          <div className="max-w-4xl mx-auto mt-8">
            <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 relative">
              <Link to="/prd-list" className="text-xl absolute top-4 left-4 btn btn-ghost">
                ←
              </Link>
              <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">
                Product Requirements Document
              </h1>
              <p className="text-center text-gray-600 mb-8">
                Create a new PRD by filling out the form below
              </p>
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold">Basic Information</h2>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Document Version</label>
                      <input
                        type="text"
                        className="input input-bordered w-full"
                        placeholder="e.g., 1.0.0"
                        value={documentVersion}
                        onChange={(e) => setDocumentVersion(e.target.value)}
                      />
                      {errors.documentVersion && <p className="text-red-500 text-sm">{errors.documentVersion}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Product Name</label>
                      <input
                        type="text"
                        className="input input-bordered w-full"
                        placeholder="Enter product name"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                      />
                      {errors.productName && <p className="text-red-500 text-sm">{errors.productName}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Project Overview</label>
                    <textarea
                      className="textarea textarea-bordered w-full h-24"
                      placeholder="Describe your project"
                      value={projectOverview}
                      onChange={(e) => setProjectOverview(e.target.value)}
                    ></textarea>
                    {errors.projectOverview && <p className="text-red-500 text-sm">{errors.projectOverview}</p>}
                  </div>
                </div>

                <div className="space-y-6">
                  <h2 className="text-lg font-semibold">Team Assignment</h2>
                  <div className="space-y-6">
                    <SelectWithTags
                      label="Document Owner"
                      value={selectedPersonil.documentOwner}
                      onChange={(e) => setSelectedPersonil({ ...selectedPersonil, documentOwner: e.target.value })}
                      options={personil}
                      selectedIds={documentOwner}
                      onAdd={() => setDocumentOwner([...documentOwner, Number(selectedPersonil.documentOwner)])}
                      onRemove={(id) => setDocumentOwner(documentOwner.filter(ownerId => ownerId !== id))}
                      error={errors.documentOwner}
                    />

                    <SelectWithTags
                      label="Developer"
                      value={selectedPersonil.developer}
                      onChange={(e) => setSelectedPersonil({ ...selectedPersonil, developer: e.target.value })}
                      options={personil}
                      selectedIds={developer}
                      onAdd={() => setDeveloper([...developer, Number(selectedPersonil.developer)])}
                      onRemove={(id) => setDeveloper(developer.filter(devId => devId !== id))}
                      error={errors.developer}
                    />

                    <SelectWithTags
                      label="Stakeholder"
                      value={selectedPersonil.stakeholder}
                      onChange={(e) => setSelectedPersonil({ ...selectedPersonil, stakeholder: e.target.value })}
                      options={personil}
                      selectedIds={stakeholder}
                      onAdd={() => setStakeholder([...stakeholder, Number(selectedPersonil.stakeholder)])}
                      onRemove={(id) => setStakeholder(stakeholder.filter(stakeId => stakeId !== id))}
                      error={errors.stakeholder}
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <h2 className="text-lg font-semibold">DARCI Roles</h2>
                  <div className="grid grid-cols-2 gap-6">
                    {Object.entries(darciRoles).map(([role, selectedIds]) => (
                      <SelectWithTags
                        key={role}
                        label={role.charAt(0).toUpperCase() + role.slice(1)}
                        value={selectedPersonil[role]}
                        onChange={(e) => setSelectedPersonil({ ...selectedPersonil, [role]: e.target.value })}
                        options={personil}
                        selectedIds={selectedIds}
                        onAdd={() => handleAddPersonil(role)}
                        onRemove={(id) => setDarciRoles({
                          ...darciRoles,
                          [role]: darciRoles[role].filter(personilId => personilId !== id)
                        })}
                        error={errors[role]}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <h2 className="text-lg font-semibold">Project Timeline</h2>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Start Date</label>
                      <input
                        type="date"
                        className="input input-bordered w-full"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                      {errors.startDate && <p className="text-red-500 text-sm">{errors.startDate}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">End Date</label>
                      <input
                        type="date"
                        className="input input-bordered w-full"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                      {errors.endDate && <p className="text-red-500 text-sm">{errors.endDate}</p>}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <button 
                    type="submit" 
                    className="btn btn-neutral"
                    disabled={loading}
                  >
                    Generate PRD
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PRDForm;