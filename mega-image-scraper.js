'use strict';

var request = require('request');
var cheerio = require('cheerio');

var url = 'http://www.mega-image.ro/corporate/maps/map.php?t=1';

// Should permit to remove the 'rejectUnauthorized' option but doesn't work
//require('ssl-root-cas').inject();

request({ method: 'GET'
    , uri: url
    , gzip: true
    , "rejectUnauthorized": false
    }, function (error, response, body) {

  if (error) {
    throw error;
  }

  if (response.statusCode != 200) {
    throw response.statusCode;
  }

  var $ = cheerio.load(body);

  var stores = [];

/**
 * Typical structure of a store item caught by the crawler
 */

  // <div class="magazin_item" data-tip="1">
  //   <div class="title">13 SEPTEMBRIE</div>
  //   <div class="description">
  //     <div class="map_dialog">
  //       <h1>13 SEPTEMBRIE</h1>
  //       <div>
  //         <img src="../../_global_/images/magazine/13septembrie.png">
  //       </div>
  //       <hr>
  //       <div>Calea 13 Septembrie,  nr. 75-79, sector 5</div>
  //     </div>
  //   </div>
  //
  //   <div class="location vcard">
  // 		<span class="adr">
  // 			<span class="street-address">Calea 13 Septembrie,  nr. 75-79, sector 5</span>,
  // 			<span class="locality">Bucuresti</span>
  // 		</span>
  // 		<span class="geo">
  // 			<span class="latitude">
  // 				<span class="value-title" title="44.42464"></span>
  // 			</span>
  // 			<span class="longitude">
  // 				<span class="value-title" title="26.080652"></span>
  // 			</span>
  // 		</span>
  //  </div>
  // </div>

  $('div.magazin_item').each(function(){
    var $this = $(this);

    stores.push({
      title : $this.find('div.title').text()
      , address : $this.find('span.street-address').text()
      , city : $this.find('span.locality').text()
      , latitude : $this.find('span.latitude > span').attr('title')
      , longitude : $this.find('span.longitude > span').attr('title')

    });

  });

  console.log(stores);
})
