import { getSettings } from './storage'

// 执行知识库搜索
export const searchKnowledgeBase = async (query) => {
  const settings = await getSettings()
  
  // 如果启用了本地嵌入，使用本地搜索
  if (settings.useLocalEmbeddings) {
    return searchWithLocalEmbeddings(query)
  }
  
  // 否则使用 API 搜索
  return searchWithAPI(query, settings)
}

// 使用 API 进行语义搜索
const searchWithAPI = async (query, settings) => {
  try {
    // 获取所有页面
    const pages = await logseq.Editor.getAllPages()
    
    // 获取页面内容
    const pageContents = await Promise.all(
      pages.slice(0, 50).map(async (page) => { // 限制搜索范围
        try {
          const blocks = await logseq.Editor.getPageBlocksTree(page.name)
          const content = blocksToMarkdown(blocks)
          
          return {
            title: page.name,
            content,
            type: 'page'
          }
        } catch (error) {
          console.error(`Error getting content for page ${page.name}:`, error)
          return null
        }
      })
    )
    
    // 过滤掉空内容
    const validContents = pageContents.filter(Boolean)
    
    // 使用 OpenAI 嵌入 API 进行语义搜索
    const embeddings = await getEmbeddings(
      [query, ...validContents.map(p => p.content)],
      settings.apiKey
    )
    
    // 计算相似度
    const queryEmbedding = embeddings[0]
    const contentEmbeddings = embeddings.slice(1)
    
    // 计算余弦相似度并排序
    const similarities = contentEmbeddings.map((embedding, index) => ({
      index,
      similarity: cosineSimilarity(queryEmbedding, embedding)
    }))
    
    similarities.sort((a, b) => b.similarity - a.similarity)
    
    // 返回前 3 个最相关的内容
    return similarities.slice(0, 3).map(sim => validContents[sim.index])
  } catch (error) {
    console.error('Error performing semantic search:', error)
    return []
  }
}

// 使用本地嵌入进行搜索
const searchWithLocalEmbeddings = async (query) => {
  // 这需要与 Ollama 或其他本地嵌入模型集成
  // 简化版本可以使用基于关键词的搜索
  
  try {
    // 获取所有页面
    const pages = await logseq.Editor.getAllPages()
    
    // 简单的关键词匹配
    const matchedPages = await Promise.all(
      pages.map(async (page) => {
        try {
          const blocks = await logseq.Editor.getPageBlocksTree(page.name)
          const content = blocksToMarkdown(blocks)
          
          // 简单的关键词匹配
          const queryTerms = query.toLowerCase().split(/\s+/)
          const matchScore = queryTerms.reduce((score, term) => {
            return score + (
              (page.name.toLowerCase().includes(term) ? 10 : 0) +
              (content.toLowerCase().includes(term) ? 5 : 0)
            )
          }, 0)
          
          return {
            title: page.name,
            content,
            score: matchScore,
            type: 'page'
          }
        } catch (error) {
          console.error(`Error searching page ${page.name}:`, error)
          return null
        }
      })
    )
    
    // 过滤并排序结果
    return matchedPages
      .filter(page => page && page.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
  } catch (error) {
    console.error('Error performing local search:', error)
    return []
  }
}

// 获取嵌入向量
const getEmbeddings = async (texts, apiKey) => {
  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'text-embedding-ada-002',
      input: texts
    })
  })
  
  if (!response.ok) {
    throw new Error(`OpenAI API 错误: ${response.statusText}`)
  }
  
  const data = await response.json()
  return data.data.map(item => item.embedding)
}

// 计算余弦相似度
const cosineSimilarity = (vecA, vecB) => {
  const dotProduct = vecA.reduce((sum, val, i) => sum + val * vecB[i], 0)
  const magA = Math.sqrt(vecA.reduce((sum, val) => sum + val * val, 0))
  const magB = Math.sqrt(vecB.reduce((sum, val) => sum + val * val, 0))
  return dotProduct / (magA * magB)
}

// 将块树转换为 Markdown（与 context.ts 中相同）
const blocksToMarkdown = (blocks, level = 0) => {
  if (!blocks || blocks.length === 0) return ''
  
  return blocks.map(block => {
    const indent = '  '.repeat(level)
    let content = `${indent}- ${block.content}\n`
    
    if (block.children && block.children.length > 0) {
      content += blocksToMarkdown(block.children, level + 1)
    }
    
    return content
  }).join('')
} 