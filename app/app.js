cb = new Ext.Application({

    launch: function() {
        cb.cards = new Ext.Panel({
            layout    : 'card',
            fullscreen: true,
            cardSwitchAnimation: 'slide',

            html: "Hello world!"
    
        });
    }

});