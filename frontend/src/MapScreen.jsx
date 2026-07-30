import buildingFinish from './assets/2020/common/building_finish.png'
import './Stage.css'
import './MapScreen.css'

function MapScreen({ background, sites, detective, onSelectSite, completedSites = [] }) {
  return (
    <main className="stage-wrap">
      <div className="stage map-stage" style={{ backgroundImage: `url(${background})` }}>
        {sites.map((site) => (
          <button
            key={site.id}
            type="button"
            className="map-site"
            style={{
              backgroundImage: `url(${site.image})`,
              left: site.box.left,
              top: site.box.top,
              width: site.box.width,
              height: site.box.height,
            }}
            aria-label={site.label}
            onClick={() => onSelectSite?.(site.id)}
          />
        ))}

        {sites
          .filter((site) => completedSites.includes(site.id))
          .map((site) => (
            <img
              key={`${site.id}-stamp`}
              className="map-site-stamp"
              src={buildingFinish}
              alt=""
              style={{
                left: site.box.left,
                top: site.box.top,
                width: site.box.width,
                height: site.box.height,
                transform: `scale(${site.stampScale ?? 0.8}) translateY(3cqi)`,
              }}
            />
          ))}

        {detective && (
          <img
            className="map-detective"
            src={detective.image}
            alt=""
            style={{
              left: detective.box.left,
              top: detective.box.top,
              width: detective.box.width,
              height: detective.box.height,
            }}
          />
        )}
      </div>
    </main>
  )
}

export default MapScreen
