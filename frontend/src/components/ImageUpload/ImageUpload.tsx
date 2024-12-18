import React from 'react';

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelect }) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageSelect(file);
    }
  };

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        id="imageInput"
      />
      <label
        htmlFor="imageInput"
        className="cursor-pointer block"
      >
        <div className="text-gray-600">
          이미지를 클릭하여 선택하세요
        </div>
      </label>
    </div>
  );
};

export default ImageUpload; 