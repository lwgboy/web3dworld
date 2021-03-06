define(function (require, exports, module) {
    var static_url = '/static/';
    var $ = require('jquery');
    var _ = require('underscore');
    var helper = require('editor.helper');
    var Backbone = require('backbone');
    $(function () {
        var EditorPropertyView = Backbone.View.extend({
            template: _.template(_.unescape($("#propertyPanelContentHtmlTmpl").html())),
            initialize: function () {
                this.listenTo(this.model, 'meshSelected', this.handleSelected);
                this.listenTo(this.model, 'meshMoved', this.render);
                this.render();
            },
            handleSelected: function () {
                var selected = this.model.selected;
                this.render();
            },
            events: {
                'click .property-control-area .delete': 'deleteSelected'
            },
            deleteSelected: function () {
                if (this.model.selected) {
                    var selected = this.model.selected;
                    if (selected.name && selected.name != '') {
                        var editor = require('editor.app');
                        editor.sceneModelProxy.dispatchDeleteMesh(selected.name);
                    }
                }
            },
            render: function () {
                if (this.model.selected) {
                    var selected = this.model.selected;
                    var data = {mesh: selected};
                    this.$el.html(this.template(data));
                    for (var property in selected) {
						var recur = true;
						if(property === 'material') {
							recur = false;
						}
                        var view = helper.genControlForProperty(selected, property, selected[property], false, recur);
                        if (view) {
                            this.$(".property-list").append(view.el);
                        }
                    }
                    this.options.panel.doLayout();
                }
            }
        });
        exports.EditorPropertyView = EditorPropertyView;
        exports.editableProperties = ['position', 'scale', 'rotation', 'meshName', 'type', 'meshType', 'typeName', 'title', 'text',
            'visible', 'castShadow', 'receiveShadow', ['material', 'opacity'], ['material', 'texture'], 'opacity', 'translate', 'material', 'geometry'];
        exports.editableGeometryProperties = ['radius', 'width', 'height', 'depth', 'widthSegments', 'heightSegments', 'depthSegments', 'segmentsWidth', 'segmentsHeight', 'radiusTop', 'radiusBottom']; // TODO
    });
});