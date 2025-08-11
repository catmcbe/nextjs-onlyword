# 单词学习软件

一个功能完整的单词学习应用，支持速记单词、刷单词和AI生成短文三种学习模式。

## 功能特点

### 🔐 登录功能
- 管理员登录系统
- 安全的身份验证
- 登录状态管理
- 支持登出功能

**登录凭据：**
- 用户名：adminfishcat9898
- 密码：xx1465120

### 🎯 三种学习模式

1. **速记单词**
   - 随机抽取指定数量的单词
   - 显示英文，用户选择"认识"或"不认识"
   - 显示中文释义，点击"熟记"完成学习
   - 智能复习系统：不认识的单词会进入下一轮复习

2. **刷单词**
   - 随机抽取指定数量的单词
   - 显示中文释义，用户填写对应的英文单词
   - 实时检查答案正确性
   - 智能复习系统：错误的单词会进入下一轮复习

3. **短文生成**
   - 使用AI生成包含指定单词的英文短文
   - 提供中文翻译
   - 单词高亮显示，点击可查看释义
   - 支持单词划线和释义展示

### 📱 移动端优化
- 完美适配9:16移动端比例
- 响应式设计，支持各种屏幕尺寸
- 触摸友好的交互设计

### 🎨 界面设计
- 现代化的UI设计
- 流畅的动画效果
- 直观的用户体验
- 支持深色模式

## 技术栈

- **前端框架**: Next.js 15 (App Router)
- **开发语言**: TypeScript
- **样式框架**: Tailwind CSS
- **图标库**: Lucide React
- **AI集成**: OpenAI兼容API

## 安装和运行

### 环境要求
- Node.js 18+ 
- npm 或 yarn

### 安装步骤

1. 克隆项目
```bash
git clone <repository-url>
cd njs
```

2. 安装依赖
```bash
npm install
```

3. 启动开发服务器
```bash
npm run dev
```

4. 打开浏览器访问
```
http://localhost:3000
```

### 构建生产版本
```bash
npm run build
npm start
```

## 使用说明

### 1. 准备单词文件
创建一个txt文件，格式如下：
```
单词 释义
apple n.苹果
banana n.香蕉
computer n.电脑
```

**注意：**
- 每行一个单词
- 单词和释义之间用空格分隔
- 支持中文释义

### 2. 上传单词文件
- 在主页面点击或拖拽上传txt文件
- 系统会自动解析文件内容
- 上传成功后选择学习模式

### 3. 选择学习模式

#### 速记单词模式
1. 设置要学习的单词数量
2. 点击"开始学习"
3. 查看英文单词，选择"认识"或"不认识"
4. 查看中文释义，点击"熟记"完成当前单词
5. 不认识的单词会自动进入复习轮次

#### 刷单词模式
1. 设置要练习的单词数量
2. 点击"开始练习"
3. 查看中文释义，输入对应的英文单词
4. 点击"完成"或按Enter键检查答案
5. 错误的单词会自动进入复习轮次

#### 短文生成模式
1. 设置要包含的单词数量
2. 点击"生成文章"
3. AI会生成包含指定单词的英文短文
4. 查看文章和中文翻译
5. 点击文章中的划线单词可查看释义

## 环境变量配置

### 本地开发
1. 复制环境变量示例文件：
```bash
cp .env.example .env.local
```

2. 在`.env.local`文件中配置环境变量：
```env
# AI API 配置
AI_API_URL=https://api.siliconflow.cn/v1
AI_API_KEY=your_api_key_here
AI_MODEL=Qwen/Qwen3-8B
```

### Vercel 部署
1. 在 Vercel 项目设置中添加环境变量：
   - `AI_API_URL`: AI API 地址
   - `AI_API_KEY`: AI API 密钥
   - `AI_MODEL`: AI 模型名称

2. 环境变量配置示例：
   ```
   AI_API_URL = https://api.siliconflow.cn/v1
   AI_API_KEY = sk-
   AI_MODEL = Qwen/Qwen3-8B
   ```

### 自定义API
项目支持任何OpenAI兼容的API接口。系统会自动读取环境变量中的配置，无需修改代码。

## 部署指南

### Vercel 部署
1. **推送代码到GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **连接Vercel**
   - 登录 Vercel (vercel.com)
   - 点击 "New Project"
   - 选择您的 GitHub 仓库
   - 点击 "Import"

3. **配置环境变量**
   - 在项目设置中找到 "Environment Variables"
   - 添加上述环境变量
   - 确保所有环境变量都正确配置

4. **部署**
   - Vercel 会自动检测 Next.js 项目
   - 点击 "Deploy" 开始部署
   - 部署完成后，您会得到一个访问链接

### 其他平台部署
项目是标准的 Next.js 应用，可以部署到任何支持 Node.js 的平台：

- **Netlify**: 支持 Next.js
- **Railway**: 全栈应用部署
- **Heroku**: Node.js 应用部署
- **自建服务器**: 使用 `npm run build` 和 `npm start`

