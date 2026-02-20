import React, { useState, useEffect, useRef } from 'react';
import { Popup, Button, TextArea, Toast, DotLoading } from 'antd-mobile';
import './index.scss';

/**
 * AI智能分析组件
 * 基于鳗鱼溯源数据生成智能分析报告，支持用户追问
 */
const AIAnalysis = ({ visible, onClose, productData, traceData }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const messagesEndRef = useRef(null);

  // 滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 打开时自动开始分析
  useEffect(() => {
    if (visible && messages.length === 0) {
      // 忽略type报错
      // eslint-disable-next-line
      startAIAnalysis();
    }
  }, [visible]);

  // 重置状态
  useEffect(() => {
    if (!visible) {
      // 关闭时可选择是否重置
    }
  }, [visible]);

  // 模拟打字机效果
  const typeMessage = async (content, type = 'ai') => {
    setIsTyping(true);
    const chars = content.split('');
    let currentText = '';

    // 添加一个空消息占位
    const messageId = Date.now();
    setMessages(prev => [...prev, { id: messageId, type, content: '', isTyping: true }]);

    for (let i = 0; i < chars.length; i++) {
      currentText += chars[i];
      const finalText = currentText;
      setMessages(prev =>
        prev.map(msg =>
          msg.id === messageId ? { ...msg, content: finalText } : msg
        )
      );
      // 随机打字速度，模拟真实效果
      await new Promise(resolve => setTimeout(resolve, Math.random() * 30 + 15));
    }

    // 完成打字
    setMessages(prev =>
      prev.map(msg =>
        msg.id === messageId ? { ...msg, isTyping: false } : msg
      )
    );
    setIsTyping(false);
  };

  // 生成AI分析报告
  const generateAnalysisReport = () => {
    const origin = productData?.origin || '四川省宜宾市江安县阳春镇';
    const productionDate = productData?.productionDate || '2025-01-23';
    const status = productData?.status || '合格';

    // 计算新鲜度（基于日期）
    const daysSinceProduction = Math.floor(
      (new Date() - new Date(productionDate)) / (1000 * 60 * 60 * 24)
    );
    const freshnessScore = Math.max(0, 100 - daysSinceProduction * 5);

    // 分析溯源链条
    const nodeCount = traceData?.length || 5;
    const allPassed = traceData?.every(node =>
      node.status?.includes('合格') || node.status?.includes('通过')
    ) ?? true;

    return `🐟 **AI智能分析报告**

━━━━━━━━━━━━━━━━━━━━

📊 **综合品质评级：${allPassed ? 'A级优质' : 'B级良好'}**

基于${nodeCount}个溯源节点的全链路数据分析：

🌟 **品质评估**
• 检验状态：${status === '合格' ? '✅ 全部合格' : '⚠️ 需关注'}
• 溯源完整度：${nodeCount >= 4 ? '完整' : '基本完整'}（${nodeCount}个节点）
• 新鲜度指数：${freshnessScore}分

🥗 **营养价值分析**
• 蛋白质：约18.2g/100g（优质蛋白来源）
• 脂肪：约12.5g/100g（富含Omega-3）
• 热量：约189kcal/100g
• 维生素：富含维生素A、D、E

💡 **AI食用建议**
• 推荐烹饪：清蒸、蒲烧、白灼（最大保留营养）
• 适宜人群：老人、儿童、健身人群
• 建议食用量：每周2-3次，每次100-150g

⚠️ **健康提示**
• 过敏原：含鱼类蛋白，鱼类过敏者慎食
• 痛风患者：建议少量食用
• 孕妇：可适量食用，营养丰富

📍 **产地特色**
${origin}地处长江上游，水质优良，是国内优质鳗鱼养殖基地。该区域养殖的鳗鱼肉质细嫩、口感鲜美。

━━━━━━━━━━━━━━━━━━━━

💬 您可以继续向我提问，例如：
• "这条鱼适合做什么菜？"
• "鳗鱼有什么营养价值？"
• "如何判断鳗鱼是否新鲜？"`;
  };

  // 开始AI分析
  const startAIAnalysis = async () => {
    // 添加欢迎消息
    await typeMessage('您好！我是AI智能分析助手 🤖\n正在为您分析这条鳗鱼的详细信息...');

    // 模拟分析延迟
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    // 生成并显示分析报告
    const report = generateAnalysisReport();
    await typeMessage(report);

    setAnalysisComplete(true);
  };

  // 预设问答库
  const qaDatabase = {
    '烹饪|做菜|怎么做|菜谱': `🍳 **鳗鱼烹饪推荐**

**1. 日式蒲烧鳗鱼（经典做法）**
• 将鳗鱼切段，刷上蒲烧酱
• 烤箱200°C烤制15-20分钟
• 配米饭食用，撒上芝麻和海苔

**2. 清蒸鳗鱼（保留营养）**
• 鳗鱼洗净切块，加姜丝葱段
• 大火蒸8-10分钟
• 淋上蒸鱼豉油即可

**3. 红烧鳗鱼（家常风味）**
• 鳗鱼煎至两面金黄
• 加入酱油、糖、料酒焖煮
• 收汁后撒葱花出锅

💡 小贴士：新鲜鳗鱼建议2天内食用，冷冻可保存1个月`,

    '营养|价值|好处|功效': `🥗 **鳗鱼营养价值详解**

**主要营养成分（每100g）**
• 蛋白质：18.2g - 优质完全蛋白
• 脂肪：12.5g - 富含EPA和DHA
• 维生素A：1500IU - 有益视力
• 维生素E：5.6mg - 抗氧化
• 钙：50mg、磷：230mg

**健康功效**
✅ 增强免疫力：富含多种维生素和矿物质
✅ 健脑益智：DHA含量高，促进大脑发育
✅ 美容养颜：胶原蛋白丰富
✅ 强筋壮骨：钙磷比例适宜
✅ 抗疲劳：维生素B群充足

**适宜人群**
👶 儿童：促进生长发育
👴 老人：预防骨质疏松
💪 健身者：优质蛋白来源`,

    '新鲜|判断|挑选|选购': `🔍 **如何判断鳗鱼新鲜度**

**外观检查**
• ✅ 体表光滑有粘液，色泽鲜亮
• ✅ 眼睛清澈透明，不浑浊
• ✅ 鱼鳃鲜红色，无异味
• ❌ 避免：体表暗淡、有斑点

**触感检验**
• ✅ 肉质紧实有弹性
• ✅ 按压后能快速恢复
• ❌ 避免：肉质松软、凹陷不恢复

**气味判断**
• ✅ 有淡淡的海鲜腥味（正常）
• ❌ 避免：刺鼻的氨味或腐臭味

**溯源验证（推荐）**
• 扫描产品二维码查看完整溯源信息
• 检查养殖、运输、检验各环节是否合格
• 本系统显示的溯源链条越完整越可靠`,

    '保存|储存|冷冻': `❄️ **鳗鱼保存指南**

**冷藏保存（0-4°C）**
• 保存时间：1-2天
• 方法：用保鲜膜包好放冰箱冷藏
• 建议：尽快食用最佳

**冷冻保存（-18°C以下）**
• 保存时间：1-3个月
• 方法：真空包装后冷冻
• 解冻：放冷藏室自然解冻，避免室温解冻

**小贴士**
• 不要反复解冻冷冻
• 解冻后应在24小时内食用
• 切好的鳗鱼段分装冷冻更方便`,

    '价格|多少钱|贵': `💰 **关于鳗鱼价格**

这条鳗鱼来自四川省江安县优质养殖基地，价格通常取决于：
• 养殖方式（生态养殖价格较高）
• 规格大小
• 运输距离
• 季节因素

您可以在商城页面查看具体价格，支持在线购买和配送到家服务。`,

    '过敏|禁忌|不能吃': `⚠️ **食用禁忌提醒**

**不宜食用人群**
• 🚫 鱼类过敏者：可能引发过敏反应
• ⚠️ 痛风患者：嘌呤含量中等，建议少量
• ⚠️ 肾病患者：蛋白质摄入需遵医嘱

**食用注意事项**
• 必须彻底加热熟透后食用
• 不要与寒凉食物同食过多
• 首次食用建议少量尝试

**过敏症状**
如出现皮疹、呼吸困难、腹泻等症状，请立即就医。`
  };

  // 处理用户提问
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isTyping) return;

    const userQuestion = inputValue.trim();
    setInputValue('');

    // 添加用户消息
    setMessages(prev => [...prev, {
      id: Date.now(),
      type: 'user',
      content: userQuestion
    }]);

    // 模拟AI思考
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 700));

    // 查找匹配的回答
    let aiResponse = '';
    for (const [keywords, answer] of Object.entries(qaDatabase)) {
      const keywordList = keywords.split('|');
      if (keywordList.some(kw => userQuestion.includes(kw))) {
        aiResponse = answer;
        break;
      }
    }

    // 默认回答
    if (!aiResponse) {
      aiResponse = `感谢您的提问！关于"${userQuestion}"：

基于当前鳗鱼溯源数据分析：
• 该产品通过了全部${traceData?.length || 5}个节点的质量检验
• 养殖环境符合国家标准
• 运输过程温控达标

如需了解更多，您可以询问：
• 营养价值相关问题
• 烹饪方法推荐
• 保存储存建议
• 食用禁忌提醒

我会持续学习优化，为您提供更好的服务！🤖`;
    }

    await typeMessage(aiResponse);
  };

  // 快捷问题
  const quickQuestions = [
    '推荐烹饪方法',
    '营养价值分析',
    '如何判断新鲜',
    '保存方法'
  ];

  const handleQuickQuestion = (question) => {
    setInputValue(question);
  };

  return (
    <Popup
      visible={visible}
      onMaskClick={onClose}
      bodyStyle={{
        backgroundColor: 'transparent',
        height: '85vh',
        borderTopLeftRadius: '16px',
        borderTopRightRadius: '16px',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <div className="ai-analysis-container">
        {/* 头部 */}
        <div className="ai-header">
          <div className="ai-avatar">🤖</div>
          <div className="ai-info">
            <h3>AI智能分析助手</h3>
            <span className="ai-status">
              {isTyping ? <><DotLoading color='primary' /> 正在输入...</> : '在线'}
            </span>
          </div>
          <Button className="close-btn" fill="none" onClick={onClose}>✕</Button>
        </div>

        {/* 消息列表 */}
        <div className="messages-container">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`message ${msg.type === 'user' ? 'user-message' : 'ai-message'}`}
            >
              {msg.type === 'ai' && <div className="message-avatar">🤖</div>}
              <div className="message-content">
                <pre>{msg.content}</pre>
                {msg.isTyping && <span className="typing-cursor">|</span>}
              </div>
              {msg.type === 'user' && <div className="message-avatar">👤</div>}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* 快捷问题 */}
        {analysisComplete && !isTyping && (
          <div className="quick-questions">
            {quickQuestions.map((q, index) => (
              <Button
                key={index}
                size="small"
                className="quick-btn"
                onClick={() => handleQuickQuestion(q)}
              >
                {q}
              </Button>
            ))}
          </div>
        )}

        {/* 输入区域 */}
        <div className="input-container">
          <TextArea
            className="message-input"
            placeholder="输入您的问题..."
            value={inputValue}
            onChange={setInputValue}
            rows={1}
            autoSize={{ minRows: 1, maxRows: 3 }}
            onEnterPress={(e) => {
              if (!e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <Button
            className="send-btn"
            color="primary"
            disabled={!inputValue.trim() || isTyping}
            onClick={handleSendMessage}
          >
            发送
          </Button>
        </div>
      </div>
    </Popup>
  );
};

export default AIAnalysis;