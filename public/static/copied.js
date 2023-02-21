/*
app.get('/auth/google',
  passport.authenticate('google', { scope: [ 'email', 'profile' ] }
));

app.get( '/auth/google/callback',
  passport.authenticate( 'google', {
    successRedirect: '/configure',
    failureRedirect: '/auth/google/failure'
  })
);

app.get('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

app.get('/auth/google/failure', (req, res) => {
  res.send('Failed to authenticate..');
});
*/

/*
app.get('/', (req, res) => {

  if(req.user)
    User.findOne({email:req.user.email}, "role",  (err, result) => {
      if (err) return handleError(err);
      res.render('index', {title: 'Platform Tools',currentUser: req.user?req.user:"", role: result.role[0]});
    });
  else
    res.render('index', {title: 'Platform Tools',currentUser: req.user?req.user:"", role: ""});

});

app.get('/chart', (req, res) => {

  if(req.user)
    User.findOne({email:req.user.email}, "role",  (err, result) => {
      if (err) return handleError(err);
      res.render('chart',{title: 'Chart', currentUser: req.user?req.user:"", role: result.role[0]});
    });
  else
    res.render('chart',{title: 'Chart', currentUser: req.user?req.user:"", role: ""});

  
});

app.get('/filter', (req, res) => {

  if(req.user)
    User.findOne({email:req.user.email}, "role",  (err, result) => {
      if (err) return handleError(err);
      res.render('filterByProduct',{ title: 'Filter By Product', currentUser: req.user?req.user:"", role: result.role[0]});
    });
  else
    res.render('filterByProduct',{ title: 'Filter By Product', currentUser: req.user?req.user:"", role: ""});

});

app.get('/browser-support', (req, res) => {

  if(req.user)
    User.findOne({email:req.user.email}, "role",  (err, result) => {
      if (err) return handleError(err);
      res.render('browserSupport',{title: 'Browser Support', currentUser: req.user?req.user:"", role: result.role[0]});
    });
  else
    res.render('browserSupport',{title: 'Browser Support', currentUser: req.user?req.user:"", role: ""});

});

app.get('/configure', isLoggedIn, (req, res) => {

  if(req.user)
    User.findOne({email:req.user.email}, "role",  (err, result) => {
      if (err) return handleError(err);
      res.render('configure',{title: 'Configure', currentUser: req.user?req.user:"", role: result.role[0]});
    });
  else
    res.render('configure',{title: 'Configure', currentUser: req.user?req.user:"", role: ""});

});

*/

