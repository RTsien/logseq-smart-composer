import { getSettings } from './storage'

// 支持的模型提供商
const PROVIDERS = {
  OPENAI: 'openai',
  ANTHROPIC: 'anthropic',
  GOOGLE: 'google',
  GROQ: 'groq',
  OLLAMA: 'ollama',
  // 其他提供商...
}

// 发送消息到 API
export const sendMessage = async (message, context = []) => {
  const settings = await getSettings()
  const { provider, apiKey, model } = settings
  
  // 构建消息历史
  const messages = [
    { role: 'system', content: settings.systemPrompt || '你是一个有用的助手。' },
    // 添加上下文
    ...context.map(ctx => ({
      role: 'system',
      content: `上下文: ${ctx.title}\n\n${ctx.content}`
    })),
    { role: 'user', content: message }
  ]
  
  // 根据不同提供商发送请求
  switch (provider) {
    case PROVIDERS.OPENAI:
      return sendOpenAIRequest(apiKey, model, messages)
    case PROVIDERS.ANTHROPIC:
      return sendAnthropicRequest(apiKey, model, messages)
    case PROVIDERS.GOOGLE:
      return sendGoogleRequest(apiKey, model, messages)
    case PROVIDERS.GROQ:
      return sendGroqRequest(apiKey, model, messages)
    case PROVIDERS.OLLAMA:
      return sendOllamaRequest(model, messages)
    default:
      throw new Error(`不支持的提供商: ${provider}`)
  }
}

// OpenAI API 请求
const sendOpenAIRequest = async (apiKey, model, messages) => {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.7
    })
  })
  
  if (!response.ok) {
    throw new Error(`OpenAI API 错误: ${response.statusText}`)
  }
  
  const data = await response.json()
  return {
    content: data.choices[0].message.content,
    // 如果响应包含编辑建议，解析它
    edit: extractEditSuggestion(data.choices[0].message.content)
  }
}

// 从响应中提取编辑建议
const extractEditSuggestion = (content) => {
  // 简单实现：查找 ```edit 和 ``` 之间的内容
  const editMatch = content.match(/```edit\n([\s\S]*?)```/)
  return editMatch ? editMatch[1] : null
}

// 其他 API 提供商的实现...
// sendAnthropicRequest, sendGoogleRequest, sendGroqRequest, sendOllamaRequest 