import mapBg from './assets/map1.png'
import oceanBuilding from './assets/building1.png'
import satelliteBuilding from './assets/building2.png'
import weatherBuilding from './assets/building3.png'
import detective from './assets/map_gisang.png'
import './Stage.css'
import './MapScreen.css'

const SITES = [
  { id: 'ocean', label: '해양관측소', image: oceanBuilding, className: 'map-site-ocean' },
  { id: 'weather', label: '기상관측소', image: weatherBuilding, className: 'map-site-weather' },
  { id: 'satellite', label: '위성센터', image: satelliteBuilding, className: 'map-site-satellite' },
]

function MapScreen({ onSelectSite, onOpenNotebook }) {
  return (
    <main className="stage-wrap">
      <div className="stage map-stage" style={{ backgroundImage: `url(${mapBg})` }}>
        {SITES.map((site) => (
          <button
            key={site.id}
            type="button"
            className={`map-site ${site.className}`}
            style={{ backgroundImage: `url(${site.image})` }}
            aria-label={site.label}
            onClick={() => onSelectSite?.(site.id)}
          />
        ))}

        <img className="map-detective" src={detective} alt="" />

        <button
          type="button"
          className="map-notebook-button"
          aria-label="수사 수첩 열기"
          onClick={onOpenNotebook}
        >
          📓
        </button>
      </div>
    </main>
  )
}

export default MapScreen
