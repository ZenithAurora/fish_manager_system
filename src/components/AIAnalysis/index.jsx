import React, { useState, useEffect, useRef } from 'react';
import { Popup, TextArea, Toast, DotLoading } from 'antd-mobile';
import './index.scss';

const AIAnalysis = ({ visible, onClose, productData, traceData }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const hasInitializedRef = useRef(false);

  const CONFIG = {
    apiKey: 'ms-9a516b33-a8d0-45d3-97fd-90bb0e523207',
    apiUrl: 'https://api-inference.modelscope.cn/v1/chat/completions',
    model: "Qwen/Qwen3-8B"
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (messages.length > 0) scrollToBottom();
  }, [messages]);

  const formatMarkdown = (text) => {
    if (!text) return '';
    return text
      .replace(/### (.*?)\n/g, '<h3 class="md-h3">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/^- (.*?)\n/gm, '<div class="md-li"><span>•</span> $1</div>')
      .replace(/\n/g, '<br/>');
  };

  useEffect(() => {
    if (visible && !hasInitializedRef.current) {
      hasInitializedRef.current = true;
      const prompt = `你是一位食品溯源专家。基于以下数据生成分析报告：
      产品：${JSON.stringify(productData)}
      溯源节点：${JSON.stringify(traceData)}
      要求：使用 Markdown 列表，多用 Emoji，结论直接。`;
      handleSend(prompt, true);
    }
    if (!visible) {
      hasInitializedRef.current = false;
      setMessages([]);
    }
  }, [visible]);

  const handleSend = async (content, isInit = false) => {
    if (!content?.trim() || isTyping) return;

    const userMsgId = Date.now();
    const aiMsgId = Date.now() + 1;

    if (!isInit) {
      setMessages(prev => [...prev, { id: userMsgId, type: 'user', content }]);
      setInputValue('');
    }

    setIsTyping(true);
    setMessages(prev => [...prev, { id: aiMsgId, type: 'ai', content: '', thinking: '', loading: true }]);

    const systemInstruction = `你是一位极度专业的食品溯源分析师。

    你的知识库仅限于：该产品的溯源路径、品质鉴定、营养价值、产地水质及食用建议。

   

    ## 行为准则：

    1. 必须且仅能回答与该鱼类产品溯源、品质、营养、存储或烹饪相关的问题。

    2. 如果用户问到无关话题（如：天气、数学、编程、政治、其他鱼类以外的常识），你必须温和但坚定地拒绝，并引导回本产品的溯源分析。

    3. 拒绝模板例句：“抱歉，作为溯源助手，我仅能为您提供有关本产品的品质分析，请问关于这批鱼的溯源信息您还有什么想了解的吗？”

   

    ## 当前上下文数据：

    产品数据：${JSON.stringify(productData)}

    溯源节点：${JSON.stringify(traceData)}`;

    try {
      const history = messages.map(m => ({
        role: m.type === 'user' ? 'user' : 'assistant',
        content: m.content
      }));

      const response = await fetch(CONFIG.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${CONFIG.apiKey}`
        },
        body: JSON.stringify({
          model: CONFIG.model,
          messages: [
            { role: "system", content: systemInstruction },
            ...history,
            { role: "user", content: content }
          ],
          stream: true,
          extra_body: { "enable_thinking": true }
        })
      });

      if (!response.ok) throw new Error('接口响应异常');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullContent = "";
      let fullThinking = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(l => l.startsWith('data: '));

        for (const line of lines) {
          if (line.includes('[DONE]')) break;
          try {
            const data = JSON.parse(line.substring(6));
            const delta = data.choices[0].delta;

            if (delta.reasoning_content) fullThinking += delta.reasoning_content;
            if (delta.content) fullContent += delta.content;

            // 精准更新！
            setMessages(currentMessages =>
              currentMessages.map(m =>
                m.id === aiMsgId
                  ? { ...m, content: fullContent, thinking: fullThinking, loading: false }
                  : m
              )
            );
          } catch (e) { /* 解析失败不中断循环 */ }
        }
      }
    } catch (err) {
      setMessages(prev => prev.map(m =>
        m.id === aiMsgId ? { ...m, content: `⚠️ ${err.message}`, loading: false } : m
      ));
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <Popup visible={visible} onMaskClick={onClose} bodyStyle={{ height: '85vh', borderTopLeftRadius: '24px', borderTopRightRadius: '24px' }}>
      <div className="gemini-wrapper">
        <div className="gemini-header">
          <div className="gemini-logo"><span className="sparkle">✦</span> AI 分析助手</div>
          <div className="close-btn" onClick={onClose}>✕</div>
        </div>

        <div className="gemini-chat-area">
          {messages.map((msg) => (
            <div key={msg.id} className={`gemini-row ${msg.type}`}>
              {msg.type === 'ai' && <div className="ai-star">✦</div>}
              <div className="gemini-bubble">
                {msg.loading ? <DotLoading color="primary" /> : (
                  <>
                    {msg.thinking && (
                      <details className="thinking-box" open>
                        <summary>思考过程</summary>
                        <div className="thinking-text">{msg.thinking}</div>
                      </details>
                    )}
                    <div className="content-text" dangerouslySetInnerHTML={{ __html: formatMarkdown(msg.content) }} />
                  </>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="gemini-footer">
          <div className="input-container">
            <TextArea className="custom-input" placeholder="请询问关于此鱼的品质、营养或溯源路径..." value={inputValue} onChange={setInputValue} autoSize={{ minRows: 1, maxRows: 4 }} />
            <div className={`send-icon ${inputValue.trim() ? 'active' : ''}`} onClick={() => handleSend(inputValue)}>
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14z" /></svg>
            </div>
          </div>
        </div>
      </div>
    </Popup>
  );
};

export default AIAnalysis;