## 安全说明

### 登录安全
- 当前使用硬编码的登录凭据
- 生产环境建议使用更安全的认证方式
- 可以集成 JWT、OAuth 等认证系统

### API 安全
- API 密钥通过环境变量管理
- 建议定期更换 API 密钥
- 监控 API 使用量和费用
=======
## 环境变量配置

### 本地开发
1. 复制环境变量示例文件：
```bash
cp .env.example .env.local
```

2. 在`.env.local`文件中配置环境变量：
```env
# AI API 配置
AI_API_URL=https://api.siliconflow.cn/v1
AI_API_KEY=your_api_key_here
AI_MODEL=Qwen/Qwen3-8B
```

### Vercel 部署
1. 在 Vercel 项目设置中添加环境变量：
   - `AI_API_URL`: AI API 地址
   - `AI_API_KEY`: AI API 密钥
   - `AI_MODEL`: AI 模型名称

2. 环境变量配置示例：
   ```
   AI_API_URL = https://api.siliconflow.cn/v1
   AI_API_KEY = sk-cfphdryhsemmjylqzrertjgdcvkymukqkkngiurwmapovzqp
   AI_MODEL = Qwen/Qwen3-8B
   ```

### 自定义API
项目支持任何OpenAI兼容的API接口。系统会自动读取环境变量中的配置，无需修改代码。

## 部署指南

### Vercel 部署
1. **推送代码到GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **连接Vercel**
   - 登录 Vercel (vercel.com)
   - 点击 "New Project"
   - 选择您的 GitHub 仓库
   - 点击 "Import"

3. **配置环境变量**
   - 在项目设置中找到 "Environment Variables"
   - 添加上述环境变量
   - 确保所有环境变量都正确配置

4. **部署**
   - Vercel 会自动检测 Next.js 项目
   - 点击 "Deploy" 开始部署
   - 部署完成后，您会得到一个访问链接

### 其他平台部署
项目是标准的 Next.js 应用，可以部署到任何支持 Node.js 的平台：

- **Netlify**: 支持 Next.js
- **Railway**: 全栈应用部署
- **Heroku**: Node.js 应用部署
- **自建服务器**: 使用 `npm run build` 和 `npm start`

## 安全说明

### 登录安全
- 当前使用硬编码的登录凭据
- 生产环境建议使用更安全的认证方式
- 可以集成 JWT、OAuth 等认证系统

### API 安全
- API 密钥通过环境变量管理
- 建议定期更换 API 密钥
- 监控 API 使用量和费用

## 项目结构

```
src/
├── app/
│   ├── api/
│   │   └── generate-article/
│   │       └── route.ts          # AI文章生成API
│   ├── globals.css               # 全局样式
│   ├── layout.tsx               # 根布局
│   └── page.tsx                 # 主页面
├── components/
│   ├── Navigation.tsx           # 导航栏组件
│   ├── FileUpload.tsx           # 文件上传组件
│   ├── MemorizeWords.tsx        # 速记单词组件
│   ├── PracticeWords.tsx        # 刷单词组件
│   └── ArticleGeneration.tsx    # 短文生成组件
└── public/
    └── sample-words.txt         # 示例单词文件
```

## 功能特性

### 智能复习系统
- 自动识别不熟悉/错误的单词
- 多轮复习机制，直到完全掌握
- 学习进度实时跟踪

### 文件处理
- 支持拖拽上传
- 自动解析txt文件格式
- 错误处理和用户提示

### AI集成
- 智能生成包含指定单词的文章
- 提供准确的中文翻译
- 单词高亮和释义展示

### 响应式设计
- 移动端优先的设计理念
- 完美适配9:16屏幕比例
- 流畅的触摸交互体验

## 浏览器兼容性

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 开发说明

### 添加新功能
1. 在`src/components/`目录下创建新组件
2. 在`src/app/page.tsx`中集成新组件
3. 更新导航栏（如需要）

### 样式定制
- 修改`src/app/globals.css`中的全局样式
- 使用Tailwind CSS类名进行样式调整
- 遵循现有的设计系统

### 性能优化
- 使用React.memo优化组件渲染
- 合理使用useCallback和useMemo
- 优化图片和静态资源

## 常见问题

### Q: 支持哪些文件格式？
A: 目前仅支持txt格式，每行一个单词，格式为"单词 释义"。

### Q: AI生成文章失败怎么办？
A: 请检查网络连接和API配置，确保API密钥正确且有足够的配额。

### Q: 如何添加更多单词？
A: 编辑或创建新的txt文件，按照指定格式添加单词，然后上传使用。

### Q: 移动端体验如何优化？
A: 项目已经针对移动端进行了优化，包括触摸交互、响应式布局等。

## 许可证

MIT License

## 贡献

欢迎提交Issue和Pull Request来改进这个项目。

## 联系方式

如有问题或建议，请通过以下方式联系：
- GitHub Issues
- Email: [your-email@example.com]

---

**祝您学习愉快！** 🎉
