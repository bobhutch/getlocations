/**
 * @file
 * @author Bob Hutchinson http://drupal.org/user/52366
 * @copyright GNU GPL
 *
 * Javascript functions for getlocations GeoJSON support
 * See https://github.com/JasonSanford/GeoJSON-to-Google-Maps
 * and http://www.geojson.org
*/
(function ($) {
  Drupal.behaviors.getlocations_leaflet_circles = {
    attach: function() {

      // bail out
      if (typeof Drupal.settings.getlocations_leaflet_geojson === 'undefined') {
        return;
      }

      $.each(Drupal.settings.getlocations_leaflet_geojson, function (key, settings) {

        // functions
        function onEachFeature(feature, layer) {
          // popup
          if (feature.properties && feature.properties.popup) {
            var geojson_content = '<div class="location vcard">' + feature.properties.popup + '</div>';
            layer.bindPopup(geojson_content);
          }
          // style
          if (feature.properties && feature.properties.style) {
            layer.setStyle(feature.properties.style);
          }
          // leaflet_id
          if (feature.properties.leaflet_id) {
            feature.layer._leaflet_id = feature.properties.leaflet_id;
          }
        }

        var geojson_data = settings.geojson_data;
        if (! geojson_data) {
          return;
        }
        var geojson_data_parsed = JSON.parse(geojson_data);

        L.geoJson(geojson_data_parsed, {
          onEachFeature: onEachFeature
        }).addTo(getlocations_leaflet_map[key]);


      }); // end each

    }
  };
}(jQuery));
