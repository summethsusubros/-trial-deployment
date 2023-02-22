const User = require('../models/User');
const Product = require('../models/Product');
const Request = require('../models/Request');
const Platform = require('../models/Platform');
const Release = require('../models/Release');
const History = require('../models/History');
const Present = require('../models/Present'); 
const Data = require('../models/Data'); 
const Display = require('../models/Display'); 

const redis = require('redis-promisify')

const client = redis.createClient();
client.on("error", function (err) {
  console.log("Error " + err);
});


module.exports.index = (req, res) => {
  Release.find({}, "toolsVersion", (err, tools) => {
    if (err) return handleError(err);
      res.render('va/index',{title: 'Platform Tools', currentUser: req.user?req.user:"", tools: tools});
  });
}

module.exports.index2 = (req, res) => {

  var tools = req.params.tools.split('-').join(' ');
  var toolsReleaseArray = tools.split("+"); 
  var filter_tools = toolsReleaseArray[0];
  
  Release.find({}, "toolsVersion", (err, tools) => {
    if (err) return handleError(err);
    Release.findOne({toolsVersion: filter_tools}, "build", (err, release) => {
      if (err) return handleError(err);
      res.render('va/index2',{title: 'Platform Tools', currentUser: req.user?req.user:"", tools: tools,
       build_list: release.build, filter_tools: filter_tools, display: "", filter_build: "", version_details: {},
        rowId: "", platform: "", product: ""});
    });
  });
}

module.exports.post_index = (req, res) => {
  res.redirect('/index/view/' + req.body.toolsVersion.split(' ').join('-'));
}

module.exports.post_index2 =  (req, res) => {
  var tools = req.params.tools.split('-').join(' ');
  var filter_tools = tools.split("+")[0];
  console.log("body:")
  console.log(req.body);
  var build = req.body.build.split("+")[0];
  var code = parseInt(tools.split("+")[1]) + 0.01 * (parseInt(req.body.build.split("+")[1]));

  Release.find({}, "toolsVersion", (err, tools) => {
    if (err) return handleError(err);
    Release.findOne({toolsVersion: filter_tools}, "build", (err, release) => {
      if (err) return handleError(err);

        if(req.body.productInput){
          if (err) return console.log(err);
             client.get(`code:${code}`,async (error, redis_display_data) => {
              if(error) console.log(error);
              if(redis_display_data != null){
                console.log('display cache hit');

                client.get(`product:${req.body.productInput},version:${req.body.versionInput}`,async (error, redis_version_data) => {
                  if(error) console.log(error);
                  if(redis_version_data != null){
                    console.log('version cache hit');
                    res.render('va/index2',{title: 'Platform Tools', currentUser: req.user?req.user:"", tools: tools,
                    build_list: release.build, filter_tools: filter_tools, display: JSON.parse(redis_display_data), filter_build: build, version_details: JSON.parse(redis_version_data),
                    rowId: req.body.rowId, platform: req.body.platformInput, product: req.body.productInput});
                  } else {
                    console.log('version cache miss');
                    Product.findOne({name: req.body.productInput},"version", (err, product_details) => {
                      if (err) return console.log(err);
                      let version_details = product_details.version.filter(x => (x.name === req.body.versionInput))[0];                  
                      client.set(`product:${req.body.productInput},version:${req.body.versionInput}`,JSON.stringify(version_details));
                      res.render('va/index2',{title: 'Platform Tools', currentUser: req.user?req.user:"", tools: tools,
                      build_list: release.build, filter_tools: filter_tools, display: JSON.parse(redis_display_data), filter_build: build, version_details: version_details,
                      rowId: req.body.rowId, platform: req.body.platformInput, product: req.body.productInput});
                    });
                  }
                });

              } else {
                console.log('display cache miss');

                Display.find({code: code}, (err, data) => {
                  if (err) return console.log(err);
                  client.set(`code:${code}`,JSON.stringify(data));

                  client.get(`product:${req.body.productInput},version:${req.body.versionInput}`,async (error, redis_version_data) => {
                    if(error) console.log(error);
                    if(redis_version_data != null){
                      console.log('version cache hit');
                      res.render('va/index2',{title: 'Platform Tools', currentUser: req.user?req.user:"", tools: tools,
                      build_list: release.build, filter_tools: filter_tools, display: data, filter_build: build, version_details: JSON.parse(redis_version_data),
                      rowId: req.body.rowId, platform: req.body.platformInput, product: req.body.productInput});
                    } else {
                      console.log('version cache miss');
                      Product.findOne({name: req.body.productInput},"version", (err, product_details) => {
                        if (err) return console.log(err);
                        let version_details = product_details.version.filter(x => (x.name === req.body.versionInput))[0];                  
                        client.set(`product:${req.body.productInput},version:${req.body.versionInput}`,JSON.stringify(version_details));
                        res.render('va/index2',{title: 'Platform Tools', currentUser: req.user?req.user:"", tools: tools,
                        build_list: release.build, filter_tools: filter_tools, display: data, filter_build: build, version_details: version_details,
                        rowId: req.body.rowId, platform: req.body.platformInput, product: req.body.productInput});
                      });
                    }
                  });
                });
              }
            });
        } else {
          client.get(`code:${code}`,async (error, redis_display_data) => {
            if(error) console.log(error);
            if(redis_display_data != null){
              console.log('display cache hit');

              res.render('va/index2',{title: 'Platform Tools', currentUser: req.user?req.user:"", tools: tools,
              build_list: release.build, filter_tools: filter_tools, display: JSON.parse(redis_display_data), filter_build: build, version_details: {},
              rowId: "", platform: "", product: ""});
            } else {
              console.log('display cache miss');

              Display.find({code: code}, (err, data) => {
                if (err) return console.log(err);
                client.set(`code:${code}`,JSON.stringify(data));
                res.render('va/index2',{title: 'Platform Tools', currentUser: req.user?req.user:"", tools: tools,
                build_list: release.build, filter_tools: filter_tools, display: data, filter_build: build, version_details: {},
                rowId: "", platform: "", product: ""});
              });
            }
          });
        }
    });
  });
}

