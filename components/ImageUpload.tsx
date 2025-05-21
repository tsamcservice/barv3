import React, { useState } from 'react';
import Image from 'next/image';

interface ImageUploadProps {
  onUploadComplete: (url: string) => void;
  currentImage?: string;
  label?: string;
  maxSize?: number; // 以 MB 為單位
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onUploadComplete,
  currentImage,
  label = '上傳圖片',
  maxSize = 5
}) => {
  const [preview, setPreview] = useState<string>(currentImage || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 清除之前的錯誤
    setError('');

    // 驗證檔案大小
    if (file.size > maxSize * 1024 * 1024) {
      setError(`檔案大小不能超過 ${maxSize}MB`);
      return;
    }

    // 驗證檔案類型
    if (!file.type.startsWith('image/')) {
      setError('請上傳圖片檔案');
      return;
    }

    // 建立預覽
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // 上傳圖片
    setLoading(true);
    try {
      console.log('開始上傳圖片:', file.name);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          file: reader.result,
          fileName: file.name,
          fileType: file.type,
        }),
      });

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || '上傳失敗');
      }

      if (data.data?.url) {
        console.log('圖片上傳成功:', data.data.url);
        onUploadComplete(data.data.url);
      } else {
        throw new Error('未收到上傳 URL');
      }
    } catch (error) {
      console.error('Upload failed:', error);
      setError(error instanceof Error ? error.message : '上傳失敗，請重試');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="image-upload">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="flex items-center space-x-4">
        <div className="relative w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
          {preview ? (
            <Image
              src={preview}
              alt="Preview"
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              無圖片
            </div>
          )}
        </div>
        <div className="flex flex-col space-y-2">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id={`file-upload-${label}`}
            disabled={loading}
          />
          <label
            htmlFor={`file-upload-${label}`}
            className={`cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
              loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
            }`}
          >
            {loading ? '上傳中...' : '選擇圖片'}
          </label>
          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}
          <p className="text-xs text-gray-500">
            支援 JPG、PNG、GIF，大小限制 {maxSize}MB
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImageUpload; 