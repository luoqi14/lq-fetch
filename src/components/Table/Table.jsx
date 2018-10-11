import React, { Component } from 'react';
import { Table as AntdTable, Spin } from 'antd';
import PropTypes from 'prop-types';
import moment from 'moment';

export default class Table extends Component {
  static propTypes = {
    rowKey: PropTypes.string,
    loading: PropTypes.bool,
    columns: PropTypes.array.isRequired,
    dataSource: PropTypes.array,
    rowSelection: PropTypes.object,
    pagination: PropTypes.object,
    search: PropTypes.func,
    searchParams: PropTypes.object,
    onChange: PropTypes.func,
    bordered: PropTypes.bool,
    expandedRowRender: PropTypes.func,
    sorter: PropTypes.object,
    xScroll: PropTypes.number,
    yScroll: PropTypes.number,
    size: PropTypes.string,
    onRowClick: PropTypes.func,
    radio: PropTypes.object,
    checkbox: PropTypes.object,
  }

  static defaultProps = {
    rowKey: 'id',
    loading: false,
    dataSource: [],
    rowSelection: undefined,
    pagination: {},
    search: undefined,
    searchParams: {},
    onChange: undefined,
    bordered: false,
    expandedRowRender: undefined,
    sorter: {},
    xScroll: undefined,
    yScroll: undefined,
    size: 'default',
    onRowClick: undefined,
    radio: undefined,
    checkbox: undefined,
  }

  onChange(page, filters, sorter) {
    this.props.search({
      ...this.props.searchParams,
      pageNo: page.current,
      pageSize: page.pageSize,
      columnKey: sorter.columnKey,
      order: sorter.order,
    });
  }
  shapeColumns(columns) {
    const {
      sorter,
    } = this.props;
    const timeMap = {
      datetime: 'YYYY-MM-DD HH:mm',
      datetimeRange: 'YYYY-MM-DD HH:mm',
      date: 'YYYY-MM-DD',
      dateRange: 'YYYY-MM-DD',
    };
    columns.forEach((col) => {
      const column = col;
      if ('label' in column) {
        column.title = column.label;
      }
      if ('name' in column) {
        column.key = column.name;
        column.dataIndex = column.name;
      }
      if ('sorter' in column && !('sortOrder' in column)) {
        column.sortOrder = sorter.columnKey === column.name && sorter.order;
      }
      if (column.type in timeMap) {
        column.render = (text) => {
          let resText = text;
          if ((`${text}`).length === 13) {
            resText = +text;
          }
          return resText && moment(resText).format(timeMap[column.type]);
        };
      }
      if (column.type === 'select' && !('render' in column)) {
        column.render = (text) => column.data[text];
      }
    });
    return columns;
  }

  render() {
    const {
      loading,
      columns,
      dataSource,
      pagination,
      searchParams,
      onChange,
      bordered,
      rowKey,
      expandedRowRender,
      xScroll,
      size,
      radio,
      checkbox,
      yScroll,
    } = this.props;

    let {
      rowSelection,
      onRowClick,
    } = this.props;
    const shapedColumns = this.shapeColumns(columns);
    if (radio) {
      rowSelection = {
        type: 'radio',
        selectedRowKeys: radio.selectedRowKeys,
        onSelect: (record) => {
          radio.selectRow(record);
        },
      };
      onRowClick = (record) => {
        radio.selectRow(record);
      };
    }
    if (checkbox) {
      rowSelection = {
        type: 'checkbox',
        selectedRowKeys: checkbox.selectedRowKeys,
        onSelect: (record, selected) => {
          checkbox.selectRows([record], selected);
        },
        onSelectAll: (selected, selectedRows, changedRows) => {
          checkbox.selectRows(changedRows, selected);
        },
        getCheckboxProps: checkbox.getCheckboxProps,
      };
    }

    return (
      <Spin spinning={loading}>
        <AntdTable
          bordered={bordered}
          searchParams={searchParams}
          rowKey={rowKey}
          columns={shapedColumns}
          dataSource={dataSource}
          pagination={
            pagination ? {
              pageSize: 10,
              ...pagination,
              showTotal: (total, range) => `显示第 ${range[0]} 到第 ${range[1]} 条记录，总共 ${total} 条记录`,
            } : false}
          onChange={onChange || this.onChange.bind(this)}
          rowSelection={rowSelection}
          expandedRowRender={expandedRowRender}
          scroll={{ x: xScroll, y: yScroll }}
          size={size}
          onRowClick={onRowClick}
        />
      </Spin>
    );
  }
}
