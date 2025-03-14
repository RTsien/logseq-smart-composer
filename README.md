# Logseq Smart Composer

An intelligent writing assistant plugin for Logseq. Inspired by [obsidian-smart-composer](https://github.com/glowingjade/obsidian-smart-composer).

## Introduction

When writing in Logseq, we often need to reference existing notes as context. Why repeatedly input background information that already exists in your knowledge base every time you ask AI for assistance?

Logseq Smart Composer helps you write more efficiently by intelligently referencing your knowledge base content. This plugin perfectly unifies note-taking and AI-assisted content creation within Logseq.

## Features

- **Context-Aware Chat**
  - Select specific pages as conversation context using `@<page name>`
  - Support for multimedia context (website links, images, YouTube videos)

- **Apply Edits**
  - AI-suggested document edits
  - One-click application of suggested changes

- **Knowledge Base Search (RAG)**
  - Automatically find and use relevant notes from your knowledge base to enhance AI responses
  - Semantic search functionality

- **Additional Features**
  - Custom model selection (supports multiple API providers)
  - Local model support (via Ollama)
  - Custom system prompts
  - Prompt templates

## Installation

1. In Logseq, go to the plugin marketplace
2. Search for "Smart Composer"
3. Click install

Or install manually:

1. Download the latest release
2. Extract the files
3. In Logseq, go to Settings > Plugins > Load unpacked plugin
4. Select the extracted folder

## Usage

### Basic Usage

- Use the slash command `/smart-composer` to open the chat interface
- Right-click on any block and select "Ask Smart Composer" to use that block's content as context

### Context References

Use the `@` symbol in your messages to reference pages or blocks:

## Development Roadmap

Features planned for development include:
- Support for external files (PDF, DOCX, etc.)
- Content referencing via tags or other metadata
- More model support

## Feedback and Support

- **Bug Reports**: If you encounter issues, please submit a detailed issue description on the GitHub Issues page
- **Feature Suggestions**: Feel free to propose new features in the GitHub Discussions
- **Usage Showcase**: We welcome sharing unique ways you use this plugin and your workflow

## Contribution

We welcome various forms of contribution, including but not limited to:
- Bug fixes
- Documentation improvements
- Feature enhancements

Major feature updates should be discussed and planned before implementation.

## Acknowledgments

This project was inspired by [obsidian-smart-composer](https://github.com/glowingjade/obsidian-smart-composer). Thank you for the project's creativity and implementation.

## Open Source License

MIT
