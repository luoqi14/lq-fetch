/* eslint-disable no-undef */
import React, { Component } from 'react';
import {
  Form,
  Row,
  Col,
  Button,
} from 'antd';
import PropTypes from 'prop-types';
import createFormItem from '../createFormItem';
import mapPropsToFields from '../mapPropsToFields';
import onFieldsChange from '../onFieldsChange';
import './style.scss';
import respond from '../decorators/Responsive';

const FormItem = Form.Item;

class AdvancedSearchForm extends Component {
  static propTypes = {
    form: PropTypes.object.isRequired,
    fields: PropTypes.array.isRequired,
    search: PropTypes.func.isRequired,
    values: PropTypes.object.isRequired,
    reset: PropTypes.func,
    changeRecord: PropTypes.func.isRequired, // eslint-disable-line react/no-unused-prop-types
    validateDisabled: PropTypes.bool,
    sorter: PropTypes.object,
  }

  static defaultProps = {
    validateDisabled: false,
    sorter: {},
  };

  componentDidMount() {
    this.props.validateDisabled && this.props.form.validateFields();
  }

  getValues(callback) {
    this.props.form.validateFields((err) => {
      if (!err) {
        callback();
      }
    });
  }

  setDisabled(fieldsError) {
    return this.props.validateDisabled && Object.keys(fieldsError).some((field) => fieldsError[field]);
  }

  handleSearch = () => {
    this.getValues(() => {
      const pageSize = (this.props.page && this.props.page.pageSize) || '10';
      const searchParams = this.props.values;
      this.props.search({
        ...searchParams,
        pageNo: '1',
        pageSize,
        columnKey: this.props.sorter.columnKey,
        order: this.props.sorter.order,
      });
    });
  }

  handleReset = () => {
    (this.props.reset && this.props.reset()) || this.props.changeRecord({});
  }

  render() {
    const {
      fields,
      style,
      expand,
      validateDisabled,
      form,
    } = this.props;

    const { getFieldsError } = form;

    // To generate mock Form.Item
    const children = [];
    const len = fields.length;
    const labelCol = expand ? 7 : 4;
    const wrapperCol = expand ? 17 : 20;
    for (let i = 0; i < len; i += 1) {
      children.push(
        createFormItem({
          field: fields[i],
          form,
          validateDisabled,
          formItemLayout: {
            labelCol: { span: fields[i].large ? 2 : labelCol },
            wrapperCol: { span: fields[i].large ? 22 : wrapperCol },
          },
          colSpan: !expand || fields[i].large ? 24 : 8,
        })
      );
    }

    return (
      <Form
        className="ant-advanced-search-form"
        style={style}
      >
        <Row gutter={20}>
          {children}
        </Row>
        {
          expand && (
            <Row gutter={20}>
              <Col span={8} style={{ textAlign: 'left' }}>
                <FormItem wrapperCol={{ span: 17, offset: 7 }}>
                  <Button
                    type="primary"
                    onClick={this.handleSearch}
                    className="search-button"
                    disabled={this.setDisabled(getFieldsError())}
                  >
                    搜索
                  </Button>
                  {
                    fields.length > 1 &&
                    <Button
                      className="reset-button"
                      style={{ marginLeft: 8, border: 'none' }}
                      onClick={this.handleReset}
                    >
                      重置
                    </Button>
                  }
                </FormItem>
              </Col>
            </Row>
          )
        }
        {
          !expand && (
            <Row gutter={20}>
              <Col span={24}>
                <FormItem>
                  <Button
                    type="primary"
                    onClick={this.handleSearch}
                    style={{ width: '100%' }}
                    disabled={this.setDisabled(getFieldsError())}
                  >
                    搜索
                  </Button>
                </FormItem>
              </Col>
              <Col span={24}>
                <FormItem>
                  <Button className="reset-button" style={{ border: 'none', width: '100%' }} onClick={this.handleReset}>
                    重置
                  </Button>
                </FormItem>
              </Col>
            </Row>
          )
        }
      </Form>
    );
  }
}

const SearchForm = Form.create({
  mapPropsToFields,
  onFieldsChange,
})(AdvancedSearchForm);

export default respond(SearchForm);
