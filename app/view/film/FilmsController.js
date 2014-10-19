Ext.define('Packt.view.film.FilmsController', {
    extend: 'Packt.view.base.ViewController',

    alias: 'controller.films',

    requires: [
        'Packt.view.film.FilmWindow'
    ],

    createDialog: function(record){

        var me = this,
            view = me.getView(),
            glyphs = Packt.util.Glyphs;

        me.isEdit = !!record;
        me.dialog = view.add({
            xtype: 'film-window',
            viewModel: {
                data: {
                    title: record ? 'Edit: ' + record.get('title') : 'Add Film',
                    glyph: record ? glyphs.getGlyph('edit') : glyphs.getGlyph('add')
                },
                links: {
                    currentFilm: record || {
                        type: 'Film',
                        create: true
                    }
                }
            },
            session: true //child session
        });

        me.dialog.show();
    },

    onSave: function(button, e, options){
        var me = this,
            dialog = me.dialog,
            form = me.lookupReference('filmForm'),
            isEdit = me.isEdit,
            session = me.getSession();
            id;

        if (form.isValid()) {
            if (!isEdit) {
                id = dialog.getViewModel().get('currentFilm').id;
            }
            dialog.getSession().save();
            if (!isEdit) {
                me.getStore('films').add(session.getRecord('Film', id));
            }
            me.onCancel();
        }

        me.viewSessionChanges();

        session.getChanges();
        var batch = session.getSaveBatch();
        console.log(batch);
        batch.start(0);
    },

    onAddActor: function(button, e, options){
        var me = this;
        me.searchActors = Ext.create('Packt.view.film.FilmSearchActor');
        me.dialog.add(me.searchActors);
    },

    onDeleteActor: function(button, e, options){
        var customerGrid = this.lookupReference('actorsGrid'),
            selection = customerGrid.getSelectionModel().getSelection()[0];

        selection.drop();
    },

    onCancelActors: function(button, e, options){
        var me = this;
        me.searchActors = Ext.destroy(me.searchActors);
    },

    onClearActors: function(button, e, options){
        this.lookupReference('comboActors').clearValue();
    },

    onSaveActors: function(button, e, options){
        var me = this,
            value = me.lookupReference('comboActors').getValue(),
            store = me.getStore('actors'),
            model = store.findRecord('actor_id', value),
            actorsGrid = me.lookupReference('actorsGrid'),
            actorsStore = actorsGrid.getStore();

        if (model){
            actorsStore.add(model);
        }

        me.onCancelActors();
    },


    activate: function(){
        var catSearch = this.lookupReference('categoriesMultiSelector').getSearch();

        console.log(catSearch);
    }
});
