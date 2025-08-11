'use client';

import { useState, useEffect } from 'react';
import { Check, X, BookOpen, RotateCcw } from 'lucide-react';

interface Word {
  word: string;
  meaning: string;
}

interface MemorizeWordsProps {
  words: Word[];
  onBack: () => void;
}

export default function MemorizeWords({ words, onBack }: MemorizeWordsProps) {
  const [wordCount, setWordCount] = useState(10);
  const [selectedWords, setSelectedWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMeaning, setShowMeaning] = useState(false);
  const [unknownWords, setUnknownWords] = useState<Word[]>([]);
  const [reviewRounds, setReviewRounds] = useState<Word[][]>([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const startLearning = () => {
    if (words.length === 0) {
      alert('请先上传单词文件');
      return;
    }
    
    if (wordCount > words.length) {
      alert(`单词数量不能超过${words.length}个`);
      return;
    }

    const shuffled = [...words].sort(() => Math.random() - 0.5);
    setSelectedWords(shuffled.slice(0, wordCount));
    setIsStarted(true);
    setCurrentIndex(0);
    setShowMeaning(false);
    setUnknownWords([]);
    setReviewRounds([]);
    setCurrentRound(0);
    setIsCompleted(false);
  };

  const handleKnow = () => {
    setShowMeaning(true);
  };

  const handleUnknown = () => {
    setShowMeaning(true);
    setUnknownWords(prev => [...prev, selectedWords[currentIndex]]);
  };

  const handleMemorized = () => {
    if (currentIndex < selectedWords.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setShowMeaning(false);
    } else {
      // 当前轮次完成
      if (unknownWords.length > 0) {
        // 开始复习
        setReviewRounds(prev => [...prev, unknownWords]);
        setSelectedWords(unknownWords);
        setUnknownWords([]);
        setCurrentIndex(0);
        setShowMeaning(false);
        setCurrentRound(prev => prev + 1);
      } else {
        // 全部完成
        setIsCompleted(true);
      }
    }
  };

  const handleContinue = () => {
    if (currentIndex < selectedWords.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setShowMeaning(false);
    } else {
      // 当前轮次完成
      if (unknownWords.length > 0) {
        // 开始复习
        setReviewRounds(prev => [...prev, unknownWords]);
        setSelectedWords(unknownWords);
        setUnknownWords([]);
        setCurrentIndex(0);
        setShowMeaning(false);
        setCurrentRound(prev => prev + 1);
      } else {
        // 全部完成
        setIsCompleted(true);
      }
    }
  };

  const resetLearning = () => {
    setIsStarted(false);
    setCurrentIndex(0);
    setShowMeaning(false);
    setUnknownWords([]);
    setReviewRounds([]);
    setCurrentRound(0);
    setIsCompleted(false);
  };

  if (!isStarted) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">速记单词</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                单词数量
              </label>
              <input
                type="number"
                min="1"
                max={words.length}
                value={wordCount}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 1;
                  if (value >= 1 && value <= words.length) {
                    setWordCount(value);
                  }
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-sm text-gray-500 mt-1">
                可用单词数量：{words.length}，可输入 1-{words.length} 之间的数字
              </p>
            </div>

            <button
              onClick={startLearning}
              className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              开始学习
            </button>

            <button
              onClick={onBack}
              className="w-full bg-gray-500 text-white py-3 px-6 rounded-lg hover:bg-gray-600 transition-colors font-medium"
            >
              返回
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">学习完成！</h2>
          <p className="text-gray-600 mb-6">
            恭喜您完成了所有单词的学习！
          </p>
          <div className="space-y-3">
            <button
              onClick={resetLearning}
              className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              重新学习
            </button>
            <button
              onClick={onBack}
              className="w-full bg-gray-500 text-white py-3 px-6 rounded-lg hover:bg-gray-600 transition-colors font-medium"
            >
              返回主页
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentWord = selectedWords[currentIndex];

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            {currentRound === 0 ? '速记单词' : `第${currentRound}轮复习`}
          </h2>
          <div className="text-sm text-gray-500">
            {currentIndex + 1} / {selectedWords.length}
          </div>
        </div>

        <div className="space-y-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-800 mb-8">
              {currentWord.word}
            </div>

            {showMeaning && (
              <div className="text-xl text-gray-600 bg-gray-50 p-4 rounded-lg">
                {currentWord.meaning}
              </div>
            )}
          </div>

          {!showMeaning ? (
            <div className="flex space-x-4">
              <button
                onClick={handleKnow}
                className="flex-1 bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600 transition-colors font-medium flex items-center justify-center space-x-2"
              >
                <Check className="w-5 h-5" />
                <span>认识</span>
              </button>
              <button
                onClick={handleUnknown}
                className="flex-1 bg-red-500 text-white py-3 px-6 rounded-lg hover:bg-red-600 transition-colors font-medium flex items-center justify-center space-x-2"
              >
                <X className="w-5 h-5" />
                <span>不认识</span>
              </button>
            </div>
          ) : (
           <div className="flex space-x-4">
             <button
               onClick={handleContinue}
               className="flex-1 bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600 transition-colors font-medium flex items-center justify-center space-x-2"
             >
               <Check className="w-5 h-5" />
               <span>继续</span>
             </button>
             <button
               onClick={handleMemorized}
               className="flex-1 bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors font-medium flex items-center justify-center space-x-2"
             >
               <BookOpen className="w-5 h-5" />
               <span>熟记</span>
             </button>
           </div>
         )}
        </div>

        <div className="mt-6 pt-6 border-t">
          <button
            onClick={resetLearning}
            className="w-full bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center space-x-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>重新开始</span>
          </button>
        </div>
      </div>
    </div>
  );
}