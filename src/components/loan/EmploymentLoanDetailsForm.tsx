
import React from 'react';

interface EmploymentLoanDetailsFormProps {
  formData: {
    employmentType: string;
    companyName: string;
    monthlyIncome: string;
    hospitalName: string;
    loanAmount: string;
    repaymentTenure: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

const EmploymentLoanDetailsForm = ({ formData, handleInputChange }: EmploymentLoanDetailsFormProps) => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900">Employment Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Employment Type</label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="employmentType"
                value="salaried"
                checked={formData.employmentType === 'salaried'}
                onChange={handleInputChange}
                className="w-4 h-4 text-brand-600 focus:ring-brand-500"
              />
              <span className="ml-2 text-gray-700">Salaried</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="employmentType"
                value="self-employed"
                checked={formData.employmentType === 'self-employed'}
                onChange={handleInputChange}
                className="w-4 h-4 text-brand-600 focus:ring-brand-500"
              />
              <span className="ml-2 text-gray-700">Self-Employed</span>
            </label>
          </div>
        </div>

        <div>
          <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
            {formData.employmentType === 'salaried' ? 'Company Name' : 'Business Name'}
          </label>
          <input
            type="text"
            id="companyName"
            name="companyName"
            value={formData.companyName}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            placeholder={formData.employmentType === 'salaried' ? 'Enter company name' : 'Enter business name'}
            required
          />
        </div>

        <div>
          <label htmlFor="monthlyIncome" className="block text-sm font-medium text-gray-700 mb-1">Monthly Income (₹)</label>
          <input
            type="number"
            id="monthlyIncome"
            name="monthlyIncome"
            value={formData.monthlyIncome}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            placeholder="Enter your monthly income"
            required
          />
        </div>
      </div>

      <h3 className="text-xl font-semibold text-gray-900 pt-4">Loan Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="hospitalName" className="block text-sm font-medium text-gray-700 mb-1">Hospital Name</label>
          <select
            id="hospitalName"
            name="hospitalName"
            value={formData.hospitalName}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            required
          >
            <option value="" disabled>Select a partner hospital</option>
            <option value="Apollo Hospital">Apollo Hospital</option>
            <option value="Max Healthcare">Max Healthcare</option>
            <option value="Fortis Hospital">Fortis Hospital</option>
            <option value="Medanta">Medanta</option>
            <option value="AIIMS">AIIMS</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label htmlFor="loanAmount" className="block text-sm font-medium text-gray-700 mb-1">Loan Amount Required (₹)</label>
          <input
            type="number"
            id="loanAmount"
            name="loanAmount"
            value={formData.loanAmount}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            placeholder="Enter loan amount"
            required
          />
        </div>

        <div>
          <label htmlFor="repaymentTenure" className="block text-sm font-medium text-gray-700 mb-1">Preferred Repayment Tenure</label>
          <select
            id="repaymentTenure"
            name="repaymentTenure"
            value={formData.repaymentTenure}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            required
          >
            <option value="3">3 Months</option>
            <option value="6">6 Months</option>
            <option value="12">12 Months</option>
            <option value="18">18 Months</option>
            <option value="24">24 Months</option>
            <option value="36">36 Months</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default EmploymentLoanDetailsForm;
