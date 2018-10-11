/* eslint-disable no-new */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './style.scss';

export default class MapView extends Component {
  static propTypes = {
    height: PropTypes.number,
    zoom: PropTypes.number,
  }

  static defaultProps = {
    height: 300,
    zoom: 12,
  }
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
    };
    let script = document.getElementById('mapScript');
    if (!script) {
      script = document.createElement('script');
      script.src = 'https://webapi.amap.com/maps?' +
        'v=1.4.0&key=38dbfac589d262c87bd3aaba70038538&plugin=AMap.Geocoder&callback=initMap';
      script.id = 'mapScript';
      document.head.appendChild(script);
      if (!window.initMap) {
        window.initMap = () => {
          this.setState({
            ...this.state,
            loaded: true,
          });
        };
      }
    } else {
      this.state.loaded = true;
    }
  }

  componentDidMount() {
    const {
      loaded,
    } = this.state;
    if (loaded) {
      this.initMap();
    }
  }

  componentWillUpdate(nextProps, nextState) {
    const {
      loaded,
    } = this.state;
    if (!loaded && nextState.loaded) {
      this.initMap();
    }

    let {
      value,
    } = this.props;
    if (Object.prototype.toString.call(nextProps.value) === '[object Array]') {
      const nextValue = nextProps.value;
      value = value || [];
      if ((nextValue[0] !== value[0]) || (nextValue[1] !== value[1])) {
        this.update(nextValue);
      }
    } else {
      const nextValue = nextProps.value;
      if (nextValue !== value) {
        this.update(nextValue);
      }
    }
  }

  initMap() {
    const {
      id,
      value,
      zoom,
    } = this.props;
    if (window.AMap) {
      this.map = new window.AMap.Map(id, {
        resizeEnable: true,
        zoom,
        viewMode: '3D',
        expandZoomRange: true,
        pitch: 0,
      });
      this.markers = [];
      this.geocoder = new window.AMap.Geocoder({
        radius: 500,
      });
      window.AMap.plugin(['AMap.Scale', 'AMap.ControlBar'], () => {
        const toolBar = new window.AMap.Scale();
        this.map.addControl(toolBar);
        const controlBar = new window.AMap.ControlBar();
        this.map.addControl(controlBar);
      });
      this.update(value);
    }
  }

  update(value) {
    if (this.map) {
      this.map.remove(this.markers);
      if (Object.prototype.toString.call(value) === '[object Array]') {
        this.geocoder.getAddress(value, (status, result) => {
          if (status === 'complete' && result.info === 'OK') {
            this.map.setCenter(value);
            this.addMarker(value, result.regeocode.formattedAddress);
          }
        });
      } else {
        this.geocoder.getLocation(value, (status, result) => {
          if (status === 'complete' && result.info === 'OK') {
            this.geocoderCallBack(result);
          }
        });
      }
    }
  }

  addMarker(value, address) {
    const marker = new window.AMap.Marker({
      map: this.map,
      position: value,
    });
    if (address) {
      const infoWindow = new window.AMap.InfoWindow({
        content: address,
        offset: { x: 0, y: -30 },
      });
      marker.on('mouseover', () => {
        infoWindow.open(this.map, marker.getPosition());
      });
    }
    this.markers.push(marker);
  }

  geocoderCallBack(data) {
    const geocode = data.geocodes;
    for (let i = 0; i < geocode.length; i += 1) {
      this.addMarker([geocode[i].location.getLng(), geocode[i].location.getLat()], geocode[i].formattedAddress);
    }
    this.map.setFitView();
    this.map.setZoom(this.props.zoom);
  }

  render() {
    const {
      id,
      height,
    } = this.props;

    return (
      <div
        id={id}
        style={{
          height,
        }}
      />
    );
  }
}