/*module.exports.post_index2 =  (req, res) => {
  console.log('got post request');
  var tools = req.params.tools.split('-').join(' ');
  var filter_tools = tools.split("+")[0];
  console.log("body:")
  console.log(req.body);
  var build = req.body.build.split("+")[0];
  var code = parseInt(tools.split("+")[1]) + 0.01 * (parseInt(req.body.build.split("+")[1]));

  Release.find({}, "toolsVersion", (err, tools) => {
    if (err) return handleError(err);
    Release.findOne({toolsVersion: filter_tools}, "build", (err, release) => {
      if (err) return handleError(err);
      if(build === 'All')
      Display.find({toolsRelease: filter_tools}, (err, data) => {
        if (err) return console.log(err);
        res.render('va/index2',{title: 'Platform Tools', currentUser: req.user?req.user:"", tools: tools,
          build_list: release.build, filter_tools: filter_tools, display: data, filter_build: build, version_details: {},
           rowId: "", platform: "", product: ""});
      });
      else
      {
        if(req.body.productInput){
          Display.find({code: code}, (err, data) => {
            if (err) return console.log(err);
             client.get(`product:${req.body.productInput},version:${req.body.versionInput}`,async (error, redis_data) => {
              if(error) console.log(error);
              if(redis_data != null){
                console.log('cache hit');
                res.render('va/index2',{title: 'Platform Tools', currentUser: req.user?req.user:"", tools: tools,
                build_list: release.build, filter_tools: filter_tools, display: data, filter_build: build, version_details: JSON.parse(redis_data),
                rowId: req.body.rowId, platform: req.body.platformInput, product: req.body.productInput});
              } else {
                console.log('cache miss');
                 Product.findOne({name: req.body.productInput},"version", (err, product_details) => {
                  if (err) return console.log(err);
                  let version_details = product_details.version.filter(x => (x.name === req.body.versionInput))[0];                  
                  client.set(`product:${req.body.productInput},version:${req.body.versionInput}`,JSON.stringify(version_details));
                  res.render('va/index2',{title: 'Platform Tools', currentUser: req.user?req.user:"", tools: tools,
                  build_list: release.build, filter_tools: filter_tools, display: data, filter_build: build, version_details: version_details,
                   rowId: req.body.rowId, platform: req.body.platformInput, product: req.body.productInput});
                });
              }
            });
            
          });
        }
        else{
          Display.find({code: code}, (err, data) => {
            if (err) return console.log(err);
            res.render('va/index2',{title: 'Platform Tools', currentUser: req.user?req.user:"", tools: tools,
              build_list: release.build, filter_tools: filter_tools, display: data, filter_build: build, version_details: {},
               rowId: "", platform: "", product: ""});
          });
        }
      }
    });
  });
}
 */

