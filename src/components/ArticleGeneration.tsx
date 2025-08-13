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
      // 直接调用AI API，避免Serverless Function超时
      const apiUrl = process.env.NEXT_PUBLIC_AI_API_URL;
      const apiKey = process.env.NEXT_PUBLIC_AI_API_KEY;
      const model = process.env.NEXT_PUBLIC_AI_MODEL || 'Qwen/Qwen3-8B';

      if (!apiUrl || !apiKey) {
        throw new Error('AI API配置未正确设置');
      }

      // 构建提示词
      const wordList = wordsForArticle.map(w => w.word).join(', ');
      const prompt = `请写一篇包含以下单词的英文短文：${wordList}

要求：
1. 文章长度在200-300字之间
2. 自然流畅地包含所有指定单词
3. 主题可以是日常生活、学习、科技等任何合适的话题
4. 文章要有逻辑性和连贯性

请按照以下JSON格式返回：
{
  "article": "英文文章内容...",
  "translation": "中文翻译..."
}

请确保返回的是有效的JSON格式。`;

      const response = await fetch(`${apiUrl.replace(/\/+$/, '')}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: model,
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 1000,
        }),
      });

      if (!response.ok) {
        throw new Error(`AI API请求失败: ${response.status}`);
      }

      const aiResponse = await response.json();
      const content = aiResponse.choices?.[0]?.message?.content;

      if (!content) {
        throw new Error('AI返回内容为空');
      }

      // 尝试解析JSON响应
      let articleData;
      try {
        // 提取JSON部分（如果AI返回了额外的文本）
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          articleData = JSON.parse(jsonMatch[0]);
        } else {
          // 如果没有找到JSON，尝试解析整个响应
          articleData = JSON.parse(content);
        }
      } catch (parseError) {
        console.error('解析AI响应失败:', parseError);
        // 如果JSON解析失败，尝试从文本中提取文章和翻译
        const articleMatch = content.match(/article["\s]*:["\s]*([\s\S]*?)(?="translation"|$)/i);
        const translationMatch = content.match(/translation["\s]*:["\s]*([\s\S]*?)$/i);
        
        articleData = {
          article: articleMatch ? articleMatch[1].replace(/^["\s]+|["\s]+$/g, '') : content,
          translation: translationMatch ? translationMatch[1].replace(/^["\s]+|["\s]+$/g, '') : '翻译提取失败'
        };
      }

      // 验证返回的数据结构
      if (!articleData.article || !articleData.translation) {
        throw new Error('AI返回的数据格式不正确');
      }

      setArticle(articleData);
    } catch (error) {
      console.error('生成文章时出错:', error);
      alert(error instanceof Error ? error.message : '生成文章失败，请重试');
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
    if (!selectedWords.length) return text;

    const words = text.split(/(\s+|[.,!?;:])/);
    
    return words.map((word, index) => {
      const trimmedWord = word.trim();
      if (!trimmedWord) return word;

      const matchedWordObj = selectedWords.find(w =>
        w.word.toLowerCase() === trimmedWord.toLowerCase()
      );

      if (matchedWordObj) {
        const isHighlighted = highlightedWord === matchedWordObj.word;
        return (
          <span
            key={index}
            className={`relative inline-block cursor-pointer border-b-2 border-blue-400 hover:border-blue-600 transition-colors ${isHighlighted ? 'bg-blue-100 px-1 rounded' : ''}`}
            onClick={() => handleWordClick(matchedWordObj.word)}
          >
            {word}
          </span>
        );
      }

      return word;
    });
  };

  const handleWordClick = (word: string) => {
    setHighlightedWord(highlightedWord === word ? null : word);
  };

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
            <div className="prose prose-lg max-w-none p-6 bg-gray-50 rounded-lg leading-relaxed text-gray-800">
              {renderArticleWithHighlights(article.article)}
            </div>
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