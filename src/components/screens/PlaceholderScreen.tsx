import React from 'react';

interface PlaceholderScreenProps {
  title: string;
  description: string;
}

export const PlaceholderScreen: React.FC<PlaceholderScreenProps> = ({ title, description }) => {
  return (
    <div className="p-6 max-w-lg mx-auto flex flex-col items-center justify-center text-center mt-20">
      <span className="material-symbols-outlined text-[64px] text-[#c3f400] mb-6">
        construction
      </span>
      <h2 className="text-2xl font-headline font-bold text-white mb-3">{title}</h2>
      <p className="text-[#c4c9ac] text-sm">
        {description}
      </p>
    </div>
  );
};
