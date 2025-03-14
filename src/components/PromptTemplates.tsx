import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { getPromptTemplates, savePromptTemplate, deletePromptTemplate } from '../services/storage'

const PromptTemplates = ({ onSelectTemplate }) => {
  const [templates, setTemplates] = useState([])
  const [newTemplate, setNewTemplate] = useState({ name: '', content: '' })
  const [isEditing, setIsEditing] = useState(false)
  
  // 加载模板
  useEffect(() => {
    const loadTemplates = async () => {
      const savedTemplates = await getPromptTemplates()
      setTemplates(savedTemplates)
    }
    
    loadTemplates()
  }, [])
  
  // 处理保存模板
  const handleSaveTemplate = async () => {
    if (!newTemplate.name || !newTemplate.content) return
    
    await savePromptTemplate(newTemplate)
    
    // 重新加载模板
    const savedTemplates = await getPromptTemplates()
    setTemplates(savedTemplates)
    
    // 重置表单
    setNewTemplate({ name: '', content: '' })
    setIsEditing(false)
  }
  
  // 处理删除模板
  const handleDeleteTemplate = async (templateName) => {
    await deletePromptTemplate(templateName)
    
    // 重新加载模板
    const savedTemplates = await getPromptTemplates()
    setTemplates(savedTemplates)
  }
  
  // 处理编辑模板
  const handleEditTemplate = (template) => {
    setNewTemplate({ ...template })
    setIsEditing(true)
  }
  
  return (
    <div className="prompt-templates">
      <h3>提示模板</h3>
      
      <div className="templates-list">
        {templates.length === 0 ? (
          <p>没有保存的模板</p>
        ) : (
          <ul>
            {templates.map((template, index) => (
              <li key={index} className="template-item">
                <div className="template-header">
                  <span className="template-name">{template.name}</span>
                  <div className="template-actions">
                    <button onClick={() => onSelectTemplate(template)}>使用</button>
                    <button onClick={() => handleEditTemplate(template)}>编辑</button>
                    <button onClick={() => handleDeleteTemplate(template.name)}>删除</button>
                  </div>
                </div>
                <div className="template-content">{template.content}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      <div className="template-form">
        <h4>{isEditing ? '编辑模板' : '新建模板'}</h4>
        <div className="form-group">
          <label>名称</label>
          <input
            type="text"
            value={newTemplate.name}
            onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
            placeholder="模板名称"
          />
        </div>
        <div className="form-group">
          <label>内容</label>
          <textarea
            value={newTemplate.content}
            onChange={(e) => setNewTemplate({ ...newTemplate, content: e.target.value })}
            placeholder="模板内容"
            rows={4}
          />
        </div>
        <div className="form-actions">
          <button onClick={handleSaveTemplate}>保存</button>
          {isEditing && (
            <button onClick={() => {
              setNewTemplate({ name: '', content: '' })
              setIsEditing(false)
            }}>
              取消
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export const renderPromptTemplates = (onSelectTemplate) => {
  const root = document.getElementById('smart-composer-templates')
  if (root) {
    ReactDOM.render(<PromptTemplates onSelectTemplate={onSelectTemplate} />, root)
  }
} 