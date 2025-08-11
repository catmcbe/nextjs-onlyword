'use client';

import { useState, useEffect, useRef } from 'react';
import { Check, X, RotateCcw, SkipForward } from 'lucide-react';

interface Word {
  word: string;
  meaning: string;
}

interface PracticeWordsProps {
  words: Word[];
  onBack: () => void;
}

export default function PracticeWords({ words, onBack }: PracticeWordsProps) {
  const [wordCount, setWordCount] = useState('');
  const [selectedWords, setSelectedWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [wrongWords, setWrongWords] = useState<Word[]>([]);
  const [reviewRounds, setReviewRounds] = useState<Word[][]>([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const startPractice = () => {
    if (words.length === 0) {
      alert('请先上传单词文件');
      return;
    }
    
    const count = parseInt(wordCount as string) || 10;
    if (count > words.length) {
      alert(`单词数量不能超过${words.length}个`);
      return;
    }

    const shuffled = [...words].sort(() => Math.random() - 0.5);
    setSelectedWords(shuffled.slice(0, count));
    setIsStarted(true);
    setCurrentIndex(0);
    setUserInput('');
    setShowResult(false);
    setWrongWords([]);
    setReviewRounds([]);
    setCurrentRound(0);
    setIsCompleted(false);
  };

  const checkAnswer = () => {
    const currentWord = selectedWords[currentIndex];
    const correct = userInput.trim().toLowerCase() === currentWord.word.toLowerCase();
    setIsCorrect(correct);
    setShowResult(true);

    if (!correct) {
      setWrongWords(prev => [...prev, currentWord]);
    }
  };

  const handleNext = () => {
    if (currentIndex < selectedWords.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setUserInput('');
      setShowResult(false);
    } else {
      // 当前轮次完成
      if (wrongWords.length > 0) {
        // 开始复习
        setReviewRounds(prev => [...prev, wrongWords]);
        setSelectedWords(wrongWords);
        setWrongWords([]);
        setCurrentIndex(0);
        setUserInput('');
        setShowResult(false);
        setCurrentRound(prev => prev + 1);
      } else {
        // 全部完成
        setIsCompleted(true);
      }
    }
  };

  const handleSkip = () => {
    if (currentIndex < selectedWords.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setUserInput('');
      setShowResult(false);
    } else {
      // 当前轮次完成
      if (wrongWords.length > 0) {
        // 开始复习
        setReviewRounds(prev => [...prev, wrongWords]);
        setSelectedWords(wrongWords);
        setWrongWords([]);
        setCurrentIndex(0);
        setUserInput('');
        setShowResult(false);
        setCurrentRound(prev => prev + 1);
      } else {
        // 全部完成
        setIsCompleted(true);
      }
    }
  };

  const resetPractice = () => {
    setIsStarted(false);
    setCurrentIndex(0);
    setUserInput('');
    setShowResult(false);
    setWrongWords([]);
    setReviewRounds([]);
    setCurrentRound(0);
    setIsCompleted(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !showResult) {
      checkAnswer();
    } else if (e.key === 'Enter' && showResult) {
      handleNext();
    }
  };

  useEffect(() => {
    if (isStarted && !showResult && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isStarted, showResult, currentIndex]);

  if (!isStarted) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">刷单词</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                单词数量
              </label>
              <input
                type="number"
                min="1"
                value={wordCount}
                onChange={(e) => setWordCount(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-sm text-gray-500 mt-1">
                可用单词数量：{words.length}，建议不超过可用数量
              </p>
            </div>

            <button
              onClick={startPractice}
              className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              开始练习
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
          <h2 className="text-2xl font-bold text-gray-800 mb-4">练习完成！</h2>
          <p className="text-gray-600 mb-6">
            恭喜您完成了所有单词的练习！
          </p>
          <div className="space-y-3">
            <button
              onClick={resetPractice}
              className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              重新练习
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
            {currentRound === 0 ? '刷单词' : `第${currentRound}轮复习`}
          </h2>
          <div className="text-sm text-gray-500">
            {currentIndex + 1} / {selectedWords.length}
          </div>
        </div>

        <div className="space-y-8">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800 mb-8">
              {currentWord.meaning}
            </div>

            {!showResult ? (
              <div className="space-y-4">
                <input
                  ref={inputRef}
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="请输入英文单词"
                  className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center"
                />
                <button
                  onClick={checkAnswer}
                  className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors font-medium"
                >
                  完成
                </button>
              </div>
            ) : (
             <div className="space-y-4">
               <div className={`text-xl font-bold p-4 rounded-lg ${
                 isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
               }`}>
                 {isCorrect ? '正确！' : `错误！正确答案是：${currentWord.word}`}
               </div>
               <div className="flex space-x-4">
                 <button
                   onClick={handleNext}
                   className="flex-1 bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600 transition-colors font-medium"
                 >
                   下一个
                 </button>
                 <button
                   onClick={handleSkip}
                   className="flex-1 bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors font-medium flex items-center justify-center space-x-2"
                 >
                   <BookOpen className="w-5 h-5" />
                   <span>熟记</span>
                 </button>
               </div>
             </div>
           )}
          </div>
        </div>

        <div className="mt-6 pt-6 border-t">
          <button
            onClick={resetPractice}
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