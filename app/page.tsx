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
    
  const amount = 15;
  const receiverUpiId = 'sushrutathawale1509@oksbi';

  // Generate transaction reference ID
  const transactionRef = `TXN${Date.now()}`;
  const transactionNote = 'Payment';
  
  // Build UPI parameters
  const upiParams = new URLSearchParams({
    pa: receiverUpiId,
    am: amount.toString(),
    cu: 'INR',
    tn: transactionNote,
    tr: transactionRef,
  });
  
  // Create bankDetails with paymentLink (base UPI link with all parameters)
  const bankDetails = {
    paymentLink: `upi://pay?${upiParams.toString()}`
  };

  // UPI protocols mapping
  const upiProtocols: { [key: string]: string } = {
    'phonepe': 'phonepe://pay',
    'gpay': 'tez://pay',
    'paytmmp': 'paytmmp://pay',
  };

  // Build links function as provided
  const buildLinks = (payType = 'upi') => {
    let result = '';
    let baseUPILink = bankDetails?.paymentLink;
    if (baseUPILink && baseUPILink.startsWith('upi://pay?')) {
      if (payType === 'upi' || payType === 'manual') {
        result = baseUPILink;
      } else {
        const linkParts = baseUPILink.split('?');
        result = `${upiProtocols[payType]}?${linkParts[1]}`;
      }
      return result;
    }
    return '';
  };

  // Extract parameters from the base UPI link
  const getLinkParameters = () => {
    const baseLink = bankDetails?.paymentLink;
    if (!baseLink) return {};
    
    const params: { [key: string]: string } = {};
    if (baseLink.includes('?')) {
      const queryString = baseLink.split('?')[1];
      const urlParams = new URLSearchParams(queryString);
      urlParams.forEach((value, key) => {
        params[key] = value;
      });
    }
    return params;
  };

  const getCurrentDeepLink = () => {
    if (selectedOption === null) {
      return buildLinks('upi');
    }
    const selectedPayment = upiList[selectedOption];
    if (!selectedPayment) return buildLinks('upi');
    return buildLinks(selectedPayment.protoName);
  };

  const handleProceed = () => {
    if (selectedOption === null) {
      alert('Please select a payment option');
      return;
    }

    const deepLink = getCurrentDeepLink();
    
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
        
        {/* Payment Details */}
        <div className="w-full bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700 p-6 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400 font-medium">Amount:</span>
            <span className="text-2xl font-bold text-black dark:text-zinc-50">₹{amount}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400 font-medium">Receiver:</span>
            <span className="text-sm font-mono text-black dark:text-zinc-50 break-all text-right">
              {receiverUpiId}
            </span>
          </div>
        </div>

        {/* Deep Link Display */}
        <div className="w-full bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700 p-4">
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Deep Link:</span>
            <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded border border-gray-200 dark:border-gray-700">
              <code className="text-xs font-mono text-black dark:text-zinc-50 break-all">
                {getCurrentDeepLink()}
              </code>
            </div>
            
            {/* Parameters Display */}
            <div className="mt-3">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 block">
                Parameters in Deep Link:
              </span>
              <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded border border-gray-200 dark:border-gray-700">
                <div className="space-y-1">
                  {Object.entries(getLinkParameters()).map(([key, value]) => (
                    <div key={key} className="flex gap-2 text-xs">
                      <span className="font-semibold text-blue-600 dark:text-blue-400 min-w-[60px]">
                        {key}:
                      </span>
                      <span className="font-mono text-black dark:text-zinc-50 break-all">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mt-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded border border-yellow-200 dark:border-yellow-800">
              <p className="text-xs text-yellow-800 dark:text-yellow-200">
                <strong>Note:</strong> Payment apps may show "risk policy violation" when triggered from web browsers. 
                This is a security measure. For production use, consider using UPI Intent URLs or native app integration.
              </p>
            </div>
          </div>
        </div>
        
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
