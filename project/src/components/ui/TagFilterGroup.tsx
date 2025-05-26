import React from 'react';
import { X } from 'lucide-react';
import { Tag } from '../../constants/tags';

interface TagFilterGroupProps {
  category?: string;
  tags: readonly Tag[];
  selectedTags: Tag[];
  onTagSelect: (tag: Tag, category?: string) => void;
  className?: string;
  colorScheme?: 'teal' | 'blue' | 'purple' | 'orange';
}

const TagFilterGroup: React.FC<TagFilterGroupProps> = ({
  category,
  tags,
  selectedTags,
  onTagSelect,
  className = '',
  colorScheme = 'teal',
}) => {
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

  return (
    <div className={className}>
      {category && (
        <h3 className="text-sm font-medium text-slate-700 mb-2">{category}</h3>
      )}
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => {
          const isSelected = selectedTags.includes(tag);
          return (
            <button
              key={tag}
              onClick={() => onTagSelect(tag, category)}
              className={`
                inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                border transition-colors duration-150
                ${getColorClasses(isSelected)}
              `}
            >
              {tag}
              {isSelected && (
                <X
                  size={14}
                  className="ml-1.5 -mr-0.5"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TagFilterGroup; 