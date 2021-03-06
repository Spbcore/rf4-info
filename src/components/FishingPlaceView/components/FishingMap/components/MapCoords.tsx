import L, { LeafletMouseEvent } from 'leaflet';
import { LeafletContext, MapControl, withLeaflet } from 'react-leaflet';
import { FishingPlace } from '../../../../../shared/types/game';
import './MapCoords.css';

interface MapCoordsProps {
  leaflet: LeafletContext;
  place: FishingPlace;
}

class MapCoords extends MapControl<MapCoordsProps> {
  constructor(props: MapCoordsProps) {
    super(props);
    props.leaflet.map?.addEventListener('mousemove', (ev: LeafletMouseEvent) => {
      this.panelDiv.innerHTML = `<h2><span>${Math.round(
        ev.latlng.lng + props.place.offsetX
      )}</span>&nbsp;<span>:${Math.round(ev.latlng.lat + props.place.offsetY)}</span></h2>`;
    });
  }
  panelDiv: any;

  createLeafletElement(opts: MapCoordsProps) {
    const MapCoords = L.Control.extend({
      onAdd: () => {
        this.panelDiv = L.DomUtil.create('div', 'coords-panel-wrapper');
        this.panelDiv.innerHTML = '<h2>0:0</h2>';
        return this.panelDiv;
      },
    });
    return new MapCoords({ position: 'bottomleft' });
  }

  componentDidMount() {
    const { map }: any = this.props.leaflet;
    this.leafletElement.addTo(map);
  }
}

export default withLeaflet(MapCoords);
