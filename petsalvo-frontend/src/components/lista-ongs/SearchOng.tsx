import React from 'react';

const SearchOng = ({ onSearchChange }: any) => {
  return (
    <div className="flex flex-col gap-4 items">
      <input
        type="text"
        className="border border-black rounded p-2 placeholder-gray-600 text-sm"
        placeholder="Pesquisar"
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
};

export default SearchOng;
