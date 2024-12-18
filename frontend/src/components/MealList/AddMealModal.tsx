import React, { useState } from 'react';
import ImageUpload from '../ImageUpload/ImageUpload';

interface AddMealModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { 
    type: string;
    name: string;
    image?: File;
    description?: string;
  }) => Promise<void>;
  isLoading: boolean;
  mealType: string;
}

export const AddMealModal: React.FC<AddMealModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  mealType
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [textInput, setTextInput] = useState('');
  const [description, setDescription] = useState('');

  const handleImageSelect = (file: File) => {
    setSelectedFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile && !textInput.trim()) {
      alert('이미지를 선택하거나 메뉴명을 입력해주세요.');
      return;
    }

    await onSubmit({
      type: mealType,
      name: textInput,
      image: selectedFile || undefined,
      description: description
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">식사 추가</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <ImageUpload onImageSelect={handleImageSelect} />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                메뉴명
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="메뉴명을 입력하세요"
                className="w-full p-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                설명
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="설명을 입력하세요"
                className="w-full p-2 border rounded-lg"
                rows={3}
              />
            </div>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
              disabled={isLoading}
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              disabled={isLoading || (!selectedFile && !textInput.trim())}
            >
              {isLoading ? '처리중...' : '추가'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 