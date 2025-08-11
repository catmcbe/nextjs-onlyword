'use client';

import { useState } from 'react';
import Navigation from '@/components/Navigation';
import FileUpload from '@/components/FileUpload';
import MemorizeWords from '@/components/MemorizeWords';
import PracticeWords from '@/components/PracticeWords';
import ArticleGeneration from '@/components/ArticleGeneration';
import Login from '@/components/Login';

interface Word {
  word: string;
  meaning: string;
}

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('upload');
  const [words, setWords] = useState<Word[]>([]);

  const handleFileUpload = (uploadedWords: Word[]) => {
    setWords(uploadedWords);
    setActiveTab('memorize');
  };

  const handleBackToMain = () => {
    setActiveTab('upload');
  };

  const handleLogin = (success: boolean) => {
    setIsLoggedIn(success);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setActiveTab('upload');
    setWords([]);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'upload':
        return (
          <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto px-4">
              <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">只背单词</h1>
                <p className="text-xl text-gray-600">智能单词学习，高效记忆掌握</p>
              </div>
              
              {words.length === 0 ? (
                <FileUpload onFileUpload={handleFileUpload} />
              ) : (
                <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">文件上传成功！</h2>
                  <p className="text-gray-600 mb-6">
                    已成功导入 {words.length} 个单词，请选择学习模式开始学习
                  </p>
                  <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
                </div>
              )}
            </div>
          </div>
        );
      
      case 'memorize':
        return (
          <div className="min-h-screen bg-gray-50 py-12">
            <MemorizeWords words={words} onBack={handleBackToMain} />
          </div>
        );
      
      case 'practice':
        return (
          <div className="min-h-screen bg-gray-50 py-12">
            <PracticeWords words={words} onBack={handleBackToMain} />
          </div>
        );
      
      case 'article':
        return (
          <div className="min-h-screen bg-gray-50 py-12">
            <ArticleGeneration words={words} onBack={handleBackToMain} />
          </div>
        );
      
      default:
        return null;
    }
  };

  // 如果未登录，显示登录页面
  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 添加登出按钮 */}
      <div className="absolute top-4 right-4 z-50">
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          登出
        </button>
      </div>
      
      {words.length > 0 && activeTab !== 'upload' && (
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      )}
      {renderContent()}
    </div>
  );
}
