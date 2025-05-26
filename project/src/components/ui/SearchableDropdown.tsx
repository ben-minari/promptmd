import React, { useState, useRef, useEffect } from 'react';
import { X, ChevronDown, Check } from 'lucide-react';

interface SearchableDropdownProps<T extends string> {
  label: string;
  options: readonly T[];
  selectedOptions: T[];
  onSelect: (option: T) => void;
  onRemove: (option: T) => void;
  onClearAll?: () => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  colorScheme?: 'teal' | 'blue' | 'purple' | 'orange';
}

const SearchableDropdown = <T extends string>({
  label,
  options,
  selectedOptions,
  onSelect,
  onRemove,
  onClearAll,
  placeholder = 'Select options...',
  className = '',
  disabled = false,
  colorScheme = 'teal',
}: SearchableDropdownProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getColorClasses = (isSelected: boolean) => {
    const baseColors = {
      teal: {
        selected: 'bg-teal-100 text-teal-800 border-teal-200',
        unselected: 'bg-white text-slate-600 border-slate-200 hover:bg-teal-50 hover:text-teal-700 hover:border-teal-200',
      },
      blue: {
        selected: 'bg-blue-100 text-blue-800 border-blue-200',
        unselected: 'bg-white text-slate-600 border-slate-200 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200',
      },
      purple: {
        selected: 'bg-purple-100 text-purple-800 border-purple-200',
        unselected: 'bg-white text-slate-600 border-slate-200 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200',
      },
      orange: {
        selected: 'bg-orange-100 text-orange-800 border-orange-200',
        unselected: 'bg-white text-slate-600 border-slate-200 hover:bg-orange-50 hover:text-orange-700 hover:border-orange-200',
      },
    };

    return isSelected ? baseColors[colorScheme].selected : baseColors[colorScheme].unselected;
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex(prev => 
          prev < filteredOptions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex(prev => prev > 0 ? prev - 1 : prev);
        break;
      case 'Enter':
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < filteredOptions.length) {
          onSelect(filteredOptions[focusedIndex]);
          setSearchQuery('');
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <label className="block text-sm font-medium text-slate-700 mb-1">
        {label}
      </label>
      
      <div className="relative">
        <div
          className={`flex flex-wrap gap-2 p-2 min-h-[38px] border rounded-md ${
            disabled ? 'bg-slate-50' : 'bg-white'
          } ${
            isOpen ? `border-${colorScheme}-500 ring-1 ring-${colorScheme}-500` : 'border-slate-200'
          }`}
          onClick={() => !disabled && setIsOpen(true)}
        >
          {selectedOptions.map(option => (
            <span
              key={option}
              className={`inline-flex items-center px-2 py-1 rounded-md text-sm ${getColorClasses(true)}`}
            >
              {option}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(option);
                }}
                className={`ml-1 hover:text-${colorScheme}-900`}
              >
                <X size={14} />
              </button>
            </span>
          ))}
          
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsOpen(true)}
            placeholder={selectedOptions.length === 0 ? placeholder : ''}
            className="flex-1 min-w-[120px] outline-none bg-transparent"
            disabled={disabled}
          />
          
          <div className="flex items-center">
            {selectedOptions.length > 0 && onClearAll && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onClearAll();
                }}
                className="p-1 hover:text-slate-600"
              >
                <X size={16} />
              </button>
            )}
            <ChevronDown
              size={16}
              className={`ml-1 text-slate-400 ${
                isOpen ? 'transform rotate-180' : ''
              }`}
            />
          </div>
        </div>

        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-md shadow-lg max-h-60 overflow-auto">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-2 text-sm text-slate-500">
                No options found
              </div>
            ) : (
              filteredOptions.map((option, index) => (
                <div
                  key={option}
                  className={`px-3 py-2 text-sm cursor-pointer flex items-center justify-between ${
                    index === focusedIndex ? `bg-${colorScheme}-50` : 'hover:bg-slate-50'
                  }`}
                  onClick={() => {
                    onSelect(option);
                    setSearchQuery('');
                    inputRef.current?.focus();
                  }}
                >
                  <span>{option}</span>
                  {selectedOptions.includes(option) && (
                    <Check size={16} className={`text-${colorScheme}-500`} />
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchableDropdown; 