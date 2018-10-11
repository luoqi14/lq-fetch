import React, { Component } from 'react';
import { Col } from 'antd';
import PropTypes from 'prop-types';
import ImagePicker from './ImagePicker';
import './style.scss';

export default class ImagePickerGroup extends Component {
  static propTypes = {
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.array,
    ]),
    tokenSeparators: PropTypes.string,
    disabled: PropTypes.bool,
    action: PropTypes.string.isRequired,
    width: PropTypes.number,
    height: PropTypes.number,
    token: PropTypes.string,
    getUrl: PropTypes.func.isRequired,
    single: PropTypes.bool,
  }

  static defaultProps = {
    tokenSeparators: undefined,
    disabled: false,
    width: 140,
    height: 140,
    token: undefined,
    getUrl: undefined,
    single: false,
  }

  constructor(props) {
    super(props);

    this.state = {
      items: props.value || [],
    };
  }

  componentWillReceiveProps(nextProps) {
    // Should be a controlled component.
    if ('value' in nextProps) {
      const value = nextProps.value;
      this.setState({
        items: value || [],
        disabled: nextProps.disabled,
      });
    }
  }

  onChange(value) {
    const {
      tokenSeparators,
    } = this.props;
    let items = this.state.items;
    if (typeof this.state.items === 'string') {
      items = this.state.items && this.state.items.split(tokenSeparators);
    }
    items = [
      ...items,
    ];
    items[value.key] = value.value;
    this.props.onChange(this.parseValues(items));
  }

  onClose(seq) {
    const {
      tokenSeparators,
    } = this.props;
    let items = this.state.items;
    if (typeof this.state.items === 'string') {
      items = this.state.items && this.state.items.split(tokenSeparators);
    }
    items = [
      ...items,
    ];

    items.splice(seq, 1);

    this.setState({
      ...this.state,
      items,
    });

    this.props.onChange(this.parseValues(items));
  }

  formatValues(items) {
    let newItems = items;
    const {
      tokenSeparators,
    } = this.props;
    if (tokenSeparators && newItems.length !== 0) {
      newItems = newItems.toString().split(tokenSeparators);
    }
    return newItems;
  }

  parseValues(items) {
    let newItems = items;
    const {
      tokenSeparators,
    } = this.props;
    if (tokenSeparators) {
      newItems = newItems.join(tokenSeparators);
    }
    return newItems;
  }

  add() {
    const defaultValue = {
      value: '',
    };
    const items = [
      ...this.state.items,
      defaultValue,
    ];
    this.setState({
      ...this.state,
      items,
    });
    this.props.onChange(this.parseValues(items));
  }

  render() {
    const {
      tokenSeparators,
      action,
      width,
      height,
      disabled,
      token,
      getUrl,
      single,
    } = this.props;

    const createItems = () => {
      let items = this.state.items;
      items = this.formatValues(items);
      const res = items.map((item, index) => (
        <Col className="imagepicker-item-wrapper" key={`upload${item.toString()}`}>
          <ImagePicker
            value={item}
            sequence={index}
            disabled={disabled}
            onChange={this.onChange.bind(this)}
            onClose={this.onClose.bind(this)}
            closeable
            action={action}
            width={width}
            height={height}
            token={token}
            getUrl={getUrl}
          />
        </Col>
      ));
      // blank placeholder
      if ((!single && !(items.length > 0 && disabled)) || (single && items.length === 0)) {
        res.push(
          <Col
            className="imagepicker-item-wrapper"
            key={'upload-placeholder'}
          >
            <ImagePicker
              value={undefined}
              sequence={items.length}
              disabled={disabled}
              onChange={this.onChange.bind(this)}
              onClose={this.onClose.bind(this)}
              closeable={false}
              tokenSeparators={tokenSeparators}
              action={action}
              width={width}
              height={height}
              token={token}
              getUrl={getUrl}
            />
          </Col>);
      }
      return res;
    };

    return (
      <div value={this.state.item} className="imagepicker-container">
        {createItems()}
      </div>
    );
  }
}
