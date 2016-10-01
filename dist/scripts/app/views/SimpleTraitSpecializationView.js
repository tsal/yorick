define(["jquery","backbone","../models/Description","../collections/DescriptionCollection"],function(e,t,i,a){var n=t.View.extend({initialize:function(e){_.bindAll(this,"remove","update_value","save_clicked"),this.collection=new a},register:function(e,t,a,n,r){var c=this,l=!1;if(this.redirectRemove=_.template(n),this.redirectSave=_.template(r),e!==c.character&&(c.character&&c.stopListening(c.character),c.character=e,l=!0),t!==c.simpletrait&&(c.simpletrait=t,l=!0),!_.isEqual(a,c.category)){c.category=a;var s=new Parse.Query(i);return s.equalTo("category",c.category).startsWith("name",c.simpletrait.get_base_name()).addAscending(["order","name"]),c.collection.query=s,c.collection.fetch({reset:!0}).then(function(){return c.render()})}return l?Parse.Promise.as(c.render()):Parse.Promise.as(c)},events:{"click .cancel":"cancel",change:"update_value","click .save":"save_clicked",submit:"save_clicked"},cancel:function(t,i,a){var n=this;return e.mobile.loading("show"),window.location.hash=n.redirectRemove({self:n}),!1},update_value:function(e,t,i){},save_clicked:function(t){var i=this;t.preventDefault(),e.mobile.loading("show");var a=i.$el.find('input[name="specialization"]').val();return _.defer(function(){i.simpletrait.set_specialization(a),i.character.update_trait(i.simpletrait).then(function(e){window.location.hash=i.redirectSave({self:i})}).fail(function(e){console.log("Couldn't specialize trait because of "+JSON.stringify(e)),window.location.hash=i.redirectRemove({self:i})})}),!1},render:function(){return this.template=_.template(e("script#simpleTraitSpecialization").html())({model:this.simpletrait,name:this.simpletrait.get_base_name(),specialization:this.simpletrait.get_specialization(),description:this.collection.first()}),this.$el.find("div[role='main']").html(this.template),this.$el.enhanceWithin(),this}});return n});