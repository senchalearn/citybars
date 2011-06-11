cb = new Ext.Application({

    launch: function() {
        new Ext.Panel({
            layout    : 'card',
            fullscreen: true,

            html: "Hello world!"
    
        });
    }

});