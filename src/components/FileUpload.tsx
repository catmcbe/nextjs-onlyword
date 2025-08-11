'use client';

import { useState, useRef } from 'react';
import { Upload, FileText, X } from 'lucide-react';

interface FileUploadProps {
  onFileUpload: (words: Array<{ word: string; meaning: string }>) => void;
}

export default function FileUpload({ onFileUpload }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const parseFileContent = (content: string) => {
    const lines = content.split('\n').filter(line => line.trim());
    const words: Array<{ word: string; meaning: string }> = [];
    
    lines.forEach((line, index) => {
      try {
        // 移除行首行尾的空白字符
        const trimmedLine = line.trim();
        if (!trimmedLine) return;

        // 方法1: 尝试按第一个空格分割
        const firstSpaceIndex = trimmedLine.indexOf(' ');
        if (firstSpaceIndex > 0) {
          const word = trimmedLine.substring(0, firstSpaceIndex);
          const meaning = trimmedLine.substring(firstSpaceIndex + 1).trim();
          
          // 验证单词是否只包含字母
          if (/^[a-zA-Z]+$/.test(word)) {
            words.push({
              word: word,
              meaning: meaning
            });
            return;
          }
        }

        // 方法2: 使用正则表达式匹配更复杂的格式
        // 匹配：单词（可能包含词性）+ 空格 + 释义
        const match = trimmedLine.match(/^([a-zA-Z]+)(?:\s+[n.]+)?\s+(.+)$/);
        if (match) {
          const word = match[1];
          const meaning = match[2];
          
          words.push({
            word: word,
            meaning: meaning
          });
          return;
        }

        // 方法3: 如果上述方法都失败，尝试提取第一个英文单词作为单词
        const wordMatch = trimmedLine.match(/^([a-zA-Z]+)/);
        if (wordMatch) {
          const word = wordMatch[1];
          const meaning = trimmedLine.substring(word.length).trim();
          
          if (meaning) {
            words.push({
              word: word,
              meaning: meaning
            });
            return;
          }
        }

        // 如果所有方法都失败，记录调试信息
        console.log(`无法解析第 ${index + 1} 行: ${trimmedLine}`);
        
      } catch (error) {
        console.error(`解析第 ${index + 1} 行时出错:`, error);
        console.log(`问题行内容: ${line}`);
      }
    });
    
    console.log(`总共解析到 ${words.length} 个单词`);
    console.log('前5个单词示例:', words.slice(0, 5));
    
    return words;
  };

  const handleFile = (file: File) => {
    if (!file.name.endsWith('.txt')) {
      alert('请上传txt文件');
      return;
    }

    setUploadedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const words = parseFileContent(content);
      onFileUpload(words);
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const removeFile = () => {
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <div
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".txt"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        {uploadedFile ? (
          <div className="flex items-center justify-center space-x-2">
            <FileText className="w-8 h-8 text-green-500" />
            <span className="text-lg font-medium text-gray-700">{uploadedFile.name}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeFile();
              }}
              className="text-red-500 hover:text-red-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <Upload className="w-12 h-12 text-gray-400 mx-auto" />
            <div>
              <p className="text-lg font-medium text-gray-700">点击或拖拽上传txt文件</p>
              <p className="text-sm text-gray-500 mt-1">文件格式：单词 释义（每行一个）</p>
              <p className="text-xs text-gray-400 mt-2">例如：apple n.苹果</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}