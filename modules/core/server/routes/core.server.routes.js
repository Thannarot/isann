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
  // app.route('/action=graph-data&index=:index?').post(core.getGraphData);
  app.route('/action=get-tourism').post(core.getTourism);
  app.route('/action=get-hotel').post(core.getHotel);
  app.route('/action=get-resturant').post(core.getResturant);
  app.route('/action=get-cafe').post(core.getCafe);
  app.route('/get-placetype-list').post(core.getPlaceTypeList);
  app.route('/action=delete-place&pid=:pid?').post(core.deletePlace);

  app.post('/get-places', core.getPlaces);
  app.post('/get-province-list', core.getProvinceList);
  app.post('/get-township-list', core.getTownshipList);
  app.post('/get-city-list', core.getCityList);
  app.post('/get-detail', core.getDetail);
  app.post('/api/admin-login', core.validateAdminLogin);
  app.post('/filter-place', (req, res) => {
    core.filterPlace(req, res); 
  });

  app.post('/add-place', core.addNewPlace);
  app.post('/edit-place', core.editPlace);
  app.post('/add-home-img', core.addNewHomeImg);
  app.post('/edit-home-img', core.editHomeImg);
  app.post('/get-home-imgs', core.getHomeImgs);
  app.route('/action=delete-home-img&id=:id?').post(core.deleteHomeImg);

  // app.route('/action=add-place&pname=:pname&plat=:plat&plng=:plng&desc=:desc&entrance_fee=:entrance_fee&store=:store&cellular_net=:cellular_net&travel=:travel&agency=:agency&plocation=:plocation&gmap=:gmap&infosource=:infosource&photosource=:photosource&extralink=:extralink&facilities=:facilities&contactinfo=:contactinfo&ptype=:ptype?&adm1=:adm1?&adm2=:adm2?&adm3=:adm3?&rating=:rating?&imgfeatured=:imgfeatured?&facilitiesList=:facilitiesList&video=:video&photo1=:photo1&photo2=:photo2?&photo3=:photo3&photo4=:photo4&photo5=:photo5&photo6=:photo6&photo7=:photo7&photo8=:photo8&photo9=:photo9&photo10=:photo10').post(core.addNewPlace);
  // app.route('/action=edit-place&pid=:pid?&pname=:pname&plat=:plat&plng=:plng&desc=:desc&entrance_fee=:entrance_fee&store=:store&cellular_net=:cellular_net&travel=:travel&agency=:agency&plocation=:plocation&gmap=:gmap&infosource=:infosource&photosource=:photosource&extralink=:extralink&facilities=:facilities&contactinfo=:contactinfo&ptype=:ptype?&adm1=:adm1?&adm2=:adm2?&adm3=:adm3?&rating=:rating??&imgfeatured=:imgfeatured?&facilitiesList=:facilitiesList&video=:video&photo1=:photo1&photo2=:photo2&photo3=:photo3&photo4=:photo4&photo5=:photo5&photo6=:photo6&photo7=:photo7&photo8=:photo8&photo9=:photo9&photo10=:photo10').post(core.editPlace);

};

