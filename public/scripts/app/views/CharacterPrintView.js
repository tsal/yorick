// Category View
// =============

/* global _ */
// Includes file dependencies
define([
	"jquery",
	"backbone",
    "text!../templates/character-print-view.html",
    "../helpers/VampirePrintHelper",
    "marionette",
    "text!../templates/character-print-parent.html",
    "text!../templates/print/blood.html",
    "text!../templates/print/morality.html",
    "text!../templates/print/willpower.html",
    "text!../templates/print/health-levels.html",
], function(
    $,
    Backbone,
    character_print_view_html,
    VampirePrintHelper,
    Marionette,
    character_print_parent_html,
    blood_html,
    morality_html,
    willpower_html,
    health_levels_html
) {

    // Extends Backbone.View
    var View = Backbone.View.extend( {

        // The View Constructor
        initialize: function() {
            var self = this;
            self.base_abilities = [];
            self.base_abilities.push(["Academics", "Animal Ken", "Athletics", "Awareness", "Brawl", "Computer", "Crafts", "Dodge", "Drive"]);
            self.base_abilities.push(["Empathy", "Firearms", "Intimidation", "Investigation", "Leadership", "Linguistics", "Lore", "Medicine", "Melee", "Occult"]);
            self.base_abilities.push(["Performance", "Science", "Security", "Stealth", "Streetwise", "Subterfuge", "Survival"]);
            self.base_abilities = _.flatten(self.base_abilities);
            
            _.bindAll(this,
                "format_simpletext",
                "format_attribute_value",
                "format_attribute_focus",
                "format_skill",
                "format_specializations"
            );
        },

        // Renders all of the Category models on the UI
        render: function() {

            var character = this.character;
            var sortedSkills = character.get_sorted_skills();
            var groupedSkills = character.get_grouped_skills(sortedSkills, 3);

            // Sets the view's template property
            this.template = _.template(character_print_view_html)(
                {
                    "character": this.character,
                    "skills": sortedSkills,
                    "groupedSkills": groupedSkills,
                    format_simpletext: this.format_simpletext,
                    format_attribute_value: this.format_attribute_value,
                    format_attribute_focus: this.format_attribute_focus,
                    format_skill: this.format_skill,
                    format_specializations: this.format_specializations,
                } );

            // Renders the view's template inside of the current listview element
            this.$el.find("div[role='main']").html(this.template);

            // Maintains chainability
            return this;

        }

    } );

    _.extend(View.prototype, VampirePrintHelper);
    
    var HeaderView = Marionette.ItemView.extend({
        template: _.template('<h1 class="ui-bar ui-bar-a"><%= format_simpletext("name") %></h1>'),
        templateHelpers: function() {
            var self = this;
            return {
                format_simpletext: self.format_simpletext
            }
        },
        initialize: function() {
            _.bindAll(this,
                "format_simpletext",
                "format_attribute_value",
                "format_attribute_focus",
                "format_skill",
                "format_specializations"
            );
        }
    });
    _.extend(HeaderView.prototype, VampirePrintHelper);
    
    var TextBarView = Marionette.ItemView.extend({
        className: "ui-grid-b ui-responsive",
        template: function(serialized_model) {
            var self = this;
            var tmpl = _.map(self.fields, function(field, i) {
                if (serialized_model[field]) {
                    return '<div class="ui-block-' + String.fromCharCode(97 + i) + '">\
                                <h2 class="ui-bar ui-bar-a">' + _.capitalize(field) + ': <%= format_simpletext("' + field + '") %></h2>\
                            </div>'
                }
            })
            tmpl = _.without(tmpl, undefined);
            tmpl = _.template(tmpl.join(""));
            return tmpl(serialized_model);
        },
        templateHelpers: function() {
            var self = this;
            return {
                format_simpletext: self.format_simpletext
            }
        },
        initialize: function(options) {
            var self = this;
            this.fields = options.fields || ["clan", "archetype", "antecedence"]
            
            _.each(this.fields, function (field) {
                self.listenTo(self.model, "change:" + field, self.render);
                self.listenTo(self.model, "change:" + field, function() { console.log(field + " changed")});
            });
            
            _.bindAll(this,
                "render",
                "template",
                "format_simpletext",
                "format_attribute_value",
                "format_attribute_focus",
                "format_skill",
                "format_specializations"
            );
        }
    });
    _.extend(TextBarView.prototype, VampirePrintHelper);
    
    var AttributesView = Marionette.ItemView.extend({
        template: function(serialized_model) {
            var self = this;
            var tmpl = _.map(["Physical", "Social", "Mental"], function (name, i) {
                var str = ['<div class="ui-block-' + String.fromCharCode(97 + i) + '">'];
                str.push('<h4 class="ui-bar ui-bar-a ui-corner-all">' + name + '</h4>');
                str.push('<div class="ui-body">');
                var attribute = _.find(self.model.get("attributes"), "attributes.name", name);
                str.push(self.format_attribute_value(attribute));
                str.push('<br/>');
                str.push(self.format_attribute_focus(name));
                str.push('</div></div>');
                return str.join("");
            });
            tmpl = _.without(tmpl, undefined);
            tmpl = _.template(tmpl.join(""));
            return tmpl(serialized_model);
        },
        templateHelpers: function() {
            var self = this;
            return {
                format_simpletext: self.format_simpletext,
                format_attribute_value: self.format_attribute_value,
                format_attribute_focus: self.format_attribute_focus
            }
        },
        initialize: function(options) {
            var self = this;
            this.fields = options.fields || ["clan", "archetype", "antecedence"];
            this.$el.addClass("ui-grid-b");
            this.$el.addClass("ui-responsive");
            
            _.each(this.fields, function (field) {
                self.listenTo(self.model, "change:" + field, self.render);
                self.listenTo(self.model, "change:" + field, function() { console.log(field + " changed")});
            });
            
            _.bindAll(this,
                "render",
                "template",
                "format_simpletext",
                "format_attribute_value",
                "format_attribute_focus",
                "format_skill",
                "format_specializations"
            );
        }
    });
    _.extend(AttributesView.prototype, VampirePrintHelper);
    
    var BloodView = Marionette.ItemView.extend({
        template: _.template(blood_html),
        templateHelpers: function() {
            var self = this;
            return {
                character: self.model
            }
        },
        initialize: function(options) {
            var self = this;
            this.column = options.column;
            this.$el.addClass("ui-block-" + String.fromCharCode(97 + this.column));
            
            _.bindAll(this,
                "render",
                "template",
                "format_simpletext",
                "format_attribute_value",
                "format_attribute_focus",
                "format_skill",
                "format_specializations"
            );
        }
    });
    _.extend(BloodView.prototype, VampirePrintHelper);
    
    var WillpowerView = Marionette.ItemView.extend({
        template: _.template(willpower_html),
        templateHelpers: function() {
            var self = this;
            return {
                character: self.model
            }
        },
        initialize: function(options) {
            var self = this;
            self.listenTo(self.model, "change:willpower_sources", self.render);
            
            _.bindAll(this,
                "render",
                "template",
                "format_simpletext",
                "format_attribute_value",
                "format_attribute_focus",
                "format_skill",
                "format_specializations"
            );
        }
    });
    _.extend(WillpowerView.prototype, VampirePrintHelper);
    
    var MoralityView = Marionette.ItemView.extend({
        template: _.template(morality_html),
        templateHelpers: function() {
            var self = this;
            return {
                character: self.model
            }
        },
        initialize: function(options) {
            var self = this;
            
            _.bindAll(this,
                "render",
                "template",
                "format_simpletext",
                "format_attribute_value",
                "format_attribute_focus",
                "format_skill",
                "format_specializations"
            );
        }
    });
    _.extend(MoralityView.prototype, VampirePrintHelper);
    
    var HealthLevelsView = Marionette.ItemView.extend({
        template: _.template(health_levels_html),
        templateHelpers: function() {
            var self = this;
            return {
                character: self.model
            }
        },
        initialize: function(options) {
            var self = this;
            this.column = options.column;
            
            _.bindAll(this,
                "render",
                "template",
                "format_simpletext",
                "format_attribute_value",
                "format_attribute_focus",
                "format_skill",
                "format_specializations"
            );
        },
        onRender: function () {
            console.log('onRender');
            this.$el = this.$el.children();
            this.$el.unwrap();
            this.setElement(this.$el);
        }
    });
    _.extend(HealthLevelsView.prototype, VampirePrintHelper);
    
    var LayoutView = Marionette.LayoutView.extend({
        template: _.template(character_print_parent_html),
        
        regions: {
            header: "#cpp-header",
            firstbar: "#cpp-firstbar",
            secondbar: "#cpp-secondbar",
            attributes: "#cpp-attributes",
            blood: "#cpp-blood",
            morality: "#cpp-morality",
            willpower: "#cpp-willpower",
            health_levels: "#cpp-health-levels"
        },
        
        setup: function(character) {
            var self = this;
            var options = self.options || {};
            self.character = character;
            
            self.render();
            self.showChildView('header', new HeaderView({model: character}), options);
            self.showChildView('firstbar', new TextBarView({
                model: character,
                fields: ["clan", "archetype", "antecedence"]
            }), options);
            self.showChildView('secondbar', new TextBarView({
                model: character,
                fields: ["sect", "faction", "title"]
            }), options);
            self.showChildView('attributes', new AttributesView({model: character}), options);
            self.showChildView('blood', new BloodView({
                model: character,
                column: 1
            }), options);
            self.showChildView('morality', new MoralityView({model: character}), options);
            self.showChildView('willpower', new WillpowerView({model: character}), options);
            self.showChildView('health_levels', new HealthLevelsView({model: character}), options);
            
            return self;
        }
        
    });

    //return View;
    return LayoutView;

} );