/**
 *
 * @param {window} window
 * @param {soma} soma
 * @returns {undefined}
 */
(function(window, soma) {
    var SolrTools = soma.Application.extend({
        init: function() {
            // model mapping rule so it can be injected in the template
//            this.injector.mapClass("model", Model, true);
            // create a template for a specific DOM element
//            this.createTemplate(Template, document.querySelector('.app'));
        }
    });

    window.app = new SolrTools();
})(window, soma);