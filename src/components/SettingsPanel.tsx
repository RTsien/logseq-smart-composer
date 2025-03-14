import React, { useState, useEffect } from 'react'
import { getSettings, saveSettings } from '../services/storage'

const SettingsPanel = () => {
  const [settings, setSettings] = useState({
    provider: 'openai',
    apiKey: '',
    model: 'gpt-3.5-turbo',
    systemPrompt: '你是一个有用的助手。',
    useLocalEmbeddings: false,
    ollamaUrl: 'http://localhost:11434',
    ollamaModel: 'llama2'
  })
  
  useEffect(() => {
    // 加载设置
    const loadSettings = async () => {
      const savedSettings = await getSettings()
      setSettings(savedSettings)
    }
    
    loadSettings()
  }, [])
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : value
    })
  }
  
  const handleSave = async () => {
    await saveSettings(settings)
    logseq.UI.showMsg('设置已保存')
  }
  
  return (
    <div className="settings-panel">
      <h2>Smart Composer 设置</h2>
      
      <div className="setting-group">
        <label>提供商</label>
        <select name="provider" value={settings.provider} onChange={handleChange}>
          <option value="openai">OpenAI</option>
          <option value="anthropic">Anthropic</option>
          <option value="google">Google (Gemini)</option>
          <option value="groq">Groq</option>
          <option value="ollama">Ollama (本地)</option>
          {/* 其他提供商选项 */}
        </select>
      </div>
      
      {settings.provider !== 'ollama' && (
        <div className="setting-group">
          <label>API 密钥</label>
          <input
            type="password"
            name="apiKey"
            value={settings.apiKey}
            onChange={handleChange}
            placeholder="输入 API 密钥"
          />
        </div>
      )}
      
      <div className="setting-group">
        <label>模型</label>
        {settings.provider === 'openai' && (
          <select name="model" value={settings.model} onChange={handleChange}>
            <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
            <option value="gpt-4">GPT-4</option>
            <option value="gpt-4-turbo">GPT-4 Turbo</option>
          </select>
        )}
        {settings.provider === 'anthropic' && (
          <select name="model" value={settings.model} onChange={handleChange}>
            <option value="claude-3-opus-20240229">Claude 3 Opus</option>
            <option value="claude-3-sonnet-20240229">Claude 3 Sonnet</option>
            <option value="claude-3-haiku-20240307">Claude 3 Haiku</option>
          </select>
        )}
        {/* 其他提供商的模型选项 */}
        {settings.provider === 'ollama' && (
          <input
            type="text"
            name="ollamaModel"
            value={settings.ollamaModel}
            onChange={handleChange}
            placeholder="例如：llama2, mistral, etc."
          />
        )}
      </div>
      
      {settings.provider === 'ollama' && (
        <div className="setting-group">
          <label>Ollama URL</label>
          <input
            type="text"
            name="ollamaUrl"
            value={settings.ollamaUrl}
            onChange={handleChange}
            placeholder="http://localhost:11434"
          />
        </div>
      )}
      
      <div className="setting-group">
        <label>系统提示</label>
        <textarea
          name="systemPrompt"
          value={settings.systemPrompt}
          onChange={handleChange}
          placeholder="输入默认系统提示"
          rows={4}
        />
      </div>
      
      <div className="setting-group">
        <label>
          <input
            type="checkbox"
            name="useLocalEmbeddings"
            checked={settings.useLocalEmbeddings}
            onChange={handleChange}
          />
          使用本地嵌入模型（需要 Ollama）
        </label>
      </div>
      
      <button onClick={handleSave}>保存设置</button>
    </div>
  )
}

export const renderSettingsPanel = () => {
  const root = document.getElementById('smart-composer-settings')
  if (root) {
    ReactDOM.render(<SettingsPanel />, root)
  }
} 