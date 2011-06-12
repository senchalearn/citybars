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
                    items: [{
                        // the list itself, gets bound to the store programmatically once it's loaded
                        id: 'dataList',
                        xtype: 'list',
                        store: null,
                        itemTpl: '{name}'
                    }]
                }, {
                    // the details card
                    id: 'detailCard',
                    dockedItems: [{
                        // also has a toolbar
                        dock : 'top',
                        xtype: 'toolbar',
                        title: ''
                    }]
                }
            ]
    
        });
    }

});