/*module.exports.post_index2 = (req, res) => {
  console.log('got post request');
  var tools = req.params.tools.split('-').join(' ');
  var filter_tools = tools.split("+")[0];
  console.log("body:")
  console.log(req.body);
  var build = req.body.build.split("+")[0];
  var code = parseInt(tools.split("+")[1]) + 0.01 * (parseInt(req.body.build.split("+")[1]));

  Release.find({}, "toolsVersion", (err, tools) => {
    if (err) return handleError(err);
    Release.findOne({toolsVersion: filter_tools}, "build", (err, release) => {
      if (err) return handleError(err);
      if(build === 'All')
      Display.find({toolsRelease: filter_tools}, (err, data) => {
        if (err) return console.log(err);
        res.render('va/index2',{title: 'Platform Tools', currentUser: req.user?req.user:"", tools: tools,
          build_list: release.build, filter_tools: filter_tools, display: data, filter_build: build, version_details: {},
           rowId: "", platform: "", product: ""});
      });
      else
      {
        if(req.body.productInput){
          Display.find({code: code}, (err, data) => {
            if (err) return console.log(err);
            Product.findOne({name: req.body.productInput},"version", (err, product_details) => {
              if (err) return console.log(err);
              let version_details = product_details.version.filter(x => (x.name === req.body.versionInput))[0];
              console.log("version_details",version_details);
              res.render('va/index2',{title: 'Platform Tools', currentUser: req.user?req.user:"", tools: tools,
              build_list: release.build, filter_tools: filter_tools, display: data, filter_build: build, version_details: version_details,
               rowId: req.body.rowId, platform: req.body.platformInput, product: req.body.productInput});
            });
          });
        }
        else{
          Display.find({code: code}, (err, data) => {
            if (err) return console.log(err);
            res.render('va/index2',{title: 'Platform Tools', currentUser: req.user?req.user:"", tools: tools,
              build_list: release.build, filter_tools: filter_tools, display: data, filter_build: build, version_details: {},
               rowId: "", platform: "", product: ""});
          });
        }
      }
    });
  });
} */
module.exports.get_index_history = (req, res) => {
  var filter_product = req.params.product.split('-').join(' ') ;
  var filter_platform = req.params.platform.split('-').join(' ') ;
  History.find({product: filter_product, platform: filter_platform}, (err, history) => {
    if (err) return handleError(err);
    res.render('va/history',{title: 'Configure', currentUser: req.user?req.user:"", history: history, filter_product: filter_product, filter_platform: filter_platform});
  });
}

module.exports.filter = (req, res) => {
      res.render('va/filterByProduct',{ title: 'Filter By Product', currentUser: req.user?req.user:""});
}

//-----------------------------------------------------//

module.exports.get_configure = (req, res) => {
  res.render('config/configure',{title: 'Configure', currentUser: req.user?req.user:""});
}

module.exports.get_ownership = (req, res) => {

  User.findOne({email: req.user.email}, "requested owned", (err, loggedInUser) => {
    if (err) return handleError(err);
    Product.find({}, "name version", (err, result) => {
      if (err) return handleError(err);
      res.render('config/ownership',{title: 'Configure', currentUser: req.user?req.user:"", product: result,requested: loggedInUser.requested, owned: loggedInUser.owned});
    });

  });

}

module.exports.get_product = (req, res) => {
  User.findOne({email: req.user.email}, "owned", (err, loggedInUser) => {
    if (err) return handleError(err);
      res.render('config/productVersion',{title: 'Configure', currentUser: req.user?req.user:"",owned: loggedInUser.owned});
  });
}

module.exports.get_product_details = (req, res) => {
  var filter_product = req.params.product.split('-').join(' ') ;
  User.findOne({email: req.user.email}, "owned", (err, loggedInUser) => {
    if (err) return handleError(err);
    Product.findOne({name: filter_product}, "name version", (err, result) => {
      if (err) return handleError(err);
      res.render('config/addProductVersion',{title: 'Configure', currentUser: req.user?req.user:"", owned: loggedInUser.owned, name: result.name, version: result.version });
    });
  });
}

