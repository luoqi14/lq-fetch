import React, { Component } from 'react';
import { DatePicker, Row, Col } from 'antd';
import PropTypes from 'prop-types';

export default class DateRange extends Component {
  static propTypes = {
    disabled: PropTypes.bool,
    format: PropTypes.string,
    showTime: PropTypes.object,
    maxInterval: PropTypes.number,
  }

  static defaultProps = {
    disabled: false,
    format: 'YYYY-MM-DD',
    showTime: undefined,
    maxInterVal: undefined,
  }

  state = {
    endOpen: false,
    value: [],
  }

  componentWillReceiveProps(nextProps) {
    // Should be a controlled component.
    if ('value' in nextProps) {
      const value = nextProps.value || {};
      this.setState(Object.assign({}, this.state, {
        value,
      }));
    }
  }

  onStartChange = (value) => {
    let values = [];
    if (value || this.state.value[1]) {
      values = [value, this.state.value[1]];
    }
    this.props.onChange(values);
  }

  onEndChange = (value) => {
    let values = [];
    if (value || this.state.value[0]) {
      values = [this.state.value[0], value];
    }
    this.props.onChange(values);
  }

  handleStartOpenChange = (open) => {
    if (!open) {
      this.setState({ endOpen: true });
    }
  }

  handleEndOpenChange = (open) => {
    this.setState({ endOpen: open });
  }

  disabledStartDate = (startValue) => {
    const endValue = this.state.value[1];
    if (!startValue || !endValue) {
      return false;
    }
    let res = startValue.valueOf() > endValue.valueOf();
    if (this.props.maxInterval && !res) {
      res = startValue.valueOf() < (endValue.valueOf() - this.props.maxInterval);
    }
    return res;
  }

  disabledEndDate = (endValue) => {
    const startValue = this.state.value[0];
    if (!endValue || !startValue) {
      return false;
    }
    let res = endValue.valueOf() <= startValue.valueOf();
    if (this.props.maxInterval && !res) {
      res = endValue.valueOf() >= (startValue.valueOf() + this.props.maxInterval);
    }
    return res;
  }

  render() {
    const { value, endOpen } = this.state;
    const { disabled, format, showTime } = this.props;
    const placeholderPart = showTime ? '时间' : '日期';
    return (
      <Row span={24}>
        {
          disabled &&
          <div className="fe-blank-holder"><span>{value[0] ? value[0].format(format) : '-'}
          </span> ~ <span>{value[1] ? value[1].format(format) : '-'}</span></div>
        }
        {
          !disabled &&
          (
            <div>
              <Col span={11}>
                <DatePicker
                  disabledDate={this.disabledStartDate.bind(this)}
                  format={format}
                  showTime={showTime}
                  value={value[0]}
                  placeholder={`请选择开始${placeholderPart}`}
                  onChange={this.onStartChange}
                  onOpenChange={this.handleStartOpenChange}
                />
              </Col>
              <Col span={2} style={{ textAlign: 'center' }}>
                <span> ~ </span>
              </Col>
              <Col span={11}>
                <DatePicker
                  disabledDate={this.disabledEndDate.bind(this)}
                  format={format}
                  showTime={showTime}
                  value={value[1]}
                  placeholder={`请选择结束${placeholderPart}`}
                  onChange={this.onEndChange}
                  open={endOpen}
                  onOpenChange={this.handleEndOpenChange}
                />
              </Col>
            </div>
          )
        }

      </Row>
    );
  }
}
