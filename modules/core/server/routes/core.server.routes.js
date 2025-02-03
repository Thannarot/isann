'use strict';

module.exports = function (app) {
  // Root routing
  var core = require('../controllers/core.server.controller');

  // Define error pages
  app.route('/server-error').get(core.renderServerError);

  // Return a 404 for all undefined api, module or lib routes
  app.route('/:url(api|modules|lib)/*').get(core.renderNotFound);

  // Define application route
  app.route('/*').get(core.renderIndex);

  // APIs
  // app.route('/action=map-data&index=:index?&timeFrequency=:timeFrequency&date=:date?').post(core.getMapData);
  //
  // app.route('/action=graph-data&index=:index?').post(core.getGraphData);
  app.route('/action=get-places').post(core.getPlaces);
  app.route('/action=get-tourism').post(core.getTourism);
  app.route('/action=get-hotel').post(core.getHotel);
  app.route('/action=get-resturant').post(core.getResturant);
  app.route('/action=get-province-list').post(core.getProvinceList);
  app.route('/action=get-city-list&prov_id=:prov_id?').post(core.getCityList);
  app.route('/action=get-township-list&dist_id=:dist_id?').post(core.getTownshipList);
  app.route('/action=get-placetype-list').post(core.getPlaceTypeList);
  app.route('/action=get-detail&pid=:pid?').post(core.getDetail);
  app.route('/action=delete-place&pid=:pid?').post(core.deletePlace);
  app.post('/api/admin-login', core.validateAdminLogin);
  app.post('/action=filter-place', (req, res) => {
    console.log("Received parameters:", req.query); // Debugging log
    core.filterPlace(req, res); 
});

  app.route('/action=add-place&pname=:pname&plat=:plat&plng=:plng&desc=:desc&entrance_fee=:entrance_fee&store=:store&cellular_net=:cellular_net&travel=:travel&agency=:agency&plocation=:plocation&gmap=:gmap&infosource=:infosource&photosource=:photosource&extralink=:extralink&facilities=:facilities&contactinfo=:contactinfo&ptype=:ptype?&adm1=:adm1?&adm2=:adm2?&adm3=:adm3?&rating=:rating?&imgfeatured=:imgfeatured?&facilitiesList=:facilitiesList&audio=:audio').post(core.addNewPlace);
  app.route('/action=edit-place&pid=:pid?&pname=:pname&plat=:plat&plng=:plng&desc=:desc&entrance_fee=:entrance_fee&store=:store&cellular_net=:cellular_net&travel=:travel&agency=:agency&plocation=:plocation&gmap=:gmap&infosource=:infosource&photosource=:photosource&extralink=:extralink&facilities=:facilities&contactinfo=:contactinfo&ptype=:ptype?&adm1=:adm1?&adm2=:adm2?&adm3=:adm3?&rating=:rating??&imgfeatured=:imgfeatured?&facilitiesList=:facilitiesList&audio=:audio').post(core.editPlace);

};
