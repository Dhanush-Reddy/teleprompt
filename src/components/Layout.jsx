import React from 'react';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans flex flex-col items-center py-10 px-4 selection:bg-indigo-500 selection:text-white">
      <div className="w-full max-w-4xl flex flex-col items-center gap-8">
        {children}
      </div>
    </div>
  );
};

export default Layout;
