import React, { useState } from 'react';
import SearchableDropdown from './ui/SearchableDropdown';
import { AVAILABLE_TAGS, TagCategory, Tag } from '../constants/tags';

interface TagFiltersProps {
  onTagsChange: (selectedTags: Record<TagCategory, Tag[]>) => void;
  className?: string;
}

const TagFilters: React.FC<TagFiltersProps> = ({
  onTagsChange,
  className = '',
}) => {
  const [selectedTags, setSelectedTags] = useState<Record<TagCategory, Tag[]>>({
    specialty: [],
    useCase: [],
    userType: [],
    appModel: [],
  });

  const colorSchemes: Record<TagCategory, 'teal' | 'blue' | 'purple' | 'orange'> = {
    specialty: 'teal',
    useCase: 'blue',
    userType: 'purple',
    appModel: 'orange',
  };

  const categoryLabels: Record<TagCategory, string> = {
    specialty: 'Specialties',
    useCase: 'Use Cases',
    userType: 'User Types',
    appModel: 'App Models',
  };

  const handleTagSelect = (category: TagCategory, tag: Tag) => {
    const newSelectedTags = { ...selectedTags };
    newSelectedTags[category] = [tag];
    setSelectedTags(newSelectedTags);
    onTagsChange(newSelectedTags);
  };

  const handleTagRemove = (category: TagCategory, tag: Tag) => {
    const newSelectedTags = { ...selectedTags };
    newSelectedTags[category] = [];
    setSelectedTags(newSelectedTags);
    onTagsChange(newSelectedTags);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {Object.entries(AVAILABLE_TAGS).map(([category, tags]) => (
        <SearchableDropdown<Tag>
          key={category}
          label={categoryLabels[category as TagCategory]}
          options={tags}
          selectedOptions={selectedTags[category as TagCategory]}
          onSelect={(tag) => handleTagSelect(category as TagCategory, tag)}
          onRemove={(tag) => handleTagRemove(category as TagCategory, tag)}
          placeholder={`Select ${categoryLabels[category as TagCategory].toLowerCase()}...`}
          className="w-full"
          colorScheme={colorSchemes[category as TagCategory]}
        />
      ))}
    </div>
  );
};

export default TagFilters; 