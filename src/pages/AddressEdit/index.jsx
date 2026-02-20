import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { NavBar, Form, Input, Button, Toast, Picker, Checkbox, Selector } from 'antd-mobile';
import { getAddressById, addAddress, updateAddress } from '../../mock/addressData';
import { regionData } from './regionData';
import './index.scss';

const AddressEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form] = Form.useForm();
  const [isEdit, setIsEdit] = useState(false);
  const [regionPickerVisible, setRegionPickerVisible] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState([]);

  useEffect(() => {
    if (id) {
      // 编辑模式
      setIsEdit(true);
      const address = getAddressById(id);
      if (address) {
        form.setFieldsValue({
          name: address.name,
          phone: address.phone,
          detail: address.detail,
          tag: address.tag,
          isDefault: address.isDefault,
        });
        setSelectedRegion([address.province, address.city, address.district]);
      } else {
        Toast.show({ content: '地址不存在', icon: 'fail' });
        navigate(-1);
      }
    }
  }, [id, form, navigate]);

  // 提交表单
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      if (selectedRegion.length !== 3) {
        Toast.show({ content: '请选择省市区', icon: 'fail' });
        return;
      }

      const addressData = {
        name: values.name,
        phone: values.phone,
        province: selectedRegion[0],
        city: selectedRegion[1],
        district: selectedRegion[2],
        detail: values.detail,
        tag: values.tag || '家',
        isDefault: values.isDefault || false,
      };

      let result;
      if (isEdit) {
        result = updateAddress(id, addressData);
      } else {
        result = addAddress(addressData);
      }

      if (result.success) {
        Toast.show({ 
          content: isEdit ? '修改成功' : '添加成功', 
          icon: 'success' 
        });
        navigate(-1);
      } else {
        Toast.show({ content: result.message, icon: 'fail' });
      }
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  return (
    <div className="address-edit-container">
      <NavBar 
        onBack={() => navigate(-1)} 
        className="nav-bar"
      >
        {isEdit ? '编辑地址' : '新增地址'}
      </NavBar>

      <div className="content-area">
        <div className="form-card">
          <Form
            form={form}
            layout="horizontal"
            mode="card"
            footer={null}
          >
            <Form.Item
              name="name"
              label="收货人"
              rules={[
                { required: true, message: '请输入收货人姓名' },
                { max: 20, message: '姓名不能超过20个字符' }
              ]}
            >
              <Input placeholder="请输入收货人姓名" clearable />
            </Form.Item>

            <Form.Item
              name="phone"
              label="手机号码"
              rules={[
                { required: true, message: '请输入手机号码' },
                { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码' }
              ]}
            >
              <Input placeholder="请输入手机号码" type="tel" maxLength={11} clearable />
            </Form.Item>

            <Form.Item
              label="所在地区"
              rules={[{ required: true, message: '请选择所在地区' }]}
              onClick={() => setRegionPickerVisible(true)}
            >
              <Input
                placeholder="请选择省市区"
                readOnly
                value={selectedRegion.join(' ')}
                onClick={() => setRegionPickerVisible(true)}
              />
            </Form.Item>

            <Form.Item
              name="detail"
              label="详细地址"
              rules={[
                { required: true, message: '请输入详细地址' },
                { max: 100, message: '详细地址不能超过100个字符' }
              ]}
            >
              <Input
                placeholder="街道、楼牌号等详细信息"
                clearable
              />
            </Form.Item>

            <Form.Item
              name="tag"
              label="地址标签"
            >
              <Selector
                options={[
                  { label: '家', value: '家' },
                  { label: '公司', value: '公司' },
                  { label: '学校', value: '学校' },
                ]}
                defaultValue={['家']}
              />
            </Form.Item>

            <Form.Item
              name="isDefault"
              valuePropName="checked"
            >
              <Checkbox>设为默认地址</Checkbox>
            </Form.Item>
          </Form>
        </div>

        <div className="submit-section">
          <Button 
            color="primary" 
            className="submit-btn"
            onClick={handleSubmit}
            block
          >
            保存
          </Button>
        </div>
      </div>

      {/* 地区选择器 */}
      <Picker
        columns={regionData}
        visible={regionPickerVisible}
        onClose={() => setRegionPickerVisible(false)}
        value={selectedRegion}
        onConfirm={(val) => {
          setSelectedRegion(val);
        }}
      />
    </div>
  );
};

export default AddressEdit;