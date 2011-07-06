/*
   Usage:

     $j('#some_element_id').tokenSelector({
       url:    '/facebook/college_major_tokens',
       value:  existing_college_major_ids_in_javascript_object_literal_notation,
       name:   'name_of_hidden_form_element') %>',
       prompt: 'Select college major(s)...'
     });

 */

(function($) {

  $.fn.extend({

    tokenSelector: function(options) {

      var defaults = {
        value:           [],
        animate:         false,
        theme:           "facebook",
        unique:          true,
        onChange:        function(values, item) { },
        onAdding:        function(values, item) { return true; },
        onRemoving:      function(values, item) { return true; }
      };

      var options = $.extend(defaults, options);

      return this.each(function() {

        var container     = $j(this);
        var inputElement  = $j('<input type="text">').appendTo(container);
        var outputElement = $j('<input type="hidden">').
                              attr('name', options.name).
                              attr('value', JSON.stringify(options.value.map(function(e) { return e.id }))).
                              appendTo(container);

        var onChange      = options.onChange;
        var onAdding      = options.onAdding;
        var onRemoving    = options.onRemoving;

        var itemAddedFunction = function(item) {
          var values = JSON.parse(outputElement.val());

          if (onAdding) {
            if (!onAdding(values, item)) {
              return;
            }
          }

          values.push(item.id);
          outputElement.val(JSON.stringify(values));

          if (onChange) {
            onChange(values, item);
          }
        };

        var itemDeletedFunction = function(item) {
          var values = JSON.parse(outputElement.val());

          if (onRemoving) {
            if (!onRemoving(values, item)) {
              return;
            }
          }

          values.remove(item.id);
          outputElement.val(JSON.stringify(values));

          if (onChange) {
            onChange(values, item);
          }
        };

        inputElement.tokenInput(options.url, {
          animateDropdown:   options.animate,
          preventDuplicates: options.unique,
          theme:             options.theme,
          hintText:          options.prompt,
          prePopulate:       options.value,
          onAdd:             itemAddedFunction,
          onDelete:          itemDeletedFunction
        });

        this.addItem = function(item) {
          inputElement.tokenInput("add", item);
        };

        this.removeItem = function(item) {
          inputElement.tokenInput("remove", item);
        };

      });
    }

  });

})(jQuery);
