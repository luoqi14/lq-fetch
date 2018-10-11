import React, { Component } from 'react';
import { Layout } from 'antd';
import { browserHistory } from 'react-router';
import WrappedNormalLoginForm from './LoginForm';
import './style.scss';

const { Content, Footer } = Layout;

class View extends Component {
  login(values) {
    this.props.login(values).then((isSuccess) => {
      isSuccess && browserHistory.push('/Manage');
    });
  }

  render() {
    return (
      <Layout className="login-layout">
        <video id="bgvid" className="login-bg-video" autoPlay loop>
          <source src="/background-video.mp4" type="video/mp4" />
          <track kind="captions" src="sampleCaptions.vtt" srcLang="en" />
        </video>
        <Content className="login-content">
          <WrappedNormalLoginForm
            login={this.login.bind(this)}
            loading={this.props.loading}
          />
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          copyright &copy; 产业互联技术中心
        </Footer>
      </Layout>
    );
  }
}

export default View;
