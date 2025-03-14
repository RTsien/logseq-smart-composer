// 从 Logseq 获取上下文
export const getContext = async (refs) => {
  const context = []
  
  for (const ref of refs) {
    try {
      // 尝试获取页面
      const page = await logseq.Editor.getPage(ref)
      if (page) {
        // 获取页面内容
        const blocks = await logseq.Editor.getPageBlocksTree(page.name)
        const content = blocksToMarkdown(blocks)
        
        context.push({
          title: page.name,
          content,
          type: 'page'
        })
        continue
      }
      
      // 尝试获取块
      const block = await logseq.Editor.getBlock(ref)
      if (block) {
        context.push({
          title: `Block ${ref}`,
          content: block.content,
          type: 'block'
        })
      }
    } catch (error) {
      console.error(`Error getting context for ${ref}:`, error)
    }
  }
  
  return context
}

// 将块树转换为 Markdown
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

// 处理网站链接
export const getWebsiteContent = async (url) => {
  try {
    const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`)
    const data = await response.json()
    
    // 简单的 HTML 到文本转换
    const parser = new DOMParser()
    const doc = parser.parseFromString(data.contents, 'text/html')
    
    // 提取标题和正文内容
    const title = doc.querySelector('title')?.textContent || url
    const content = doc.body.textContent.replace(/\s+/g, ' ').trim()
    
    return {
      title,
      content: content.substring(0, 5000), // 限制内容长度
      type: 'website'
    }
  } catch (error) {
    console.error(`Error fetching website content for ${url}:`, error)
    return {
      title: url,
      content: '无法获取网站内容',
      type: 'website'
    }
  }
}

// 处理 YouTube 链接
export const getYoutubeTranscript = async (url) => {
  // 实现 YouTube 字幕获取
  // 这需要一个单独的服务或 API
  // 简化版本可以使用第三方 API
  
  return {
    title: `YouTube: ${url}`,
    content: '无法获取 YouTube 字幕',
    type: 'youtube'
  }
} 