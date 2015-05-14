/*
* jquery.duallist.js
*
* Date  : 15/06/2010 $
* Version : 1.0 $
* Author: rnarayanan@vmware.com (Rajesh Narayanan) $
*/

(function($) {
    var settings = new Array();
    var group1 = new Array();
    var group2 = new Array();
    var onSort = new Array();
    var config;

    //the main method that the end user will execute to setup the DLB
    $.configureBoxes = function(id, options) 
    {
        //define default settings
        var index = settings.push({
                "box1View": "box1View_" + id,
                "box1Storage": "box1Storage_" + id,
                "box1Filter": "box1Filter_" + id,
                "box1Clear": "box1Clear_" + id,
                "box1Counter": "box1Counter_" + id,
                "box2View": "box2View_" + id,
                "box2Storage": "box2Storage_" + id,
                "box2Filter": "box2Filter_" + id,
                "box2Clear": "box2Clear_" + id,
                "box2Counter": "box2Counter_" + id,
                "to1": "to1_" + id,
                "allTo1": "allTo1_" + id,
                "to2": "to2_" + id,
                "allTo2": "allTo2_" + id,
                "transferMode": "move",
                "sortBy": "text",
                "useFilters": true,
                "useCounters": true,
                "useSorting": true
        });

        index--;
        
        //create dual list control
        var strHTML = [];        
        strHTML.push('<table><tr><td>');
        strHTML.push('<table id="fromActionPanel_'+ id +'"><tr style="vertical-align:top"><td valign="middle"><span class="title_msg">Filter:</span></td><td><input type="text" id="box1Filter_'+ id +'" class="text" style="width:135px" /></td><td><button type="button" id="box1Clear_'+ id +'" class="btn_clean">&nbsp;</button></td></tr></table>');
        strHTML.push('<select id="box1View_'+ id +'" multiple="multiple"></select><br/>');
        strHTML.push('<span id="box1Counter_'+ id +'" class="countLabel"></span>');
        strHTML.push('<select style="display:none" id="box1Storage_'+ id +'"></select>');
        strHTML.push('</td>');
        strHTML.push('<td><div><button type="button" id="to2_'+ id +'" class="btn_add">&nbsp;</button></div><div><button type="button" id="to1_'+ id +'" class="btn_remove">&nbsp;</button></div></td>');
        strHTML.push('<td>');
        strHTML.push('<table id="toActionPanel_'+ id +'"><tr style="vertical-align:top"><td valign="middle"><span class="title_msg">Filter:</span></td><td><input type="text" id="box2Filter_'+ id +'" class="text" style="width:135px" /></td><td><button type="button" id="box2Clear_'+ id +'" class="btn_clean">&nbsp;</button></td></tr></table>');
        strHTML.push('<select id="box2View_'+ id +'" multiple="multiple"></select><br/>');
        strHTML.push('<span id="box2Counter_'+ id +'" class="countLabel"></span>');
        strHTML.push('<select style="display:none" id="box2Storage_'+ id +'"></select>');
        strHTML.push('</td>');
        strHTML.push('<td valign="bottom"><span id="addnText_'+ id +'" style="display:none"></span>');
        strHTML.push('<select id="addnSelect_'+ id +'" style="display:none;padding-bottom:15px;padding-left:5px;" multiple="multiple" disabled="disabled" ></select><br/>');
        strHTML.push('</td></tr></table>');

        $("#" +id).html(strHTML.join('')); 
        
        //alert(parseInt($("#fromActionPanel_"+ id).css("width")));
        //$("#box1View_"+ id).css("width", parseInt($("#fromActionPanel_"+ id).css("width")) - 10);
        //$("#box2View_"+ id).css("width", parseInt($("#toActionPanel_"+ id).css("width")) - 10);
    
        //AJAX request handler for from box
        if(null !=  options && null !=  options.data && null != options.data[0] && null != options.data[0].url_from)
        {
            $("#box1Counter_"+ id).text('Total Items: 0');
            var fromSelectListObj = $("#box1View_"+ id);
            fromSelectListObj.empty();
            
        
            $.ajax
            ({
                type: 'GET',
                url: options.data[0].url_from,
                dataType: "json",
                success: function(event)
                {
                    var fromObj;
                    if(null != event && null != event.roleList && null != event.roleList.role)
                    {
                        fromObj = event.roleList.role;
                    }
                    else if(null != event && null != event.groupList && null != event.groupList.group)
                    {
                        fromObj = event.groupList.group;
                    }
                    
                    $.each(fromObj, function() 
                    {
                        var option = new Option(this.name, this.id);
                        option.innerText = this.name;
                        option.innerHTML = this.name;
                        option.title = this.name;
                        fromSelectListObj.append(option);
                    }); 
                    
                    
                    $("#box1Counter_"+ id).text('Total Items: ' + fromObj.length);
                                           
                },
                error: function()
                {
                    //alert("fromBox error loading JSON data");
                }
            });         
        }
        
        //AJAX request handler for to box
        if(null !=  options && null !=  options.data && null != options.data[0] && null != options.data[0].url_to)
        {
            $("#box2Counter_"+ id).text('Total Items: 0');
            var toSelectListObj = $("#box2View_"+ id);
            toSelectListObj.empty();            
        
            $.ajax
            ({
                type: 'GET',
                url: options.data[0].url_to,
                dataType: "json",
                success: function(event)
                {
                    var toObj;
                    if(null != event && null != event.roleList && null != event.roleList.role)
                    {
                        toObj = event.roleList.role;
                    }
                    else if(null != event && null != event.groupList && null != event.groupList.group)
                    {
                        toObj = event.groupList.group;
                    }
                    
                    $.each(toObj, function() 
                    {
                        var option = new Option(this.name, this.id);
                        option.innerText = this.name;
                        option.innerHTML = this.name;
                        option.title = this.name;
                        toSelectListObj.append(option);
                    });    
                    
                    
                    $("#box2Counter_"+ id).text('Total Items: ' + toObj.length);            
                },
                error: function()
                {
                    //var option = new Option("toBox error loading JSON data", -1);
                    //option.innerText = "toBox error loading JSON data";
                    //option.innerHTML = "toBox error loading JSON data";
                    //toSelectListObj.append(option);
                    //toSelectListObj.attr("disabled", "disabled");                
                    //alert("toBox error loading JSON data");
                }
            });        
        }





        


        //merge default settings w/ user defined settings (with user-defined settings overriding defaults)
        $.extend(settings[index], options);

        //define box groups
        group1.push({
            view: settings[index].box1View,
            storage: settings[index].box1Storage,
            filter: settings[index].box1Filter,
            clear: settings[index].box1Clear,
            counter: settings[index].box1Counter,
            index: index
        });
        group2.push({
            view: settings[index].box2View,
            storage: settings[index].box2Storage,
            filter: settings[index].box2Filter,
            clear: settings[index].box2Clear,
            counter: settings[index].box2Counter,
            index: index
        });

        //define sort function
        if (settings[index].sortBy == 'text') {
            onSort.push(function(a, b) {
                var aVal = a.text.toLowerCase();
                var bVal = b.text.toLowerCase();
                if (aVal < bVal) { return -1; }
                if (aVal > bVal) { return 1; }
                return 0;
            });
        } else {
            onSort.push(function(a, b) {
                var aVal = a.value.toLowerCase();
                var bVal = b.value.toLowerCase();
                if (aVal < bVal) { return -1; }
                if (aVal > bVal) { return 1; }
                return 0;
            });
        }

        //configure events
        if (settings[index].useFilters) {
            $('#' + group1[index].filter).keyup(function() {
                Filter(group1[index]);
            });
            $('#' + group2[index].filter).keyup(function() {
                Filter(group2[index]);
            });
            $('#' + group1[index].clear).click(function() {
                ClearFilter(group1[index]);
            });
            $('#' + group2[index].clear).click(function() {
                ClearFilter(group2[index]);
            });
        }
        if (IsMoveMode(settings[index])) {
            $('#' + group2[index].view).dblclick(function() {
                MoveSelected(group2[index], group1[index]);
            });
            $('#' + settings[index].to1).click(function() {
                MoveSelected(group2[index], group1[index]);
            });
            $('#' + settings[index].allTo1).click(function() {
                MoveAll(group2[index], group1[index]);
            });
        } else {
            $('#' + group2[index].view).dblclick(function() {
                RemoveSelected(group2[index], group1[index]);
            });
            $('#' + settings[index].to1).click(function() {
                RemoveSelected(group2[index], group1[index]);
            });
            $('#' + settings[index].allTo1).click(function() {
                RemoveAll(group2[index], group1[index]);
            });
        }
        $('#' + group1[index].view).dblclick(function() {
            MoveSelected(group1[index], group2[index]);
        });
        $('#' + settings[index].to2).click(function() {
            MoveSelected(group1[index], group2[index]);
        });
        $('#' + settings[index].allTo2).click(function() {
            MoveAll(group1[index], group2[index]);
        });

        //initialize the counters
        if (settings[index].useCounters) {
            UpdateLabel(group1[index]);
            UpdateLabel(group2[index]);
        }

        //pre-sort item sets
        if (settings[index].useSorting) {
            SortOptions(group1[index]);
            SortOptions(group2[index]);
        }

        //hide the storage boxes
        $('#' + group1[index].storage + ',#' + group2[index].storage).css('display', 'none');
    };

    function UpdateLabel(group) {
        var showingCount = $("#" + group.view + " option").size();
        var hiddenCount = $("#" + group.storage + " option").size();
        
        $("#" + group.counter).text('Total Items: ' + showingCount);
        //$("#" + group.counter).text('Showing ' + showingCount + ' of ' + (showingCount + hiddenCount));
    }

    function Filter(group) {
        var index = group.index;
        var filterLower;
        if (settings[index].useFilters) {
            filterLower = $('#' + group.filter).val().toString().toLowerCase();
        } else {
            filterLower = '';
        }
        $('#' + group.view + ' option').filter(function(i) {
            var toMatch = $(this).text().toString().toLowerCase();
            return toMatch.indexOf(filterLower) == -1;
        }).appendTo('#' + group.storage);
        $('#' + group.storage + ' option').filter(function(i) {
            var toMatch = $(this).text().toString().toLowerCase();
            return toMatch.indexOf(filterLower) != -1;
        }).appendTo('#' + group.view);
        try {
            $('#' + group.view + ' option').removeAttr('selected');
        }
        catch (ex) {
            //swallow the error for IE6
        }
        if (settings[index].useSorting) { SortOptions(group); }
        if (settings[index].useCounters) { UpdateLabel(group); }
    }

    function SortOptions(group) {
//        var $toSortOptions = $('#' + group.view + ' option');
//        $toSortOptions.sort(onSort[group.index]);
//        $('#' + group.view).empty().append($toSortOptions);
    }

    function MoveSelected(fromGroup, toGroup) {
    
        var fromGroupId = new String(fromGroup.view);
        
    
        if (IsMoveMode(settings[fromGroup.index])) {
            
            if(fromGroupId.indexOf('box1View_') != -1)
            {
                for(var i = 0; i < $('#' + toGroup.view)[0].length; ++i)
                {
                    for(var j = 0; j < $('#' + fromGroup.view + ' option:selected').length; ++j)
                    {
                        if($('#' + toGroup.view)[0][i].value == $('#' + fromGroup.view + ' option:selected')[j].value)
                        {
                            $('#' + fromGroup.view + ' option:selected')[j].selected = false;
                        }
                    }
                }
            }
            
            $('#' + fromGroup.view + ' option:selected').appendTo('#' + toGroup.view);
        } else {
            $('#' + fromGroup.view + ' option:selected:not([class*=copiedOption])').clone().appendTo('#' + toGroup.view).end().end().addClass('copiedOption');
        }
        try {
            $('#' + fromGroup.view + ' option,#' + toGroup.view + ' option').removeAttr('selected');
            $("#" + toGroup.view).trigger("change");alert(toGroup.view + "-----");
        }
        catch (ex) {
            //swallow the error for IE6
        }
        Filter(toGroup);
        if (settings[fromGroup.index].useCounters) { UpdateLabel(fromGroup); }
    }

    function MoveAll(fromGroup, toGroup) {
        if (IsMoveMode(settings[fromGroup.index])) {
            $('#' + fromGroup.view + ' option').appendTo('#' + toGroup.view);
        } else {
            $('#' + fromGroup.view + ' option:not([class*=copiedOption])').clone().appendTo('#' + toGroup.view).end().end().addClass('copiedOption');
        }
        try {
            $('#' + fromGroup.view + ' option,#' + toGroup.view + ' option').removeAttr('selected');
        }
        catch (ex) {
            //swallow the error for IE6
        }
        Filter(toGroup);
        if (settings[fromGroup.index].useCounters) { UpdateLabel(fromGroup); }
    }

    function RemoveSelected(removeGroup, otherGroup) {
        $('#' + otherGroup.view + ' option.copiedOption').add('#' + otherGroup.storage + ' option.copiedOption').remove();
        try {
            $('#' + removeGroup.view + ' option:selected').appendTo('#' + otherGroup.view).removeAttr('selected');
        }
        catch (ex) {
            //swallow the error for IE6
        }
        $('#' + removeGroup.view + ' option').add('#' + removeGroup.storage + ' option').clone().addClass('copiedOption').appendTo('#' + otherGroup.view);
        Filter(otherGroup);
        if (settings[removeGroup.index].useCounters) { UpdateLabel(removeGroup); }
    }

    function RemoveAll(removeGroup, otherGroup) {
        $('#' + otherGroup.view + ' option.copiedOption').add('#' + otherGroup.storage + ' option.copiedOption').remove();
        try {
            $('#' + removeGroup.storage + ' option').clone().addClass('copiedOption').add('#' + removeGroup.view + ' option').appendTo('#' + otherGroup.view).removeAttr('selected');
        }
        catch (ex) {
            //swallow the error for IE6
        }
        Filter(otherGroup);
        if (settings[removeGroup.index].useCounters) { UpdateLabel(removeGroup); }
    }

    function ClearFilter(group) {
        $('#' + group.filter).val('');
        $('#' + group.storage + ' option').appendTo('#' + group.view);
        try {
            $('#' + group.view + ' option').removeAttr('selected');
        }
        catch (ex) {
            //swallow the error for IE6
        }
        if (settings[group.index].useSorting) { SortOptions(group); }
        if (settings[group.index].useCounters) { UpdateLabel(group); }
    }

    function IsMoveMode(currSettings) {
        return currSettings.transferMode == 'move';
    }
})(jQuery);

vmf.duallist = function($){
    return {
      build: function(id , options)
      {
           $.configureBoxes(id, options);
      }
    };
}(jQuery);