/*
* Copyright js-SelectableBoxOption - A JavaScript plugin for selectable box option
*
* Version: 1.0
*
* You can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
*
* Project is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
*
* You should have received a copy of the GNU General Public License
* along with Copyright Header.  If not, see <http://www.gnu.org/licenses/>.
*/

(function ($) {
    /**
     * Plugin jQuery which allow to create selectable boxes in form

     * @param element
     * @param options
     * @constructor
     */
    $.selectableBoxOption = function (element, options) {

        /**
         *
         * @type {{data_attr: {select_name: string, option_value: string}, name: null}}
         */
        var defaults = {
            "dataAttr": {
                "selectName": "data-selectable-box-option-name",
                "option_value": "data-selectable-box-option-value",
                "option_selected": "data-selectable-box-option-selected"
            },
            "classes" : {
                "isSelected": "sbi-selected",
                "option": "sbi-option",
                "input": "sbi-input"
            },
            "input_name": null
        };

        var plugin = this;
        var listSelBoxes = [];
        var elBoxValue = {}; //map, key is a otpion value, data is a jquery reference to box option

        var $elSelectedBox = null;
        var $elSelectInputValue = null;

        plugin.settings = {};

        var $element = $(element); // reference to the jQuery version of DOM element

        // the "constructor" method that gets called when the object is created
        plugin.init = function (options) {

            // the plugin's final properties are the merged default and
            // user-provided options (if any)
            plugin.settings = $.extend({}, defaults, options);

            var valueInputName = plugin.settings.input_name ? plugin.settings.input_name : $($element).attr(plugin.settings.dataAttr.selectName);

            if(valueInputName == undefined || valueInputName.length == 0)
            {
                throw new DOMException("Missing element data attribute '" +
                    plugin.settings.dataAttr.selectName + "' or missing initalization option key '" +
                    plugin.settings.input_name + "'");
            }

            initHiddenInput(valueInputName);

            plugin.reloadBoxes();
        };

        plugin.reloadBoxes = function()
        {
            listSelBoxes = $($element).find("." + plugin.settings.classes.option);

            var dataValueAttrName = plugin.settings.dataAttr.option_value;

            if(listSelBoxes.length > 0)
            {
                listSelBoxes.each(function(key, refEl)
                {
                    var value = $(refEl).attr(dataValueAttrName);

                    if(value != undefined)
                    {
                        var isSelected = isOptionBoxSelected(refEl);

                        elBoxValue[value] = refEl;

                        if(isSelected)
                            plugin.selectBox(refEl);

                        $(refEl).on("click", function(event){
                            onChangeBox(this);
                        });
                    }else
                    {
                        throw new DOMException("Missing data attribute '" + dataValueAttrName + "' for box option with value.");
                    }
                });
            }else
            {
                throw new DOMException("No set option boxes. Option box has to have a class '" + options.classes.option + "'");
            }
        };

        //todo get value
        //todo set value

        /**
         * Select box-option
         */
        plugin.selectBox = function(elBoxOption)
        {
            var value = getBoxOptionValue(elBoxOption);

            console.log("Selected value in selectableBoxOption is " + value);

            var domSelectedClass = plugin.settings.classes.isSelected;
            if($elSelectedBox != elBoxOption)
            {
                $($elSelectedBox).removeClass(domSelectedClass);
            }

            $elSelectedBox = elBoxOption;
            $($elSelectedBox).addClass(domSelectedClass);

            setInputValue(getBoxOptionValue($elSelectedBox));
        };

        var initHiddenInput = function (inputName)
        {
            var $refValInput = $($element).find(plugin.settings.classes.input);

            if(!$refValInput || $refValInput.size() == 0)
            {
                $refValInput = $('<input>', {
                    name: inputName,
                    type: "hidden",
                    value: ""
                }).appendTo($element);
            }else
            {
                $($refValInput).val("");
            }

            $elSelectInputValue = $refValInput;

            if(!$refValInput)
            {
                console.error("Not created input with value");
            }
        };

        /**
         * Return true, if box option has class selected
         *
         * @param $elBoxInput jquery object or selector
         * @returns bool
         */
        var isOptionBoxSelected = function($elBoxInput)
        {
            var hasClass =  $($elBoxInput).hasClass(plugin.settings.classes.isSelected);

            if(hasClass)
                return true;
            else
            {
                return $($elBoxInput).attr(plugin.settings.dataAttr.option_selected) != undefined;
            }
        };

        var onChangeBox = function(elBox)
        {
            console.log("clicked " + elBox);

            //FIXME możliwy konflikt kliknięcia, bo np. jak się kliknie na link we wnętrzu to przeniesie

            plugin.selectBox(elBox);
        };

        var setInputValue = function(value)
        {
            console.info("setInputValue(value=" + value + ")");

            $($elSelectInputValue).val(value);
        };

        var getBoxOptionValue = function($elBoxOption)
        {
            var dataValueAttrName = plugin.settings.dataAttr.option_value;

            return $($elBoxOption).attr(dataValueAttrName);
        };

        // fire up the plugin!
        // call the "constructor" method
        plugin.init();

    };

    // add the plugin to the jQuery.fn object
    $.fn.selectableBoxOption = function (options) {

        // iterate through the DOM elements we are attaching the plugin to
        return this.each(function () {

            // if plugin has not already been attached to the element
            if (undefined == $(this).attr('selectableBoxOption')) {

                // create a new instance of the plugin
                // pass the DOM element and the user-provided options as arguments
                var plugin = new $.selectableBoxOption(this, options);

                // in the jQuery version of the element
                // store a reference to the plugin object
                // you can later access the plugin and its methods and properties like
                // element.attr('selectableBoxOption').publicMethod(arg1, arg2, ... argn) or
                // element.attr('selectableBoxOption').settings.propertyName
                $(this).attr('selectableBoxOption', plugin);
            }
        });
    }
})(jQuery);
