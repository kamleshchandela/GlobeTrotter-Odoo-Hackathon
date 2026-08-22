import React from 'react';
import { Loader2 } from 'lucide-react';

const Loader = ({ size = 48, className = '' }) => {
  return (
    <div className={`flex items-center justify-center min-h-screen w-full bg-background ${className}`}>
      <div className="w-12 h-12 border-4 border-saffron/20 border-t-saffron rounded-full animate-spin" />

    </div>
  );
};

export default Loader;
