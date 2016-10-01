define(["jquery","backbone","moment","../models/ExperienceNotation","../collections/ExperienceNotationCollection","../collections/VampireChangeCollection"],function(e,t,n,i,a,o){var r=t.View.extend({initialize:function(){var e=this;e.start=0,e.changeBy=10},register:function(t,n,i){var a=this,o=Parse.Promise.as([]);return t!==a.character&&(a.character&&(a.stopListening(a.character),a.stopListening(a.collection)),a.character=t,o=a.character.get_experience_notations(function(t){a.stopListening(t),a.listenTo(t,"add reset remove change:reason",a.render),a.listenTo(a.character,"begin_experience_notation_propagation",function(){e.mobile.loading("show")}),a.listenTo(a.character,"finish_experience_notation_propagation",function(){a.render(),e.mobile.loading("hide")}),a.collection=t},function(e){a.render()})),o.then(function(){Parse.Promise.as(a)})},events:{"click .previous":"previous","click .next":"next","click .add":"add","click .experience-notation-edit":"edit_experience_notation","submit #edit-entered-popup-form":"submit_experience_notation_entered","submit #edit-reason-popup-form":"submit_experience_notation_reason","submit #edit-alteration-popup-form":"submit_experience_notation_alteration","click .experience-notation-delete":"delete_experience_notation"},submit_experience_notation_entered:function(t,i,a,o,r){var p=this;t.preventDefault();var c=p.$("#popupEditEntered #date-id").val(),r=p.$("#popupEditEntered #date-input").val(),l=p.collection.getByCid(c),s=n(r);s.isValid()&&(l.set("entered",s.toDate()),l.save(),e("#popupEditEntered").popup("close"))},submit_experience_notation_reason:function(t){var n=this;t.preventDefault();var i=n.$("#popupEditReason #reason-id").val(),a=n.$("#popupEditReason #reason-input").val(),o=n.collection.getByCid(i);o.set("reason",a),o.save(),e("#popupEditReason").popup("close")},submit_experience_notation_alteration:function(t){var n=this;t.preventDefault();var i=n.$("#alterationpopupEdit #alteration-id").val(),a=_.parseInt(n.$("#alterationpopupEdit #alteration-input").val());a=_.isFinite(a)?0:a;var o=n.collection.getByCid(i),r=n.$("#alterationpopupEdit #alteration-type").val();o.set("alteration_"+r,a),o.save(),e("#alterationpopupEdit").popup("close")},edit_experience_notation:function(t){var i=this,a=i.$(t.target),o=a.attr("notation-id"),r=a.attr("header"),p=i.collection.getByCid(o);if(t.preventDefault(),"entered"===r){var c=e("#popupEditEntered");e("#popupEditEntered #date-input").val(n(p.get("entered")).format()),e("#popupEditEntered #date-id").val(o),c.enhanceWithin().popup("open")}else if("reason"===r){var c=e("#popupEditReason");e("#popupEditReason #reason-input").val(p.get("reason")),e("#popupEditReason #reason-id").val(o),c.enhanceWithin().popup("open")}else if("alteration_spent"===r){var c=e("#alterationpopupEdit");e("#alterationpopupEdit #alteration-input").val(p.get("alteration_spent")),e("#alterationpopupEdit #alteration-id").val(o),e("#alterationpopupEdit #alteration-type").val("spent"),c.enhanceWithin().popup("open")}else if("alteration_earned"===r){var c=e("#alterationpopupEdit");e("#alterationpopupEdit #alteration-input").val(p.get("alteration_earned")),e("#alterationpopupEdit #alteration-id").val(o),e("#alterationpopupEdit #alteration-type").val("earned"),c.enhanceWithin().popup("open")}},delete_experience_notation:function(e){e.preventDefault();var t=this,n=t.$(e.target),i=n.attr("notation-id"),a=(t.collection.getByCid(i),t.collection.get(i),t.collection.getByCid(i)||t.collection.get(i));return a?void t.character.remove_experience_notation(a):t},previous:function(){var t=this,n=this.start-this.changeBy;this.start=_.max([0,n]),window.location.hash="#character/"+t.character.id+"/experience/"+this.start+"/10",e.mobile.loading("show"),this.update_collection_query_and_fetch().then(function(){e.mobile.loading("hide")})},next:function(){var t=this;this.start+=t.changeBy,window.location.hash="#character/"+t.character.id+"/experience/"+this.start+"/10",e.mobile.loading("show"),this.update_collection_query_and_fetch().then(function(){e.mobile.loading("hide")})},add:function(){var e=this;e.character.add_experience_notation({reason:"Unspecified reason"})},update_collection_query_and_fetch:function(){var e=this,t={reset:!0},n=new Parse.Query(i);return n.equalTo("owner",e.character).addDescending("entered").addDescending("createdAt"),e.collection.query=n,e.collection.fetch(t).then(function(){var n=new Parse.Query(VampireChange);return n.equalTo("owner",e.character).addAscending("createdAt").limit(1e3),e.changes.query=n,e.changes.fetch(t)})},format_entry:function(e,t){if(e.has(t)){var i=e.get(t);return _.isDate(i)?n(i).format("lll"):e.get(t)}var a=e[t];return _.isDate(a)?n(a).format("lll"):a},render:function(){return this.template=_.template(e("script#experienceNotationsAllView").html())({character:this.character,logs:this.collection.models,format_entry:this.format_entry}),this.$el.find("div[role='main']").html(this.template),this.$el.enhanceWithin(),this}});return r});