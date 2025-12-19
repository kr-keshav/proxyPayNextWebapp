'use client';

import { useState } from 'react';

const upiList: { [key: number]: any } = {
  0: {
    name: 'PhonePe',
    img: null, // phonepeIcon - placeholder
    protoName: 'phonepe',
  },
  1: {
    name: 'Google Pay',
    img: null, // gpayIcon - placeholder
    protoName: 'gpay',
  },
  2: {
    name: 'Paytm',
    img: null, // paytmIcon - placeholder
    protoName: 'paytmmp',
  },
  3: {
    name: 'Other Apps',
    img: null, // threedotsIcon - placeholder
    protoName: 'upi',
  },
  5: {
    name: 'Send to UPI ID',
    img: null, // upiId - placeholder
    protoName: 'manual',
  },
};

export default function Home() {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const handleProceed = () => {
    if (selectedOption === null) {
      alert('Please select a payment option');
      return;
    }

    const selectedPayment = upiList[selectedOption];
    if (!selectedPayment) return;

    // Construct deep link based on protoName
    let deepLink = '';
    
    switch (selectedPayment.protoName) {
      case 'phonepe':
        deepLink = 'phonepe://pay';
        break;
      case 'gpay':
        deepLink = 'tez://pay'; // Google Pay uses 'tez' protocol
        break;
      case 'paytmmp':
        deepLink = 'paytmmp://pay';
        break;
      case 'upi':
        deepLink = 'upi://pay';
        break;
      case 'manual':
        // For manual UPI ID, you might want to show a form or different flow
        deepLink = 'upi://pay';
        break;
      default:
        deepLink = 'upi://pay';
    }

    // Trigger deep link
    window.location.href = deepLink;
    
    // Fallback: If deep link doesn't work, you can also try opening in new window
    // window.open(deepLink, '_blank');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-col items-center justify-center gap-8 px-6 py-32 w-full max-w-md">
        <h1 className="text-3xl font-semibold text-black dark:text-zinc-50 mb-4">
          Select Payment Method
        </h1>
        
        <div className="w-full space-y-3">
          {Object.entries(upiList).map(([key, payment]) => {
            const optionKey = parseInt(key);
            const isSelected = selectedOption === optionKey;
            
            return (
              <label
                key={optionKey}
                className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <input
                  type="radio"
                  name="paymentOption"
                  value={optionKey}
                  checked={isSelected}
                  onChange={() => setSelectedOption(optionKey)}
                  className="w-5 h-5 text-blue-600 focus:ring-blue-500 focus:ring-2"
                />
                <div className="flex items-center gap-3 flex-1">
                  {payment.img ? (
                    <img
                      src={payment.img}
                      alt={payment.name}
                      className="w-8 h-8 object-contain"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <span className="text-xs">📱</span>
                    </div>
                  )}
                  <span className="text-lg font-medium text-black dark:text-zinc-50">
                    {payment.name}
                  </span>
                </div>
              </label>
            );
          })}
        </div>

        <button
          onClick={handleProceed}
          disabled={selectedOption === null}
          className="w-full rounded-lg bg-blue-600 px-6 py-3 text-white font-medium transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-400"
        >
          Proceed
        </button>
      </main>
    </div>
  );
}
