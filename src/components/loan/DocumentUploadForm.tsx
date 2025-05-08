
import { FileText, Upload } from 'lucide-react';

interface DocumentUploadFormProps {
  formData: {
    documents: {
      aadhaar: File | null;
      pan: File | null;
      bankStatement: File | null;
    }
  };
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const DocumentUploadForm = ({ formData, handleFileChange }: DocumentUploadFormProps) => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900">Document Upload</h3>
      <p className="text-gray-600">Please upload the following documents to complete your application.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glassmorphism p-6 rounded-xl">
          <div className="flex flex-col items-center">
            <FileText className="h-10 w-10 text-brand-600 mb-4" />
            <h4 className="font-medium text-gray-900 mb-2">Aadhaar Card</h4>
            <p className="text-sm text-gray-500 text-center mb-4">Upload front and back of your Aadhaar card</p>
            
            <label className="w-full">
              <div className="btn-outline w-full flex items-center justify-center cursor-pointer">
                <Upload className="h-4 w-4 mr-2" />
                <span>Upload Aadhaar</span>
              </div>
              <input
                type="file"
                name="aadhaar"
                onChange={handleFileChange}
                className="hidden"
                accept="image/*,application/pdf"
              />
            </label>
            
            {formData.documents.aadhaar && (
              <div className="mt-2 text-sm text-brand-600">
                ✓ {(formData.documents.aadhaar as File).name}
              </div>
            )}
          </div>
        </div>

        <div className="glassmorphism p-6 rounded-xl">
          <div className="flex flex-col items-center">
            <FileText className="h-10 w-10 text-brand-600 mb-4" />
            <h4 className="font-medium text-gray-900 mb-2">PAN Card</h4>
            <p className="text-sm text-gray-500 text-center mb-4">Upload a clear copy of your PAN card</p>
            
            <label className="w-full">
              <div className="btn-outline w-full flex items-center justify-center cursor-pointer">
                <Upload className="h-4 w-4 mr-2" />
                <span>Upload PAN</span>
              </div>
              <input
                type="file"
                name="pan"
                onChange={handleFileChange}
                className="hidden"
                accept="image/*,application/pdf"
              />
            </label>
            
            {formData.documents.pan && (
              <div className="mt-2 text-sm text-brand-600">
                ✓ {(formData.documents.pan as File).name}
              </div>
            )}
          </div>
        </div>

        <div className="glassmorphism p-6 rounded-xl">
          <div className="flex flex-col items-center">
            <FileText className="h-10 w-10 text-brand-600 mb-4" />
            <h4 className="font-medium text-gray-900 mb-2">Bank Statement</h4>
            <p className="text-sm text-gray-500 text-center mb-4">Upload last 3 months bank statement</p>
            
            <label className="w-full">
              <div className="btn-outline w-full flex items-center justify-center cursor-pointer">
                <Upload className="h-4 w-4 mr-2" />
                <span>Upload Statement</span>
              </div>
              <input
                type="file"
                name="bankStatement"
                onChange={handleFileChange}
                className="hidden"
                accept="image/*,application/pdf"
              />
            </label>
            
            {formData.documents.bankStatement && (
              <div className="mt-2 text-sm text-brand-600">
                ✓ {(formData.documents.bankStatement as File).name}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="pt-4">
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              className="w-4 h-4 text-brand-600 border-gray-300 rounded focus:ring-brand-500"
              required
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="terms" className="text-gray-700">
              I agree to the <a href="#" className="text-brand-600 hover:underline">Terms of Service</a> and <a href="#" className="text-brand-600 hover:underline">Privacy Policy</a>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentUploadForm;
