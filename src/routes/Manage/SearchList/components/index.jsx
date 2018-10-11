import React, { Component } from 'react';
import { Button, Popconfirm } from 'antd';
import ListPage from '../../../../components/ListPage';

class View extends Component {
  componentDidMount() {
    this.props.loadUsers({
      ...this.props.searchParams,
      ...this.props.sorter,
    });
  }

  render() {
    const {
      menuRouter,
      users,
      loading,
      page,
      loadUsers,
      changeSearch,
      searchParams,
      lockUser,
      sorter,
      selectedRowKeys,
      selectRows,
      clearSelectedKeys,
    } = this.props;

    const columns = [
      {
        label: '工号',
        name: 'id',
        sorter: true,
      },
      {
        label: '员工姓名',
        name: 'name',
        search: true,
        sorter: true,
      },
      {
        label: '联系电话',
        name: 'phone',
        search: true,
        sorter: true,
      },
      {
        label: '员工类型',
        name: 'type',
        search: true,
        type: 'select',
        data: { 1: '店长', 2: '快递员' },
        sorter: true,
      },
      {
        label: '所属门店',
        name: 'storeId',
        search: true,
        type: 'select',
        data: { 1: '计量问问店', 2: '杭师问问店' },
        sorter: true,
      },
      {
        label: '员工状态',
        name: 'status',
        search: true,
        type: 'select',
        data: { 1: '在职', 2: '离职' },
        sorter: true,
      },
      {
        label: '注册时间',
        name: 'createDatetime',
        type: 'datetime',
        sorter: true,
      },
      {
        label: '操作',
        name: 'action',
        render: (text, record) => (record.status === 1
          && (<Popconfirm
            title="你确定要注销吗?"
            onConfirm={lockUser.bind(this, { ids: [record.id] })}
          >
            <Button type="primary">注销</Button>
          </Popconfirm>)),
      },
    ];

    const buttons = [
      {
        label: '批量注销',
        onClick: lockUser.bind(this, { ids: selectedRowKeys, multi: true }),
        disabled: selectedRowKeys.length === 0,
      },
    ];

    return (
      <ListPage
        columns={columns}
        breadcrumb={menuRouter}
        data={users}
        loading={loading}
        page={page}
        search={loadUsers}
        changeSearch={changeSearch}
        searchParams={searchParams}
        sorter={sorter}
        xScroll={800}
        checkbox={{
          selectedRowKeys,
          selectRows,
          clearSelectedKeys,
          getCheckboxProps: (record) => ({
            disabled: record.status === 2,
          }),
        }}
        buttons={buttons}
      />
    );
  }
}

export default View;
