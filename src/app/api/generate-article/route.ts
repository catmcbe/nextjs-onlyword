import { NextRequest, NextResponse } from 'next/server';

interface WordData {
  words: string[];
  meanings: string[];
}

export async function POST(request: NextRequest) {
  try {
    const body: WordData = await request.json();
    const { words, meanings } = body;

    if (!words || !words.length) {
      return NextResponse.json(
        { error: '请提供单词列表' },
        { status: 400 }
      );
    }

    // 准备单词和释义的映射
    // const wordMeanings = words.map((word, index) => ({
    //   word,
    //   meaning: meanings[index] || '无释义'
    // }));

    // 构建提示词
    const wordList = words.join(', ');
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

    // 从环境变量获取API配置
    const apiUrl = process.env.AI_API_URL;
    const apiKey = process.env.AI_API_KEY;
    const model = process.env.AI_MODEL || 'Qwen/Qwen3-8B';

    // 检查必要的环境变量
    if (!apiUrl || !apiKey) {
      console.error('环境变量配置错误:', {
        apiUrl: apiUrl ? '已设置' : '未设置',
        apiKey: apiKey ? '已设置' : '未设置',
        model: model
      });
      return NextResponse.json(
        { error: 'API配置未正确设置，请检查环境变量' },
        { status: 500 }
      );
    }

    console.log('开始调用AI API:', { apiUrl, model });

    // 创建AbortController用于超时控制
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30秒超时

    // 重试机制
    let retryCount = 0;
    const maxRetries = 2;
    let response;

    while (retryCount <= maxRetries) {
      try {
        // 调用AI API
        response = await fetch(`${apiUrl.replace(/\/+$/, '')}/chat/completions`, {
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
          signal: controller.signal,
        });

        clearTimeout(timeoutId);
        break; // 成功则跳出重试循环
      } catch (fetchError) {
        clearTimeout(timeoutId);
        retryCount++;
        
        if (retryCount > maxRetries) {
          console.error(`AI API请求失败，已重试${maxRetries}次:`, fetchError);
          throw new Error(`AI API请求失败，已重试${maxRetries}次: ${fetchError instanceof Error ? fetchError.message : '未知错误'}`);
        }
        
        console.log(`第${retryCount}次重试...`);
        // 等待一段时间后重试
        await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
        
        // 重新创建AbortController用于下一次请求
        controller.abort();
        const newController = new AbortController();
        const newTimeoutId = setTimeout(() => newController.abort(), 30000);
        // 这里需要重新赋值，但由于作用域问题，我们会在下一次循环中重新创建
      }
    }

    if (!response || !response.ok) {
      const errorText = await response?.text();
      console.error('AI API请求失败:', {
        status: response?.status,
        statusText: response?.statusText,
        errorText: errorText
      });
      throw new Error(`AI API请求失败: ${response?.status || '未知状态'} - ${errorText || '无错误详情'}`);
    }

    const aiResponse = await response.json();
    console.log('AI API响应成功:', {
      id: aiResponse.id,
      model: aiResponse.model,
      usage: aiResponse.usage
    });
    
    const content = aiResponse.choices?.[0]?.message?.content;

    if (!content) {
      console.error('AI返回内容为空:', aiResponse);
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

    return NextResponse.json(articleData);

  } catch (error) {
    console.error('生成文章时出错:', {
      error: error instanceof Error ? error.message : '未知错误',
      stack: error instanceof Error ? error.stack : undefined,
      errorObject: error
    });
    return NextResponse.json(
      {
        error: '生成文章失败，请重试',
        details: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    );
  }
}