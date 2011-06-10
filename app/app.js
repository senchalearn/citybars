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
                        itemTpl:
                            '<img class="photo" src="{photo_url}" width="40" height="40"/>' +
                            '{name}<br/>' +
                            '<img src="{rating_img_url_small}"/>&nbsp;' +
                            '<small>{address1}</small>',
                        listeners: {
                            selectionchange: function (selectionModel, records) {
                                // if selection made, slide to detail card
                                if (records[0]) {
                                    cb.cards.setActiveItem(cb.cards.detailCard);
                                    cb.cards.detailCard.update(records[0].data);
                                }
                            }
                        }
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
    
                    //some useful references
                    var cards = this;
                    cards.listCard = cards.getComponent('listCard');
                    cards.dataList = cards.listCard.getComponent('dataList');
                    cards.detailCard = cards.getComponent('detailCard');

                    cards.setLoading(true); // get the spinner going
    
                    // then get the nearest city with that geolocation
                    cb.getCity(function (city) {
                        
                        // update status bar
                        cards.listCard.getDockedItems()[0].setTitle(city + ' ' + BUSINESS_TYPE);

                        // then use Yelp to get the businesses
                        cb.getBusinesses(city, function (store) {

                            // then bind data to list and show it
                            cards.dataList.bindStore(store);
                            cards.setActiveItem(cards.listCard);

                            cards.setLoading(false); // hide the spinner

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