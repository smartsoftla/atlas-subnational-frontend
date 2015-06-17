import Ember from 'ember';
import ENV from '../config/environment';
const {RSVP} = Ember;
const {apiURL} = ENV;

export default Ember.Route.extend({
  model: function() {

    var productsMetadata = Ember.$.getJSON(apiURL+'metadata/products/');
    var locationsMetadata = Ember.$.getJSON(apiURL+'metadata/locations/');
    var productsHierarchy = Ember.$.getJSON(apiURL+'metadata/products/hierarchy?from_level=4digit&to_level=section');
    var industiesMetadata = Ember.$.getJSON(apiURL+'metadata/industries');

    var promises = [productsMetadata, locationsMetadata, productsHierarchy, industiesMetadata];

    return RSVP.allSettled(promises).then(function(array) {
      let productsMetadata = array[0].value.data;
      let locationsMetadata = array[1].value.data;
      let productMap = array[2].value.data;
      let industiesMetadata = array[3].value.data;

      _.forEach(productsMetadata, function(d) {
        d.group = productMap[d.product_id];
      });

      return { products: productsMetadata, locations: locationsMetadata, industries: industiesMetadata };
    });
  },
  actions: {
    rerender: function() {
      this.refresh();
    }
  }
});
