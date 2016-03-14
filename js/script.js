
console.log(Backbone)

//global variables

var apiKey = "?api_key=6lzngc5pqpoufi9bvrt6zupg"

var fullUrl = "https://openapi.etsy.com/v2/listings/active.js" + apiKey + "&includes=Images&callback=?"
//ChangeView------------------------------------------
// var changeView = function(clickEvent) {
//     var button = clickEvent.target,
//         id = button.value
//     window.location.hash = "detail/" + id 
//     handleDetailView(id)
// }



///


var model = Backbone.Model.extend({
    _generateURL: function() {
        this.url = fullUrl
    }
})


 var detailModel = Backbone.Model.extend({
   _generateURL: function(id) {
       this.url = "https://openapi.etsy.com/v2/listings/" + id + ".js" + apiKey + "&includes=Images&callback=?"
       console.log(this.url)

    }
 })



//Daily View-----------------------------------------
var DetailView = Backbone.View.extend({

    el: "#container",

    initialize: function(inputModel) {
        this.model = inputModel
        var boundRender = this._render.bind(this)
        this.model.on("sync", boundRender)
    },

    _render: function() {
        var data = this.model.attributes.results[0]
        console.log(data)
       
        var newHtmlString = ''
            newHtmlString += '<div class = "detail"> <div class = "words"> <h1>Price:</h1><h2> $' + data.price + '</h2><h1> When Made:</h1><h2> ' + data.when_made + ' </h2><h1> Quantity: </h1><h2>' + data.quantity + ' </h2><h1> Who Made: </h1><h2> ' + data.who_made + ' </h2><h1> User ID:</h1><h2> ' + data.user_id + '</h2></div><div class = "image"> <img class = "detailImage" src="' + data.Images[0].url_570xN + '"></div></div>'
        this.el.innerHTML = newHtmlString

    }
})


//Current View------------------------------
var listView = Backbone.View.extend({
    el: "#container",

    initialize: function(inputModel) {
        this.model = inputModel
        var boundRender = this._render.bind(this)
        this.model.on("sync", boundRender)
    },

    events: { 
        "click img": "_triggerDetailView"

    },

    _triggerDetailView: function(clickEvent) {
        console.log(clickEvent.target)
        var item = clickEvent.target
        

       var id = item.id

       console.log(id)
       
        window.location.hash = "detail/" + id  //<= adding each id to the URL after the hash in order to inform the Router to change the view
    },

    _render: function() {
    	var data = this.model.attributes.results
        console.log(data)
        var newHtmlString = ''
        for (var i = 0; i < 25; i++) {
        	var dataObject = data[i]
            newHtmlString += '<div class = "object"><div class = "objectTitle">' + dataObject.title + '</div><img id = "' + dataObject.listing_id +  '" src="' + dataObject.Images[0].url_570xN + '"></div>'
            // 


    // 
            // for (var i= 0; i < dataObject.Images.length; i ++) {
            // 	 newHtmlString += '<div class = "image">' + dataObject.Images[i] + '</div>'
            // }
        }
        this.el.innerHTML = newHtmlString
    }
})


///----Router----with Backbone extend//

var etsyRouter = Backbone.Router.extend({
    routes: {
        "detail/:id": "handleDetailView",
        "*default": "handleListView"
    },

//get current data
    handleListView: function() {
        var m = new model()
        m._generateURL()
        var cv = new listView(m)
        m.fetch()
        console.log(cv)
        console.log(JSON)

    },


    handleDetailView: function(id) {
        var m = new detailModel(id)
        m._generateURL(id)
        var cv = new DetailView(m)
        m.fetch()

    },

    initialize: function() {
        Backbone.history.start()

    }
})
//





//query Selectors//
var container = document.querySelector("#container")
var buttonsContainer = document.querySelector("#buttons")


//


var rtr = new etsyRouter()