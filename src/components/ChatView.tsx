import React, { useState, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import { sendMessage } from '../services/api'
import { searchKnowledgeBase } from '../services/search'
import { getContext } from '../services/context'

const ChatView = () => {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedContext, setSelectedContext] = useState([])
  const messagesEndRef = useRef(null)
  
  // 滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }
  
  useEffect(() => {
    scrollToBottom()
  }, [messages])
  
  // 处理消息发送
  const handleSendMessage = async () => {
    if (!input.trim()) return
    
    setIsLoading(true)
    
    // 添加用户消息
    const userMessage = { role: 'user', content: input }
    setMessages([...messages, userMessage])
    setInput('')
    
    try {
      // 检查是否包含 @引用
      const contextRefs = input.match(/@(\w+)/g)
      let context = []
      
      if (contextRefs) {
        // 获取引用的上下文
        context = await getContext(contextRefs.map(ref => ref.substring(1)))
      }
      
      // 发送消息到 API
      const response = await sendMessage(input, [...selectedContext, ...context])
      
      // 添加 AI 回复
      setMessages(prev => [...prev, { role: 'assistant', content: response.content }])
    } catch (error) {
      console.error('Error sending message:', error)
      // 添加错误消息
      setMessages(prev => [...prev, { role: 'system', content: '发送消息时出错，请重试。' }])
    } finally {
      setIsLoading(false)
    }
  }
  
  // 处理 RAG 搜索
  const handleRAGSearch = async () => {
    if (!input.trim()) return
    
    setIsLoading(true)
    
    try {
      // 搜索知识库
      const searchResults = await searchKnowledgeBase(input)
      
      // 设置搜索结果为上下文
      setSelectedContext(searchResults)
      
      // 发送消息
      await handleSendMessage()
    } catch (error) {
      console.error('Error performing RAG search:', error)
      setMessages(prev => [...prev, { role: 'system', content: '执行知识库搜索时出错，请重试。' }])
      setIsLoading(false)
    }
  }
  
  // 处理应用编辑
  const handleApplyEdit = async (edit) => {
    try {
      // 获取当前块
      const currentBlock = await logseq.Editor.getCurrentBlock()
      if (!currentBlock) return
      
      // 应用编辑
      await logseq.Editor.updateBlock(currentBlock.uuid, edit)
    } catch (error) {
      console.error('Error applying edit:', error)
    }
  }
  
  return (
    <div className="smart-composer-chat">
      <div className="messages-container">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.role}`}>
            <div className="message-content">{msg.content}</div>
            {msg.role === 'assistant' && msg.edit && (
              <button onClick={() => handleApplyEdit(msg.edit)}>应用编辑</button>
            )}
          </div>
        ))}
        {isLoading && <div className="loading">AI 正在思考...</div>}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="input-container">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="输入消息，使用 @页面名 引用上下文..."
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleSendMessage()
            }
          }}
        />
        <div className="buttons">
          <button onClick={handleSendMessage} disabled={isLoading}>
            发送
          </button>
          <button onClick={handleRAGSearch} disabled={isLoading}>
            知识库搜索
          </button>
        </div>
      </div>
      
      {selectedContext.length > 0 && (
        <div className="selected-context">
          <h4>已选择的上下文：</h4>
          <ul>
            {selectedContext.map((ctx, index) => (
              <li key={index}>
                {ctx.title}
                <button onClick={() => setSelectedContext(prev => prev.filter((_, i) => i !== index))}>
                  移除
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export const renderChatView = () => {
  const root = document.getElementById('smart-composer-root')
  if (root) {
    ReactDOM.render(<ChatView />, root)
  }
} 