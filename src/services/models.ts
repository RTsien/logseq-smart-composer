// 模型服务
import { getSettings } from './storage'

// 支持的模型提供商
export const PROVIDERS = {
  OPENAI: 'openai',
  ANTHROPIC: 'anthropic',
  GOOGLE: 'google',
  GROQ: 'groq',
  OLLAMA: 'ollama'
}

// 模型配置
export const MODEL_CONFIGS = {
  [PROVIDERS.OPENAI]: [
    { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo' },
    { id: 'gpt-4', name: 'GPT-4' },
    { id: 'gpt-4-turbo', name: 'GPT-4 Turbo' }
  ],
  [PROVIDERS.ANTHROPIC]: [
    { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus' },
    { id: 'claude-3-sonnet-20240229', name: 'Claude 3 Sonnet' },
    { id: 'claude-3-haiku-20240307', name: 'Claude 3 Haiku' }
  ],
  [PROVIDERS.GOOGLE]: [
    { id: 'gemini-pro', name: 'Gemini Pro' },
    { id: 'gemini-ultra', name: 'Gemini Ultra' }
  ],
  [PROVIDERS.GROQ]: [
    { id: 'llama2-70b-4096', name: 'Llama 2 70B' },
    { id: 'mixtral-8x7b-32768', name: 'Mixtral 8x7B' }
  ]
}

// 设置模型
export const setup = async () => {
  const settings = await getSettings()
  
  // 检查是否有 API 密钥
  if (!settings.apiKey && settings.provider !== PROVIDERS.OLLAMA) {
    console.warn('未设置 API 密钥，请在设置中配置')
  }
  
  // 检查 Ollama 连接
  if (settings.provider === PROVIDERS.OLLAMA) {
    try {
      const response = await fetch(`${settings.ollamaUrl}/api/tags`)
      if (!response.ok) {
        console.warn('无法连接到 Ollama 服务')
      } else {
        console.log('成功连接到 Ollama 服务')
      }
    } catch (error) {
      console.error('Ollama 连接错误:', error)
    }
  }
}

// 获取当前模型信息
export const getCurrentModel = async () => {
  const settings = await getSettings()
  
  if (settings.provider === PROVIDERS.OLLAMA) {
    return {
      provider: PROVIDERS.OLLAMA,
      model: settings.ollamaModel,
      name: settings.ollamaModel
    }
  }
  
  const models = MODEL_CONFIGS[settings.provider] || []
  const model = models.find(m => m.id === settings.model) || models[0] || { id: '', name: '未知模型' }
  
  return {
    provider: settings.provider,
    model: model.id,
    name: model.name
  }
} 