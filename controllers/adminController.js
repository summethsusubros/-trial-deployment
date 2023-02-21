const User = require('../models/User');
const Product = require('../models/Product');
const Request = require('../models/Request');
const Release = require('../models/Release');
const Platform = require('../models/Platform');
const Data = require('../models/Data');
const Display = require('../models/Display');

module.exports.getAdministrate = (req, res) => {
    Request.find({}, "product email", (err, request_list) => {
      if (err) return handleError(err);
      User.find({ "role.1" : { "$exists": true } }, "email" , (err, admin_list) => {
        if (err) return handleError(err);
          Product.find({},"name", (err, product_list) => {
            if (err) return handleError(err);
             Platform.find({},"name", (err, platform_list) => {
               if (err) return handleError(err);
                Release.find({},"toolsVersion", (err, release_list) => {
                  if (err) return handleError(err);
                  res.render('admin/administrate',{title: 'Administrate', currentUser: req.user?req.user:"",
                  request_list: request_list, admin_list: admin_list, product_list: product_list, 
                  platform_list: platform_list, release_list: release_list, build_list: [], filter_tools: ""});
                });
             });
          });
      });
    });
}

module.exports.postAdministrateAddProducts = (req, res) => {
  if(!req.body.product_name)
    res.redirect('/administrate');

  if(req.body.product_name){
    let name = req.body.product_name;
    Product.exists({name: name}, function (err, doc) {
      if (err) console.log(err);
      else{
        if(doc)
        res.redirect('/administrate');
        else{
          const product_instance = new Product({ name: name});
          product_instance.save((err) => {
            if (err) console.error(err);
          });
          res.redirect('/administrate');
        }
      }
    });
  }
}

module.exports.postAdministrateAddAdmin = (req, res) => {
  if(!req.body.admin_email)
    res.redirect('/administrate');
  if(req.body.admin_email){
    User.findOneAndUpdate({email: req.body.admin_email}, {$pull: { role: 'admin' } } , (err, result) => {
        if (err) return handleError(err);
        User.findOneAndUpdate({email: req.body.admin_email}, {$push: { role: 'admin' } } , (err, result) => {
          if (err) return handleError(err);
      });
    });
    res.redirect('/administrate');
  }
}

module.exports.postAdministrateApproveManager = (req, res) => {
  User.findOneAndUpdate({email: req.body.email}, {$push: { owned: req.body.product } , $pull: { requested: req.body.product } } , (err, loggedInUser) => {
    if (err) return handleError(err);
  });
  Request.deleteOne({ product: req.body.product, email: req.body.email}, (err, result) => {
    if (err) return handleError(err); 
  });
  res.redirect('/administrate');
}

module.exports.postAdministrateDeclineManager = (req, res) => {
  User.findOneAndUpdate({email: req.body.email}, { $pull: { requested: req.body.product } } , (err, loggedInUser) => {
    if (err) return handleError(err);
  });
  Request.deleteOne({ product: req.body.product, email: req.body.email}, (err, result) => {
    if (err) return handleError(err); 
  });
  res.redirect('/administrate');
}

module.exports.postAdministrateAddPlatforms = (req, res) => {
  if(!req.body.platform_name)
    res.redirect('/administrate');
  if(req.body.platform_name){
    let name = req.body.platform_name;
    Platform.exists({name: name}, function (err, doc) {
      if (err) console.log(err);
      else{
        if(doc)
          res.redirect('/administrate/#platform_name');  
        else{
          const platform_instance = new Platform({ name: name});
          platform_instance.save((err) => {
            if (err) console.log(err);
          });
          res.redirect('/administrate/#platform_name');
        }
      }
    });
  }
}

