
var forms = require("forms");
var fields = forms.fields,
    validators = forms.validators,
    widgets = forms.widgets;

var bootstrap_field = function (name, object) {
    var label = object.labelHTML(name);
    var error = object.error ? '<p class="form-error-tooltip">' + object.error + '</p>' : '';
    var widget = '<div class="col-lg-10">' + object.widget.toHTML(name, object) + error + '</div>';
    return '<div class="form-group ' + (error !== '' ? 'has-error' : '')  + '">' + label + widget + '</div>';
};

exports.toHTML = function(form){
    return form.toHTML(function (name, object) { return bootstrap_field(name, object); })
};

exports.register = function(){
    return forms.create({
        name: fields.string({
            required: true,
            widget: widgets.text({ classes: ['form-control', 'input-with-feedback'] }),
            errorAfterField: true,
            cssClasses: {
                label: ['control-label col col-sm-2']
            }
        }),
        username: fields.string({
            required: true,
            widget: widgets.text({ classes: ['form-control', 'input-with-feedback'] }),
            errorAfterField: true,
            cssClasses: {
                label: ['control-label col-sm-2']
            }
        }),
        email: fields.email({
            required: true,
            widget: widgets.email({ classes: ['form-control', 'input-with-feedback'] }),
            errorAfterField: true,
            cssClasses: {
                label: ['control-label col-sm-2']
            }
        }),
        password: fields.password({
            required: true,
            widget: widgets.password({ classes: ['form-control', 'input-with-feedback'] }),
            errorAfterField: true,
            cssClasses: {
                label: ['control-label col-sm-2']
            }
        }),
        confirm: fields.password({
            required: true,
            widget: widgets.password({ classes: ['form-control', 'input-with-feedback'] }),
            errorAfterField: true,
            cssClasses: {
                label: ['control-label col-sm-2']
            },
            validators: [validators.matchField('password')]
        })
    })
};

exports.skills = function(){
    return forms.create({
        department: fields.string({
            required: true,
            widget: widgets.text({ classes: ['form-control', 'input-with-feedback'] }),
            errorAfterField: true,
            cssClasses: {
                label: ['control-label col col-sm-2']
            }
        }),
        func: fields.string({
            label:'Function',
            required: true,
            widget: widgets.text({ classes: ['form-control', 'input-with-feedback'] }),
            errorAfterField: true,
            cssClasses: {
                label: ['control-label col-sm-2']
            }
        }),
        tools: fields.array({
            required: true,
            widget: widgets.multipleCheckbox({classes: ['form-control', 'input-with-feedback'] }),
            errorAfterField: true,
            choices:['Hello','World'],
            cssClasses: {
                label: ['control-label col-sm-2']
            }
        }),
        skills: fields.array({
            required: true,
            widget: widgets.text({ classes: ['form-control', 'input-with-feedback'] }),
            errorAfterField: true,
            cssClasses: {
                label: ['control-label col-sm-2']
            }
        })
    })
};