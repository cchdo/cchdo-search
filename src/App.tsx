import React, { ChangeEvent } from 'react';

import { Container, Row, Col, Form } from 'react-bootstrap';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet'

import cruise from './cruises.json'

import 'bootstrap/dist/css/bootstrap.min.css';
import 'leaflet/dist/leaflet.css';

import L from 'leaflet';

// This next part is a hack to make icons work in CRA... TS isn't happy about it so just ignore this
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});
// End Hack

const position = { lat: 0, lng: 0 };

type AppState = {searchText: string, results:string[]}

const data = cruise.map((value) => value.expocode)

class App extends React.Component<{}, AppState> {
  constructor(props: any) {
    super(props);

    this.state = {
      searchText: "",
      results: data
    }
  }

  handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const text = event.target.value;
    const ma = RegExp(text, 'i')
    const results = data.filter((value) =>  ma.test(value))
    this.setState({searchText: text, results: results})
  }

  render() {
    let results = this.state.results.map((value) => <li key={value}><a href={`https://cchdo.ucsd.edu/cruise/${value}`}>{value}</a></li>)
    return (
      <Container fluid={true}>
        <Row style={{ minHeight: "100vh" }}>
          <Col>
            <Map style={{ height: "100%" }} center={position} zoom={2}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
              />
              <Marker position={position}>
                <Popup>A pretty CSS3 popup.<br />Easily customizable.</Popup>
              </Marker>
            </Map>
          </Col>
          <Col lg={4} style={{maxHeight: "100vh", overflow:"scroll"}}>
            <h4>Filter Some Expocodes</h4>
            <Form>
              <Form.Control type="search" onChange={this.handleSearch} value={this.state.searchText}/>
            </Form>
            <ul>
              {results}
            </ul>
          </Col>
        </Row>
      </Container>
    )
  }
}

export default App;