/* 
<html lang="en">
    <%- include("../partials/header.ejs") %>
    
    <body class="is-light" style="margin-left: 10%; margin-right: 10%;"> 
        <style>

            .card-container{
                display: flex; 
                justify-content: space-around;  
                flex-wrap: wrap;
                align-items: center;
            }
            .card-index{
                height: 250px; 
                width:250px; 
                padding:10px 10px 10px 20px;
                margin: 10px;
                
                box-shadow: 0px 0px 20px 2px lightgrey;
            }

            .card-index:hover{  
                border-color: #f80000;
            }
    
            .card-request-ownership{
                height:500px; 
                width:350px; 
                padding:10px;
                margin: 10px;
                
                box-shadow: 0px 0px 20px 2px lightgrey;
            }

            .tab-container{
                min-height: 700px;
                border: solid; 
                border-color: rgb(200, 200, 200); 
                border-width: 1px; 
                margin-top: 50px;
                border-radius: 4px;
            }

            .scroll-container{
                display: grid;
                grid-auto-flow: column;
                overflow: scroll;
                
                padding:10px;
                border:solid;
                border-color: rgb(200, 200, 200);
                border-radius: 6px; 
                margin:10px;
                
                justify-content: left;
            }

            .scroll-element{
                padding: 14px 40px;
                border-radius: 6px; 
                margin: 0px 10px;
                background-color: #f80000; /*linear-gradient(9deg, #f80000 , blue);
                text-align: center;
                display: inline-block;
                color: white;
                white-space: nowrap;
            }

            .scroll-element:hover{
                background: linear-gradient(9deg, blue , red);
            }


        </style>
    <%- include("../partials/nav.ejs") %>
    
    <div class="block tab-container">


        <section class="hero is-danger" style="background-color:#f80000; color:white; border-radius: 4px;">
            <nav class="tabs tabs is-toggle is-fullwidth is-normal">
                <div class="container">
                    <ul>
                    <li class="tab is-active" onclick="openTab(event,'index')"><a >Index</a></li>
                    <li class="tab" onclick="openTab(event,'ownership')"><a >Ownership</a></li>
                    <li class="tab" onclick="openTab(event,'productVersion')"><a >Product Version</a></li>
                    <li class="tab" onclick="openTab(event,'defineRelationship')"><a >Define Relationship</a></li>
                    <li class="tab" onclick="openTab(event,'supportedPlatforms')"><a >Supported Platforms</a></li>
                    <li class="tab" onclick="openTab(event,'browser')"><a >Browser</a></li>
                    <li class="tab" onclick="openTab(event,'accountSettings')"><a >Account Settings</a></li>
                    </ul>
                </div>
            </nav> 
        </section>
            
            
    
        <div class="container section" style="padding: 30px;">
            <div id="index" class="content-tab" >
                <div class="card-container">
                    <div class="card-index"  onclick="openTab(event,'ownership')">
                        <div style="text-align:center">
                            <p style="font-weight: bold;">My Product</p>
                        </div>
                        <hr class="navbar-divider">
                        <div style="padding:10px">
                            <ul style="list-style-type: square;">
                                <li>You can request ownership of products.</li>
                                <br>
                                <li>Monitor all the products you own.</li>
                            </ul>
                        </div>
                    </div>
                    <div class="card-index">

                        <div style="text-align:center">
                            <p style="font-weight: bold;">Add Product Version</p>
                        </div>
                        <hr class="navbar-divider">
                        <div style="padding:10px">
                            <ul style="list-style-type: square;">
                                <li>Update or remove details of existing product versions.</li>
                                <br>
                                <li>Add new products version into the system.</li>
                            </ul>
                        </div>
                    </div>
                    <div class="card-index">

                        <div style="text-align:center">
                            <p style="font-weight: bold;">Define Relationship</p>
                        </div>
                        <hr class="navbar-divider">
                        <div style="padding:10px">
                            <ul style="list-style-type: square;">
                                <li>Establish the relationship between a build, a platform and a product version</li>
                                <br>
                                <li>Alter already existing relationship</li>
                            </ul>
                        </div>
                    </div>
                    <div class="card-index">

                        <div style="text-align:center">
                            <p style="font-weight: bold;">Account Settings</p>
                        </div>
                        <hr class="navbar-divider">
                        <div style="padding:10px">
                            <ul style="list-style-type: square;">
                                <li>View the account details.</li>
                                <br>
                                <li>Reset the password of the account.</li>
                            </ul>
                        </div>
                    </div>
                </div> 
            </div>

            <div id="ownership" class="content-tab" style="display:none">
                <div class="card-container">
                    
                    <div class="card-request-ownership">
                        <div style="text-align:center">
                            <p style="font-weight: bold;">Request Ownership</p>
                        </div>
                        <hr class="navbar-divider">
                        <form style="padding:10px" method="POST">
                            <% product = product.filter(x => (!requested.includes(x.name) && !owned.includes(x.name))) %>
                            <% for(var i=0; i < product.length; i++) { %>
                                <div class="control">
                                    <input name="addprod" id="addprod" type="checkbox" value="<%= product[i].name %>"/>
                                    <label><%= product[i].name %></label>
                                </div>         
                            <% } %>
                                <div class="control">
                                    <button class="button is-info" type="submit">
                                     Request
                                    </button>
                                </div>
                        </form>
                    </div>
                    <div class="card-request-ownership">    
                        <div style="text-align:center">
                            <p style="font-weight: bold;">Awaiting Approval</p>
                        </div>
                        <hr class="navbar-divider">     
                        <form style="padding:10px" method="POST">
                            <div>
                                <% for(var i=0; i < requested.length; i++) { %>
                                    <div class="control">
                                        <input name="delprod" id="delprod" type="checkbox" value="<%= requested[i] %>"/>
                                        <label><%= requested[i] %></label>
                                    </div> 
                                <% } %>
                                <div class="control">
                                    <button class="button is-info" type="submit">
                                     Cancel Request
                                    </button>
                                </div>
                            </div>
                        </form>      
                    </div>
                    <div class="card-request-ownership">    
                        <div style="text-align:center">
                            <p style="font-weight: bold;">Owned Products</p>
                        </div>
                        <hr class="navbar-divider">   
                        <div style="padding:10px">           
                            <% for(var i=0; i < owned.length; i++) { %>
                                <div class="control">
                                    <label> <lord-icon src="https://cdn.lordicon.com/jvihlqtw.json" trigger="hover" style="width:16px;height:12px"></lord-icon> <span style="margin-left: 1px;"> <%= owned[i] %> </span> </label>
                                </div> 
                            <% } %>                         
                        </div>   
                    </div>
                    
                </div> 
            </div>

            <div id="productVersion" class="content-tab" style="display:none">
                <div class= "scroll-container">
                    <% for(var i = 0; i < owned.length; i++) { %>
                        <% var route = '/configure/' + owned[i].split(' ').join('-'); %>
                        <% console.log(route) %>
                        <div class="scroll-element"> 
                            <a href="<%= route %>" style="color:white"> <%= owned[i] %>  </a>
                        </div>
                    <% } %>
                </div>
                <br>
                <p style="font-weight:bold">Versions already in the system for</p>
                <p style="font-weight:bold">Versions already in the system</p>
                <div>
                    <form method="POST">
                        <input type="text" name="version">
                        <input type="text" name="majorVersion">
                        <input type="text" name="startDate">
                        <input type="text" name="endDate">
                        <button type="submit"> add version</button>
                    </form>
                    </form>
                    <table class="table">
                        <thead>
                          <tr>
                            <th>Version</th>
                            <th>Major Version</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                          </tr>
                        </thead>
                        <tbody>
                        <% for(var i = 0; i < productf.version.length; i++) { %>
                            <tr>
                              <th><%= productf.version[i].name %></th>
                              <td><%= productf.version[i].major %></td>
                              <td><%= productf.version[i].startdate %></td>
                              <td><%= productf.version[i].enddate %></td>
                            </tr>
                        <% } %> 
                        </tbody>
                    </table>
                </div>

            </div>

            <div id="defineRelationship" class="content-tab" style="display:none">
                <div>
                    <div class=" is-normal" style="display:inline-block; width: 200px; text-align: right; margin-right: 20px; padding-top: 7px;">
                        PT Major Version:
                    </div>
            
                    <div class="select is-normal" style="display:inline-block;">
                        <select>
                            <option>Select your option</option>
                            <option>With options"</option>
                        </select>
                    </div>
                </div> 
                <br>
                <div>
                    <div class=" is-normal" style="display:inline-block; width: 200px; text-align: right; margin-right: 20px; padding-top: 7px;">
                        People Tool Build:
                    </div>
        
                    <div class="select is-normal" style="display:inline-block;">
                        <select>
                            <option>Select your option</option>
                            <option>With options"</option>
                        </select>
                    </div>
                </div> 
                <br>
                <div>
                    <div class=" is-normal" style="display:inline-block; width: 200px; text-align: right; margin-right: 20px; padding-top: 7px;">
                        Platform:
                    </div>
            
                    <div class="select is-normal" style="display:inline-block;">
                        <select>
                            <option>Select your option</option>
                            <option>With options"</option>
                        </select>
                    </div>
                </div> 
                <br>
                <div>
                    <div class=" is-normal" style="display:inline-block; width: 200px; text-align: right; margin-right: 20px; padding-top: 7px;">
                        Product:
                    </div>
            
                    <div class="select is-normal" style="display:inline-block;">
                        <select>
                            <option>Select your option</option>
                            <option>With options"</option>
                        </select>
                    </div>
                </div> 
                <br>
            </div>

            <div id="supportedPlatforms" class="content-tab" style="display:none">
                <div>
                    <div class=" is-normal" style="display:inline-block; width: 200px; text-align: right; margin-right: 20px; padding-top: 7px;">
                        PeopleTools Version:
                    </div>
            
                    <div class="select is-normal" style="display:inline-block;">
                        <select>
                            <option>Select your option</option>
                            <option>With options"</option>
                        </select>
                    </div>
                </div> 
            </div>

            <div id="browser" class="content-tab" style="display:none">   
                <br>
                <div style="text-align: center;">You don't have the permission to adminster over Browser Support information. <a style="color: blue;">Click here</a> to raise a request.</div>
            </div>

            <div id="accountSettings" class="content-tab" style="display:none">
                <div>
                    <div class=" is-normal" style="display:inline-block; width: 200px; text-align: right; margin-right: 20px; padding-top: 7px;">
                        Name: 
                    </div>
            
                    <div class=" is-normal" style="display:inline-block;">
                        <%= currentUser.name %>
                    </div>
                </div> 
                <div>
                    <div class=" is-normal" style="display:inline-block; width: 200px; text-align: right; margin-right: 20px; padding-top: 7px;">
                        E-mail: 
                    </div>
            
                    <div class=" is-normal" style="display:inline-block;">
                        <%= currentUser.email %>
                    </div>
                </div> 
            </div>
        </div>
            
                
    </div> 

    <script>
        function openTab(evt, tabName) {
            var i, x, tablinks;
            x = document.getElementsByClassName("content-tab");
            for (i = 0; i < x.length; i++) {
                x[i].style.display = "none";
            }
            tablinks = document.getElementsByClassName("tab");
            for (i = 0; i < x.length; i++) {
                tablinks[i].className = tablinks[i].className.replace(" is-active", "");
            }
            document.getElementById(tabName).style.display = "block";
            evt.currentTarget.className += " is-active";
        }
    </script>
            
    <%- include("../partials/footer.ejs") %>
    </body>
</html>
*/
/*
<form method="POST">
<div style="border: solid; padding: 20px 20px;display: flex; justify-content: flex-start;  flex-wrap: wrap;gap: 10px; align-items: center;" >
    <div >
        <div class=" is-normal" style="display:inline-block;  text-align: right; margin-right: 10px; padding-top: 7px;">
            Product:
        </div>

        <div class="select is-normal" style="display:inline-block;">
        <select id= "product" name="product" onchange="populateTable('product')">
            <% for(var i = 0; i < owned.length; i++) { %>
                <% if( owned[i] === filter_product) {%>
                    <option selected><%= owned[i]%></option>
                <%} else {%>
                    <option><%= owned[i]%></option>
                <%} %>
            <% } %>
        </select>
        </div>
    </div>   
    <div >
        <div class=" is-normal" style="display:inline-block;  text-align: right; margin-right: 10px;  padding-top: 7px;">
            Tools Version:
        </div>

        <div class="select is-normal" style="display:inline-block;">
            <select id="toolsVersion" name="toolsVersion" onchange="populateTable('toolsVersion')">
                <% for(var i = 0; i < tools.length; i++) { %>
                    <% if( tools[i].toolsVersion === filter_tools) {%>
                        <option selected><%= tools[i].toolsVersion%></option>
                    <%} else {%>
                        <option><%= tools[i].toolsVersion%></option>
                    <%} %>
                <% } %>
            </select>
        </div>
    </div>   
    <div >
        <button class="button" type="submit" formaction="/configure/define/redirect">Confrim Selection</button>
    </div>  

</div>
</form>  

<div style="border: solid; padding: 20px 20px;display: flex; 
    justify-content: flex-start;  
    flex-wrap: wrap;
    gap: 10px;
    align-items: center;" >

    <div>
        <div class=" is-normal" style="display:inline-block; text-align: right; margin-right: 10px;  padding-top: 7px;">
            Build:
        </div>

        <div class="select is-normal" style="display:inline-block;">
            <select id="build" name="build" onchange="populateTable('build')">
                <option disabled hidden selected> Select Build </option>
                <% for(var i = 0; i < build_list.length; i++) { %>
                    <option><%= build_list[i]%></option>
                <% } %>
            </select>
        </div>
    </div> 
    
    <div>
        <div class=" is-normal" style="display:inline-block; text-align: right; margin-right: 10px;  padding-top: 7px;">
            Platform:
        </div>

        <div class="select is-normal" style="display:inline-block;">
            <select id="platform" name="platform" onchange="populateTable('platform')">
                <option disabled hidden selected> Select Platform </option>
                <% for(var i = 0; i < platform_list.length; i++) { %>
                    <option><%= platform_list[i].name %></option>
                <% } %>
            </select>
        </div>
    </div>
    
    <div>
        <div class=" is-normal" style="display:inline-block; text-align: right; margin-right: 10px;  padding-top: 7px;">
            Version:
        </div>

        <div class="select is-normal" style="display:inline-block;">
            <select id="productVersion" name="productVersion" onchange="populateTable('productVersion')">
                <option disabled hidden selected> Select Product Version </option>
                <% for(var i = 0; i < version_list.length; i++) { %>
                    <option><%= version_list[i].name %></option>
                <% } %>
            </select>
        </div>
    </div>

    
        <div >
            <button class="button" type="submit" formaction="/configure/define/redirect">Confrim Selection</button>
        </div>  
    
</div>
*/
/*
<form method="POST">
    <nav class="level" style="border: solid; padding: 20px 20px;" >

    <div class="level-item">
        <div class=" is-normal" style="display:inline-block; text-align: right; margin-right: 10px;">
            Product:
        </div>

        <div class="select is-normal" style="display:inline-block;">
            <select name="product">
                <option disabled hidden selected> Select Product </option>
                <% for(var i = 0; i < owned.length; i++) { %>
                    <option><%= owned[i]%></option>
                <% } %>
            </select>
        </div>
    </div> 
    
    <div class="level-item">
        <div class=" is-normal" style="display:inline-block; text-align: right; margin-right: 10px;">
            Tools Version:
        </div>

        <div class="select is-normal" style="display:inline-block;">
            <select name="toolsVersion">
                <option disabled hidden selected> Select Tools Version </option>
                <% for(var i = 0; i < tools.length; i++) { %>
                    <option><%= tools[i].toolsVersion %></option>
                <% } %>
            </select>
        </div>
    </div>
    
    <div class="level-item">
        <div class=" is-normal" style="display:inline-block; text-align: right;">
        </div>
        <div class=" is-normal" style="display:inline-block;">
            <button class="button" type="submit" formaction="/configure/define/redirect">Confrim Selection</button>
        </div>  
    </div>

    </nav>
</form>    
*/ 