module.exports.postAdministrateAddTools = (req, res) => {
  if(!req.body.tools_name)
    res.redirect('/administrate');

  if(req.body.tools_name){
    let name = req.body.tools_name;
    Release.exists({toolsVersion: name}, function (err, doc) {
      if (err) console.log(err);
      else{
        if(doc)
          res.redirect('/administrate/#tools_name'); 
        else{
          Release.countDocuments({} ,function(err, count){
            const release_instance = new Release({ toolsVersion: name, build: [], releaseCode: count + 1});
            release_instance.save((err) => {
              if (err) return console.log(err);
            });
          });
          res.redirect('/administrate/#tools_name');
        }
      }
    });
  }
}

module.exports.postAdministratePreAddBuilds = (req, res) => {

  let filter_tools = req.body.tools_version.split("+")[0];
  Request.find({}, "product email", (err, request_list) => {
    if (err) return handleError(err);
    User.find({ "role.1" : { "$exists": true } }, "email" , (err, admin_list) => {
      if (err) return handleError(err);
        Product.find({},"name", (err, product_list) => {
          if (err) return handleError(err);
           Platform.find({},"name", (err, platform_list) => {
             if (err) return handleError(err);
              Release.find({},"toolsVersion", (err, release_list) => {
                if (err) return handleError(err);
                Release.findOne({toolsVersion: filter_tools}, (err, builds) => {
                  if (err) return handleError(err);
                  console.log(builds)
                  res.render('admin/administrate',{title: 'Administrate', currentUser: req.user?req.user:"",
                  request_list: request_list, admin_list: admin_list, product_list: product_list, 
                  platform_list: platform_list, release_list: release_list, build_list: builds.build, filter_tools: filter_tools});
                });
              });
           });
        });
    });
  });
}

module.exports.postAdministrateAddBuilds = (req, res) => {
  if(!req.body.build_name)
   res.redirect('/administrate');

  if(req.body.build_name){
    let name = req.body.build_name;
    var toolsReleaseArray = req.body.tools_version.split("+"); 
    let toolsVersion = toolsReleaseArray[0];
    Release.findOneAndUpdate({toolsVersion: toolsVersion}, { $pull: { build: name } }, (err, result1) => {
      if (err) return console.log(err);
      Release.findOneAndUpdate({toolsVersion: toolsVersion}, { $push: { build: name } }, (err, result2) => {
      if (err) return console.log(err);
      let code = result2.releaseCode + (0.01 * (result2.build.length + 1));
      Data.countDocuments({},  (err, count) => {
        if (err) return console.log(err);
        if(count)//ANY build exist
        {

          Data.findOneAndUpdate({}, { $pull: { codeArray: code } },(err, coderesult1) => {
            if (err) return console.log(err);
            Data.findOneAndUpdate({}, { $push: { codeArray: code } },(err, coderesult2) => {
              if (err) return console.log(err);
            });
          });

          Display.countDocuments({code: code},  (err, exist) => {
            if (err) return console.log(err);
            if(exist){
              //do nothing
            }
            else{
              Data.findOne({}, "codeArray", (err, result) => {
                if (err) return console.log(err);
                var codeArray = result.codeArray;
    
                codeArray.sort();
                codeArray = codeArray.filter(x => x < code)
    
                if(codeArray.length == 0){
    
                }
                else{
                  let targetcode = codeArray[codeArray.length - 1];
                  Display.find({code: targetcode}, (err, targetresult) => {
                    if (err) return console.log(err);
                    console.log("targetresult:", targetresult);
                    for(var i = 0; i < targetresult.length; i++){
                      const display_instance = new Display({code: code, product: targetresult[i].product,
                        platform: targetresult[i].platform, version: targetresult[i].version});
                        display_instance.save((err) => {
                        if (err) console.log(err);
                      });
                    }
                  });
                }
              });
            }
          });
        }
        else// first build code to be inserted
        {
          const data_instance = new Data({codeArray: [code]});
          data_instance.save((err) => {
            if (err) return console.log(err);
          });
        }
      res.redirect('/administrate/#tools_version');
      });
    });
    });
  }
}

