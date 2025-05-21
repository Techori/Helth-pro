import React from 'react';
import { CheckCircle, BadgeCheck, ChevronRight } from 'lucide-react';

// Updated interface to match what we need in ApplyLoan.tsx
interface Offer {
  id: number; // Changed from string to number
  provider?: string; // Made optional
  amount: string;
  interestRate: string;
  tenure: string;
  emi: string;
  processingFee?: number; // Made optional
  description?: string; // Made optional
}

interface LoanOffersProps {
  offers: Offer[];
  selectedOfferId?: number | null; // Changed from string to number and made optional
  onSelectOffer: (offer: Offer) => void; // Changed to accept an Offer object, not just an ID
}

const LoanOffers: React.FC<LoanOffersProps> = ({ offers, selectedOfferId, onSelectOffer }) => {
  return (
    <div className="space-y-6 bg-orange-500 rounded-xl p-6">
      <h3 className="text-xl font-semibold text-white">Available Loan Offers</h3>
      
      <div className="bg-orange-400/70 p-4 rounded-lg mb-6">
        <div className="flex items-start">
          <BadgeCheck className="h-5 w-5 text-white mt-1 mr-2 flex-shrink-0" />
          <p className="text-sm text-white">
            Based on your profile and financial analysis, we've curated these personalized loan offers for you.
            Select the offer that best suits your needs.
          </p>
        </div>
      </div>
      
      <div className="space-y-4">
        {offers.length > 0 ? (
          offers.map((offer) => (
            <div 
              key={offer.id}
              className={`border rounded-lg p-4 transition-all cursor-pointer ${
                selectedOfferId === offer.id 
                  ? 'border-white bg-orange-400/60 shadow-sm'
                  : 'border-orange-300 hover:border-white hover:bg-orange-400/40'
              }`}
              onClick={() => onSelectOffer(offer)}
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-medium text-white">{offer.provider || 'RiMed Healthcare Finance'}</h4>
                {selectedOfferId === offer.id && (
                  <CheckCircle className="h-5 w-5 text-white" />
                )}
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                <div>
                  <p className="text-sm text-orange-100">Loan Amount</p>
                  <p className="font-semibold text-white">₹{offer.amount}</p>
                </div>
                <div>
                  <p className="text-sm text-orange-100">Interest Rate</p>
                  <p className="font-semibold text-white">{offer.interestRate}% p.a.</p>
                </div>
                <div>
                  <p className="text-sm text-orange-100">Tenure</p>
                  <p className="font-semibold text-white">{offer.tenure} months</p>
                </div>
                <div>
                  <p className="text-sm text-orange-100">Monthly EMI</p>
                  <p className="font-semibold text-white">₹{offer.emi}</p>
                </div>
                <div>
                  <p className="text-sm text-orange-100">Processing Fee</p>
                  <p className="font-semibold text-white">₹{offer.processingFee?.toLocaleString() || '0'}</p>
                </div>
              </div>
              
              <p className="text-sm text-orange-100 mb-4">{offer.description || 'Standard healthcare financing with competitive interest rates.'}</p>
              
              <div className="flex items-center justify-between">
                <div className="text-xs text-orange-100">
                  Terms & conditions apply
                </div>
                <div className={`flex items-center text-sm ${selectedOfferId === offer.id ? 'text-white font-medium' : 'text-orange-100'}`}>
                  View Details <ChevronRight className="h-4 w-4 ml-1" />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10 border rounded-lg border-white">
            <p className="text-white">No offers available at the moment.</p>
          </div>
        )}
      </div>
      
      {selectedOfferId && (
        <div className="p-4 bg-green-600/20 rounded-lg border border-green-200">
          <div className="flex items-start">
            <CheckCircle className="h-5 w-5 text-white mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <p className="font-medium text-white">
                You've selected an offer!
              </p>
              <p className="text-sm text-white mt-1">
                Click "Next" to proceed with document signing and complete your application.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoanOffers;
