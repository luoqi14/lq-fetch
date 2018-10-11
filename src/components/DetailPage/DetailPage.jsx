import React, { Component } from 'react';
import { Row, Col, Form, Input, Button, Spin, Breadcrumb } from 'antd';
import PropTypes from 'prop-types';
import createFormItem from '../createFormItem';
import mapPropsToFields from '../mapPropsToFields';
import onFieldsChange from '../onFieldsChange';

const FormItem = Form.Item;

class DetailPage extends Component {
  static propTypes = {
    validateDisabled: PropTypes.bool,
    rowKey: PropTypes.string,
    breadcrumb: PropTypes.array,
  }

  static defaultProps = {
    validateDisabled: false,
    rowKey: 'id',
    breadcrumb: [],
  };

  render() {
    const {
      title,
      fields = [],
      form,
      loading = false,
      buttons = [],
      children = [],
      validateDisabled,
      rowKey,
      breadcrumb,
    } = this.props;

    const butt = buttons.map((item) => (!item.hidden) &&
    <Button
      style={item.style}
      key={`button${item.label}`}
      type={item.type || 'primary'}
      onClick={(item.handleForm || item.onClick).bind(this, form)}
      disabled={item.disabled}
      loading={item.loading}
    >
      { item.label }
    </Button>);

    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 6 },
    };

    const { getFieldDecorator } = form;

    const geneForm = (flds) => (
      <Spin spinning={loading}>
        <Form layout="horizontal">
          <FormItem label="" {...formItemLayout} style={{ display: 'none' }}>
            {getFieldDecorator(rowKey, {
            })(
              <Input type="hidden" />
            )}
          </FormItem>
          <Row>
            {
              flds.map((item) => (
                createFormItem({
                  field: item,
                  form,
                  formItemLayout,
                  validateDisabled,
                  inputOpts: {
                  },
                })
              ))
            }
          </Row>
          <FormItem style={{ textAlign: 'center' }}>
            { butt }
          </FormItem>
        </Form>
      </Spin>
    );
    return (
      <div style={{ width: '100%' }}>
        <div className="layout-detail-wrapper">
          <Row type="flex" justify="space-between" align="middle" style={{ marginBottom: '16px', height: 28 }}>
            <Col>
              {
                breadcrumb.length > 0 && (
                  <Breadcrumb>
                    <Breadcrumb.Item><a href="/Manage">首页</a></Breadcrumb.Item>
                    {
                      breadcrumb.map((item) => (<Breadcrumb.Item key={item.id}>{item.name}</Breadcrumb.Item>))
                    }
                  </Breadcrumb>
                )
              }
            </Col>
          </Row>
          <div className="layout-content-detail">
            {
              title &&
              <Row type="flex" justify="space-between" align="middle" style={{ marginBottom: 16 }}>
                <Col>
                  <h2 className="ant-page-title">
                    {title}
                  </h2>
                </Col>
              </Row>
            }
            {geneForm(fields)}
            {
              children
            }
          </div>
        </div>
      </div>
    );
  }
}

export default Form.create({
  mapPropsToFields,
  onFieldsChange,
})(DetailPage);
