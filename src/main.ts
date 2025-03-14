import '@logseq/libs'
import { setup as setupModel } from './services/models'
import { initializeStorage } from './services/storage'
import { renderChatView } from './components/ChatView'

const main = async () => {
  console.log('Smart Composer plugin loaded')
  
  // 初始化存储
  await initializeStorage()
  
  // 设置模型
  await setupModel()
  
  // 注册命令
  logseq.Editor.registerSlashCommand('smart-composer', async () => {
    // 打开聊天界面
    logseq.showMainUI()
  })
  
  // 注册上下文菜单
  logseq.Editor.registerBlockContextMenuItem('Ask Smart Composer', async (e) => {
    const block = await logseq.Editor.getBlock(e.uuid)
    if (block) {
      // 打开聊天界面并将块内容作为上下文
      logseq.showMainUI({
        blockContent: block.content
      })
    }
  })
  
  // 渲染主界面
  logseq.provideUI({
    key: 'smart-composer',
    path: '#smart-composer',
    template: `<div id="smart-composer-root"></div>`
  })
  
  // 渲染聊天视图
  renderChatView()
}

logseq.ready(main).catch(console.error) 