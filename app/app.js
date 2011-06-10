cb = new Ext.Application({

    launch: function() {
        cb.cards = new Ext.Panel({
            layout    : 'card',
            fullscreen: true,
            cardSwitchAnimation: 'slide',

            items: [
                {
                    // the list card
                    id: 'listCard',
                    layout: 'fit',
                    dockedItems: [{
                        // main top toolbar
                        dock : 'top',
                        xtype: 'toolbar',
                        title: 'Please wait' // will get added once loaded
                    }],
                    items: {
                        // the list itself, gets bound to the store programmatically once it's loaded
                        id: 'dataList',
                        xtype: 'list',
                        store: null,
                        itemTpl: '{name}'
                    }
                }, {
                    // the details card
                    id: 'detailCard',
                    xtype: 'panel',
                    dockedItems: [{
                        // also has a toolbar
                        dock : 'top',
                        xtype: 'toolbar',
                        title: ''
                    }]
                }
            ],
    
    
            listeners: {
                'afterrender': function () {
                    // when the viewport loads, we go through a callback-centric sequence to load up:
                    // a) the name of the nearest city
                    // b) the local businesses from Yelp
    
                    // get the city, then...
                    cb.getCity(function (city) {

                        // then use Yelp to get the businesses
                        cb.getBusinesses(city, function (store) {

                            // just log for now
                            console.log(store.data.items);

                        });
                    });

                }
            }
    
        });
    },

    getCity: function (callback) {
        callback(DEFAULT_CITY);
        // this could be a geo lookup to get the nearest city
    },

    getBusinesses: function (city, callback) {
        // create data model
        Ext.regModel("Business", {
            fields: [
                {name: "id", type: "int"},
                {name: "name", type: "string"},
                {name: "latitude", type: "string"},
                {name: "longitude", type: "string"},
                {name: "address1", type: "string"},
                {name: "address2", type: "string"},
                {name: "address3", type: "string"},
                {name: "phone", type: "string"},
                {name: "state_code", type: "string"},
                {name: "mobile_url", type: "string"},
                {name: "rating_img_url_small", type: "string"},
                {name: "photo_url", type: "string"},
            ]
        });

        Ext.regStore("businesses", {
            model: 'Business',
            autoLoad: true,
            proxy: {
                // call Yelp to get business data
                type: 'scripttag',
                url: 'http://api.yelp.com/business_review_search' +
                    '?ywsid=' + YELP_KEY +
                    '&term=' + escape(BUSINESS_TYPE) +
                    '&location=' + escape(city)
                ,
                reader: {
                    type: 'json',
                    root: 'businesses'
                }
            },
            listeners: {
                // when the records load, fire the callback
                'load': function (store) {
                    callback(store);
                }
            }
        })
    }

});