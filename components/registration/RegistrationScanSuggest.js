import React, { useState } from 'react';

export function RegistrationScanSuggest({
  setPatient,
  suggestionList,
  setScanModalOpen,
}) {
  const renderSuggestion = suggestion => {
    const name = suggestion.name;
    const id = `${suggestion.village_prefix} ${suggestion.pk
      .toString()
      .padStart(3, '0')}`;
    const imageUrl = suggestion.picture;
    const confidence = suggestion.confidence;

    return (
      <div
        className="card cursor-pointer grid grid-cols-2"
        onClick={() => {
          setPatient(suggestion);
          setScanModalOpen(false);
        }}
      >
        <div className="self-center">
          <img
            src={imageUrl}
            alt="Placeholder image"
            className="object-cover h-28 w-28 my-2"
          />
        </div>

        <div className="flex flex-col justify-center ml-2">
          <div className="text-s font-medium text-gray-900">{id}</div>
          <div className="text-s font-medium text-gray-900">{name}</div>
          <div className="text-s font-medium text-gray-900">{confidence}</div>
        </div>
      </div>
    );
  };

  return suggestionList.map(item => renderSuggestion(item));
}
