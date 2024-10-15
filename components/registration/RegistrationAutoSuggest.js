import React, { useState } from 'react';
import Autosuggest from 'react-autosuggest';

export function RegistrationAutoSuggest({ setPatient, patientsList }) {
  const [value, setValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const renderSuggestion = suggestion => {
    const name = suggestion.name;
    const id = `${suggestion.village_prefix} ${suggestion.pk
      .toString()
      .padStart(3, '0')}`;
    const imageUrl = `${suggestion.picture}`;

    return (
      <div
        className="card cursor-pointer grid grid-cols-2"
        onClick={() => setPatient(suggestion)}
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
        </div>
      </div>
    );
  };

  const getSuggestionValue = suggestion => {
    return suggestion.name;
  };

  const onSuggestionsFetchRequested = ({ value }) => {
    const inputValue = value.trim().toLowerCase();
    const query =
      inputValue.length === 0
        ? []
        : patientsList.filter(patient =>
            patient.filter_string.toLowerCase().includes(inputValue)
          );

    setSuggestions(query);
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const onChange = (event, { newValue }) => {
    setValue(newValue);
  };

  const inputProps = {
    placeholder: 'Search Patient',
    type: 'search',
    value,
    onChange: onChange,
    className:
      'block w-full rounded-md border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6',
  };

  const autosuggestTheme = {
    container: 'react-autosuggest__container w-full',
    input: 'react-autosuggest__input form-input w-full',
    suggestionsContainer:
      'react-autosuggest__suggestions-container w-full mt-2 border border-gray-300 rounded-md',
    suggestionsList: 'react-autosuggest__suggestions-list w-full space-y-2 p-2',
    suggestion:
      'react-autosuggest__suggestion block w-full hover:bg-blue-100 transition-colors duration-300 ease-in-out p-2 border border-gray-300 rounded-md',
  };

  return (
    <Autosuggest
      suggestions={suggestions}
      renderSuggestion={renderSuggestion}
      getSuggestionValue={getSuggestionValue}
      onSuggestionsFetchRequested={onSuggestionsFetchRequested}
      onSuggestionsClearRequested={onSuggestionsClearRequested}
      inputProps={inputProps}
      theme={autosuggestTheme}
    />
  );
}
