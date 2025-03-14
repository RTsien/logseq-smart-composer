# Logseq Smart Composer

一个为 Logseq 打造的智能写作助手插件。灵感来源于 [obsidian-smart-composer](https://github.com/glowingjade/obsidian-smart-composer)。

## 简介

在使用 Logseq 进行写作时，我们经常需要查阅已有笔记作为上下文。为什么要在每次询问 AI 时都重复输入已经存在于知识库中的背景信息呢？

logseq-smart-composer 通过智能引用你的知识库内容，帮助你更高效地写作。这个插件将笔记编写和 AI 辅助创作完美地统一在 Logseq 中。

## 功能

- **上下文感知聊天**
  - 通过 `@<文件名>` 选择特定页面作为对话上下文
  - 支持多媒体上下文（网站链接、图片、YouTube 视频）

- **应用编辑**
  - AI 建议文档编辑
  - 一键应用建议的更改

- **知识库搜索 (RAG)**
  - 自动查找并使用知识库中的相关笔记增强 AI 响应
  - 语义搜索功能

- **其他功能**
  - 自定义模型选择（支持多种 API 提供商）
  - 本地模型支持（通过 Ollama）
  - 自定义系统提示
  - 提示模板

## 安装

1. 在 Logseq 中，进入插件市场
2. 搜索 "Smart Composer"
3. 点击安装

或者手动安装：

1. 下载最新的发布版本
2. 解压文件
3. 在 Logseq 中，进入设置 > 插件 > 加载未上架的插件
4. 选择解压后的文件夹

## 使用方法

### 基本使用

- 使用斜杠命令 `/smart-composer` 打开聊天界面
- 在任何块上右键点击，选择 "Ask Smart Composer" 将该块内容作为上下文

### 上下文引用

在消息中使用 `@` 符号引用页面或块：

## 开发路线

计划开发的功能包括：
- 支持外部文件（PDF、DOCX 等）
- 通过标签或其他元数据进行内容引用
- 更多模型的支持

## 反馈与支持

- **Bug 报告**: 如遇到问题，请在 GitHub Issues 页面提交详细的问题描述
- **功能建议**: 欢迎在 GitHub Discussions 中提出新的功能想法
- **使用展示**: 欢迎分享你使用本插件的独特方式和工作流程

## 参与贡献

我们欢迎各种形式的贡献，包括但不限于：
- Bug 修复
- 文档改进
- 功能增强

重大功能更新请先创建 Issue 讨论可行性和实现方案。

## 致谢

本项目受到 [obsidian-smart-composer](https://github.com/glowingjade/obsidian-smart-composer) 的启发。感谢该项目的创意和实现。

## 开源协议

MIT
