import React, { useState } from 'react';
import { Modal, Toast, TextArea, Input, Button, ImageUploader } from 'antd-mobile';
import { getCurrentUser, submitFeedback } from '../../mock/userData';
import { AddOutline } from 'antd-mobile-icons';
import './index.scss';

const FeedbackModal = ({ visible, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: 'suggestion',
    title: '',
    content: '',
    contact: '',
    images: []
  });

  const user = getCurrentUser();

  // 模拟图片上传
  const mockUpload = (file) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          url: URL.createObjectURL(file),
        });
      }, 500);
    });
  };

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      Toast.show('请填写反馈标题');
      return;
    }

    if (!formData.content.trim()) {
      Toast.show('请填写反馈内容');
      return;
    }

    setLoading(true);
    try {
      await submitFeedback({
        ...formData,
        userId: user.id,
        userName: user.nickname || user.phone,
        imageCount: formData.images.length
      });

      Toast.show({
        content: '反馈提交成功，感谢您的建议！',
        icon: 'success',
        duration: 2000
      });
      
      onClose();
      
      // 延迟重置表单，避免关闭动画时看到表单被清空
      setTimeout(() => {
        setFormData({
          type: 'suggestion',
          title: '',
          content: '',
          contact: '',
          images: []
        });
      }, 300);
    } catch (error) {
      Toast.show('提交失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      title="意见反馈"
      content={
        <div className="feedback-modal">
          <div className="form-group">
            <label>反馈类型</label>
            <div className="type-buttons">
              <button
                className={`type-btn ${formData.type === 'suggestion' ? 'active' : ''}`}
                onClick={() => handleInputChange('type', 'suggestion')}
              >
                功能建议
              </button>
              <button
                className={`type-btn ${formData.type === 'bug' ? 'active' : ''}`}
                onClick={() => handleInputChange('type', 'bug')}
              >
                问题反馈
              </button>
              <button
                className={`type-btn ${formData.type === 'other' ? 'active' : ''}`}
                onClick={() => handleInputChange('type', 'other')}
              >
                其他
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>反馈标题</label>
            <Input
              placeholder="请输入简短的反馈标题"
              value={formData.title}
              onChange={v => handleInputChange('title', v)}
              maxLength={30}
            />
          </div>

          <div className="form-group">
            <label>详细描述</label>
            <TextArea
              placeholder="请详细描述您的问题或建议"
              value={formData.content}
              onChange={v => handleInputChange('content', v)}
              rows={4}
              maxLength={500}
              showCount
            />
          </div>

          <div className="form-group">
            <label>联系方式（选填）</label>
            <Input
              placeholder="邮箱或手机号，方便我们回复您"
              value={formData.contact}
              onChange={v => handleInputChange('contact', v)}
            />
          </div>

          <div className="form-group">
            <label>
              图片上传（选填，最多3张）
              <span className="label-tip">上传截图有助于我们更好地理解问题</span>
            </label>
            <ImageUploader
              value={formData.images}
              onChange={images => handleInputChange('images', images)}
              upload={mockUpload}
              maxCount={3}
              multiple
              showUpload={formData.images.length < 3}
              preview={true}
              deletable={true}
            >
              <div className="upload-button">
                <AddOutline className="upload-icon" />
                <span className="upload-text">上传图片</span>
              </div>
            </ImageUploader>
          </div>

          <div className="feedback-actions">
            <Button fill="none" onClick={onClose}>
              取消
            </Button>
            <Button 
              color="primary" 
              loading={loading}
              onClick={handleSubmit}
              disabled={!formData.title.trim() || !formData.content.trim()}
            >
              提交反馈
            </Button>
          </div>
        </div>
      }
    />
  );
};

export default FeedbackModal;