cb = new Ext.Application({

    launch: function() {
        new Ext.Panel({
            layout    : 'card',
            fullscreen: true,
            cardSwitchAnimation: 'slide',

            html: "Hello world!"
    
        });
    }

});