module.exports.get_define = (req, res) => {
  User.findOne({email: req.user.email}, "owned", (err, loggedInUser) => {
    if (err) return handleError(err);
    Release.find({}, "toolsVersion", (err, tools) => {
      if (err) return handleError(err);
        res.render('config/defineRelationship',{title: 'Configure', currentUser: req.user?req.user:"", owned: loggedInUser.owned, tools: tools});
    });
  });
}

module.exports.get_define_details = (req, res) => {
  var tools = req.params.tools.split('-').join(' ');
  var toolsReleaseArray = tools.split("+"); 
  var filter_tools = toolsReleaseArray[0];
  var filter_product = req.params.product.split('-').join(' ');
  User.findOne({email: req.user.email}, "owned", (err, loggedInUser) => {
    if (err) return handleError(err);
    Release.find({}, "toolsVersion", (err, tools) => {
      if (err) return handleError(err);
      Release.findOne({toolsVersion: filter_tools}, "build", (err, release) => {
        if (err) return handleError(err);
        Platform.find({},"name", (err, platform_list) => {
          if (err) return handleError(err);
          Product.findOne({name: filter_product}, "version", (err, version_list) => {
            if (err) return handleError(err);    
            Present.find({product: filter_product}, (err, present_list) => {
              if (err) return handleError(err);
              res.render('config/addDefineRelationship',{title: 'Configure', currentUser: req.user?req.user:"", 
              filter_tools: filter_tools, filter_product, filter_product,
              owned: loggedInUser.owned, tools: tools, platform_list: platform_list, build_list: release.build,
              version_list: version_list.version, present_list: present_list});
            });
          });
        });
      });
    });
  });
}

module.exports.get_history = (req, res) => {
  var filter_product = req.params.product.split('-').join(' ') ;
  History.find({product: filter_product}, (err, history) => {
    if (err) return handleError(err);
    res.render('config/productHistory',{title: 'Configure', currentUser: req.user?req.user:"", history: history, filter_product: filter_product});
  });
}

module.exports.get_account = (req, res) => {
  User.findOne({email: req.user.email}, "owned", (err, loggedInUser) => {
    if (err) console.log(err);
    res.render('config/accountSettings',{title: 'Configure', currentUser: req.user?req.user:"", owned: loggedInUser.owned});
  });
}

module.exports.post_ownership = (req, res) => {
  if(Object.keys(req.body).length === 0)
    res.redirect('/configure/ownership');
  //-------------add request----------------------//
  if(req.body.addprod){
    var addprodlist = typeof(req.body.addprod) === 'object'?req.body.addprod:[req.body.addprod];
    for(var i = 0; i < addprodlist.length; i++){
      const request_instance = new Request({ product: addprodlist[i], email: req.user.email});
      request_instance.save((err) => {
        if (err) return handleError(err);
      });
    }
    User.findOneAndUpdate({email: req.user.email}, { $push: { requested: addprodlist } } , (err, result) => {
      if (err) return handleError(err); 
      res.redirect('/configure/ownership');
    });
    }
//--------------delete request-----------------------//
  if(req.body.delprod){
    var delprodlist = typeof(req.body.delprod) === 'object'?req.body.delprod:[req.body.delprod];
  for(var i = 0; i < delprodlist.length; i++){
    Request.deleteOne({ product: delprodlist[i], email: req.user.email}, (err, result) => {
      if (err) return handleError(err); 
    });
  }
  User.findOneAndUpdate({email: req.user.email}, { $pullAll: { requested: delprodlist } }, (err, result) => {
    if (err) return handleError(err);
    res.redirect('/configure/ownership');
  });
  }
}

