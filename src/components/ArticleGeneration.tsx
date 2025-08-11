'use client';

import { useState } from 'react';
import { FileText, Loader2, RotateCcw } from 'lucide-react';

interface Word {
  word: string;
  meaning: string;
}

interface ArticleGenerationProps {
  words: Word[];
  onBack: () => void;
}

interface ArticleData {
  article: string;
  translation: string;
}

export default function ArticleGeneration({ words, onBack }: ArticleGenerationProps) {
  const [wordCount, setWordCount] = useState(10);
  const [selectedWords, setSelectedWords] = useState<Word[]>([]);
  const [article, setArticle] = useState<ArticleData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [highlightedWord, setHighlightedWord] = useState<string | null>(null);

  const generateArticle = async () => {
    if (words.length === 0) {
      alert('请先上传单词文件');
      return;
    }
    
    if (wordCount > words.length) {
      alert(`单词数量不能超过${words.length}个`);
      return;
    }

    const shuffled = [...words].sort(() => Math.random() - 0.5);
    const wordsForArticle = shuffled.slice(0, wordCount);
    setSelectedWords(wordsForArticle);
    setIsStarted(true);
    setIsGenerating(true);

    try {
      const response = await fetch('/api/generate-article', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          words: wordsForArticle.map(w => w.word),
          meanings: wordsForArticle.map(w => w.meaning)
        }),
      });

      if (!response.ok) {
        throw new Error('生成文章失败');
      }

      const data = await response.json();
      setArticle(data);
    } catch (error) {
      console.error('生成文章时出错:', error);
      alert('生成文章失败，请重试');
    } finally {
      setIsGenerating(false);
    }
  };

  const resetGeneration = () => {
    setIsStarted(false);
    setArticle(null);
    setSelectedWords([]);
    setHighlightedWord(null);
  };

  const renderArticleWithHighlights = (text: string) => {
    if (!selectedWords.length) return { __html: text };

    let highlightedText = text;
    
    selectedWords.forEach(wordObj => {
      const word = wordObj.word;
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      highlightedText = highlightedText.replace(regex, (match) => {
        const isHighlighted = highlightedWord === word;
        return `<span class="relative inline-block cursor-pointer border-b-2 border-blue-400 hover:border-blue-600 transition-colors ${isHighlighted ? 'bg-blue-100 px-1 rounded' : ''}" data-word="${word}" onclick="handleWordClick('${word}')">${match}</span>`;
      });
    });

    return { __html: highlightedText };
  };

  const handleWordClick = (word: string) => {
    setHighlightedWord(highlightedWord === word ? null : word);
  };

  // 将函数添加到全局作用域，供HTML中的onclick使用
  if (typeof window !== 'undefined') {
    (window as unknown as { handleWordClick: typeof handleWordClick }).handleWordClick = handleWordClick;
  }

  if (!isStarted) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">生成短文</h2>
          
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
                onChange={(e) => setWordCount(parseInt(e.target.value) || 1)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-sm text-gray-500 mt-1">
                可用单词数量：{words.length}
              </p>
            </div>

            <button
              onClick={generateArticle}
              className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              生成文章
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

  if (isGenerating) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">正在生成文章...</h2>
          <p className="text-gray-600">请稍候，AI正在为您创作包含指定单词的文章</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">生成失败</h2>
          <p className="text-gray-600 mb-6">文章生成失败，请重试</p>
          <div className="space-y-3">
            <button
              onClick={generateArticle}
              className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              重试
            </button>
            <button
              onClick={resetGeneration}
              className="w-full bg-gray-500 text-white py-3 px-6 rounded-lg hover:bg-gray-600 transition-colors font-medium"
            >
              返回
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">生成的文章</h2>
          <button
            onClick={resetGeneration}
            className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors flex items-center space-x-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>重新生成</span>
          </button>
        </div>

        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              英文文章
            </h3>
            <div
              className="prose prose-lg max-w-none p-6 bg-gray-50 rounded-lg leading-relaxed text-gray-800"
              dangerouslySetInnerHTML={renderArticleWithHighlights(article.article) as { __html: string }}
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">中文翻译</h3>
            <div className="prose prose-lg max-w-none p-6 bg-gray-50 rounded-lg leading-relaxed text-gray-800">
              {article.translation}
            </div>
          </div>

          {highlightedWord && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">单词释义</h4>
              <p className="text-blue-700">
                {selectedWords.find(w => w.word.toLowerCase() === highlightedWord.toLowerCase())?.meaning || '未找到释义'}
              </p>
            </div>
          )}

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-800 mb-2">使用提示</h4>
            <p className="text-yellow-700 text-sm">
              点击文章中的蓝色下划线单词可以查看释义。再次点击可以取消高亮显示。
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t">
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