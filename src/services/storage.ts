// 默认设置
const DEFAULT_SETTINGS = {
  provider: 'openai',
  apiKey: '',
  model: 'gpt-3.5-turbo',
  systemPrompt: '你是一个有用的助手。',
  useLocalEmbeddings: false,
  ollamaUrl: 'http://localhost:11434',
  ollamaModel: 'llama2',
  promptTemplates: []
}

// 初始化存储
export const initializeStorage = async () => {
  const existingSettings = await logseq.settings.getItem('smartComposerSettings')
  
  if (!existingSettings) {
    await logseq.settings.setItem('smartComposerSettings', DEFAULT_SETTINGS)
  }
}

// 获取设置
export const getSettings = async () => {
  const settings = await logseq.settings.getItem('smartComposerSettings')
  return { ...DEFAULT_SETTINGS, ...settings }
}

// 保存设置
export const saveSettings = async (settings) => {
  await logseq.settings.setItem('smartComposerSettings', settings)
}

// 获取聊天历史
export const getChatHistory = async () => {
  return await logseq.settings.getItem('smartComposerChatHistory') || []
}

// 保存聊天历史
export const saveChatHistory = async (history) => {
  // 限制历史记录数量
  const limitedHistory = history.slice(-100)
  await logseq.settings.setItem('smartComposerChatHistory', limitedHistory)
}

// 获取提示模板
export const getPromptTemplates = async () => {
  const settings = await getSettings()
  return settings.promptTemplates || []
}

// 保存提示模板
export const savePromptTemplate = async (template) => {
  const settings = await getSettings()
  const templates = settings.promptTemplates || []
  
  // 检查是否已存在相同名称的模板
  const existingIndex = templates.findIndex(t => t.name === template.name)
  
  if (existingIndex >= 0) {
    // 更新现有模板
    templates[existingIndex] = template
  } else {
    // 添加新模板
    templates.push(template)
  }
  
  // 保存更新后的设置
  await saveSettings({
    ...settings,
    promptTemplates: templates
  })
}

// 删除提示模板
export const deletePromptTemplate = async (templateName) => {
  const settings = await getSettings()
  const templates = settings.promptTemplates || []
  
  // 过滤掉要删除的模板
  const updatedTemplates = templates.filter(t => t.name !== templateName)
  
  // 保存更新后的设置
  await saveSettings({
    ...settings,
    promptTemplates: updatedTemplates
  })
} 