module.exports.post_add_version = (req, res) => {
  var product = req.params.product.split('-').join(' ')  
  if(!req.body.deleteVersion) ///  add
  {
    Product.findOneAndUpdate({name: product}, { $pull: { version: {"name" : req.body.version}} }, (err, result) => {
      Product.findOneAndUpdate({name: product}, {$push: { version: {"name" : req.body.version, "major": req.body.majorVersion, "startdate": req.body.startDate,"enddate": req.body.endDate,"bitness": req.body.bitness, "downloadLink": req.body.downloadLink, "discription": req.body.discription, "location": req.body.location}} }, (err, result2) => {
       let version_details =  {"name" : req.body.version, 
                              "major": req.body.majorVersion, 
                              "startdate": req.body.startDate,
                              "enddate": req.body.endDate,
                              "bitness": req.body.bitness, 
                              "downloadLink": req.body.downloadLink, 
                              "discription": req.body.discription,
                              "location": req.body.location};
        client.set(`product:${product},version:${req.body.version}`,JSON.stringify(version_details));
        res.redirect('/configure/product/' + product);
        if (err) console.log(err);  
      });
      if (err) console.log(err); 
    });
  }
  
  if(req.body.deleteVersion) /// delete
    Product.findOneAndUpdate({name: product}, { $pull: { version: {"name" : req.body.deleteVersion}} }, (err, result) => {
      Display.deleteMany({product: product, version: req.body.deleteVersion}, (err, result) => {
        if(err) console.log(err);
      });
      Present.deleteMany({product: product, version: req.body.deleteVersion}, (err, result) => {
        if(err) console.log(err);
      });
      /*const history_instance = new History({code: -1, product: product, toolsRelease: "", build: "", 
        platform: "All Platform", version: req.body.deleteVersion, action: "Version removed from VA"});
      history_instance.save((err) => {
        if (err) console.log(err);
      });*/
      
      client.del(`product:${product},version:${req.body.deleteVersion}`);
      res.redirect('/configure/product/' + product);
      if (err) return handleError(err); 
  });
}

module.exports.post_define = (req, res) => {
  var toolsReleaseArray = req.body.toolsVersion.split("+"); 
  var toolsRelease = toolsReleaseArray[0];
  res.redirect('/configure/define/' + toolsRelease.split(' ').join('-') + '/' + req.body.product.split(' ').join('-'));
}

module.exports.post_commit = (req, res) => {
    var toolsReleaseArray = req.body.toolsVersion.split("+"); 
    var buildArray = req.body.build.split("+");
  
    var build = buildArray[0];
    var toolsRelease = toolsReleaseArray[0];

    var code = parseInt(toolsReleaseArray[1]) + 0.01 * (parseInt(buildArray[1]));

    //-------------------------------------------------------------------------------------------------------------------//

    Data.findOne({}, "codeArray", (err, result) => {
      if (err) return console.log(err);
      var codeArray = result.codeArray;

      console.log("codeArray")
      console.log(codeArray);

      codeArray.sort();

      console.log("codeArray")
      console.log(codeArray);

      codeArray = codeArray.filter(x => x >= code)

      console.log("codeArray")
      console.log(codeArray);

      for(let i = 0; i < codeArray.length; i++)
      {
        if(req.body.action === "Support"){
          const display_instance = new Display({code: codeArray[i], product: req.body.product,
            platform: req.body.platform, version: req.body.productVersion});
            display_instance.save((err) => {
            if (err) console.log(err);
          });
        }
    
        if(req.body.action === "Deprecate"){
          Display.findOneAndDelete({code: codeArray[i], product: req.body.product, 
            platform: req.body.platform, version: req.body.productVersion}, (err, result) => {
              if (err) return handleError(err); 
          }); 
        }
      }

    });

    //-------------------------------------------------------------------------------------------------------------------//

    const history_instance = new History({code: code, product: req.body.product, toolsRelease: toolsRelease, build: build, 
      platform: req.body.platform, version: req.body.productVersion, action: req.body.action});
    history_instance.save((err) => {
      if (err) console.log(err);
    });

    if(req.body.action === "Support"){
      const present_instance = new Present({code: code, product: req.body.product, toolsRelease: toolsRelease, build: build,
        platform: req.body.platform, version: req.body.productVersion});
        present_instance.save((err) => {
        if (err) console.log(err);
      });
    }

    if(req.body.action === "Deprecate"){
      Present.findOneAndDelete({product: req.body.product, platform: req.body.platform, version: req.body.productVersion}, (err, result) => {
          if (err) return handleError(err); 
      }); 
    }

    res.redirect('/configure/define/' + req.body.toolsVersion.split(' ').join('-') + '/' + req.body.product.split(' ').join('-'));
}

module.exports.post_history = (req, res) => {
  History.deleteOne({_id: req.body.historyId}, (err, history) => {
    if (err) return handleError(err);
    res.redirect('/configure/history/' + req.params.product);
  });
}
