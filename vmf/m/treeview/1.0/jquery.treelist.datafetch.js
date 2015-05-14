/*
* jquery.TreeList.js
*
* Date  : 02/08/2010 
* Version : 1.0
* Author: rnarayanan@vmware.com (Rajesh Narayanan)
*/
if(null == treelistDataObj)
{
    var treelistDataObj = [];
}

;(function($) {

var currentSelection = null;
$.fn.leafSelection = function(){
    if(undefined != $(this).attr("id") && (true == $(this).parent().hasClass("last") || "" == $(this).parent().attr("class")))
    {
        if(null != currentSelection)
        {
            var currentSelectionId = currentSelection.split("_")[1]
            $("#node_" + currentSelectionId).removeClass("highlight");
        }
        
        currentSelection = $(this).attr("id");
        $(this).parent().addClass("highlight");
    }
};

$.fn.getSelectedData = function() 
{
    if(null != currentSelection)
    {
        var currentSelectionId = currentSelection.split("_")[1]
        
        if(null != $.toJSON && null != treelistDataObj[currentSelectionId])
        {
            return $.toJSON(treelistDataObj[currentSelectionId]);
        }
        else if(null != treelistDataObj[currentSelectionId])
        {
            return treelistDataObj[currentSelectionId];
        }
    }
    else
    {
        return "NO_ITEM_SELECTED";
    }
};

function load(settings, root, child, container) 
{
    /* Code block for testing */
    //    alert(settings.url + " " + root);
    //    if(root != -1)
    //    {
    //        if("node_001" == root)
    //        {
    //            settings.url = "data2.js";
    //        }
    //        
    //        if("node_002" == root)
    //        {
    //            settings.url = "data3.js";
    //        }
    //    }
    
    $.getJSON(settings.url, {id: root}, function(response) 
	{
		function createNode(parent) 
		{
			var nameString = "";
			if("" != this.id)
			{
				nameString = new String(this.id)
				nameString = nameString.split(' ').join('');
			}
			
			var current;
			if("-1" == root)
			{
				current = $("<li/>").attr("id", "node_"+this.id || "").attr("name", "pf_node_"+ nameString || "").html("<span id='cell_"+ this.id +"' name='cell_"+ nameString +"' onclick='$(this).leafSelection()'>" + this.text + "</span>").appendTo(parent);
			}
			else
			{
				current = $("<li/>").attr("id", "node_"+this.id || "").attr("name", "node_"+ nameString || "").html("<span id='cell_"+ this.id +"' name='cell_"+ nameString +"' onclick='$(this).leafSelection()'>" + this.text + "</span>").appendTo(parent);
			}

			if (this.classes) {
				current.children("span").addClass(this.classes);
			}
			if (this.expanded) {
				current.addClass("open");
			}
			if (this.hasChildren || this.children && this.children.length) {
				var branch = $("<ul/>").appendTo(current);
			    
				if (this.hasChildren) {
					current.addClass("hasChildren");
					createNode.call({
						text:"loading...",
						id:"placeholder",
						children:[]
					}, branch);
				}
				if (this.children && this.children.length) {
					$.each(this.children, createNode, [branch])
				}
			}
		}
		
        function parseData(response)
        {
            var myNamedArray = [];
            if(null != response)
            {
                var nRootNodeLength = response.length;
                var counter = 0;
                for(var nRootNode = 0;nRootNode < nRootNodeLength; ++nRootNode)
                {
                    for(var nSubNode = 0; nSubNode < response[nRootNode].children.length; ++nSubNode)
                    {
                        if(null != response[nRootNode].children && null != response[nRootNode].children[nSubNode])
                        {
                            for(var nLeafNode = 0; nLeafNode < response[nRootNode].children[nSubNode].children.length; ++nLeafNode)
                            {
                                var nID = response[nRootNode].children[nSubNode].children[nLeafNode].id;
                                
                                //alert(counter + " ---- " + response[nRootNode].children[nSubNode] +  " ~~~%%%%~~~ " + response[nRootNode].text + "---" + response[nRootNode].children[nSubNode].text);
                                myNamedArray[nID] = response[nRootNode].children[nSubNode].children[nLeafNode];
                                myNamedArray[nID].subNode = response[nRootNode].children[nSubNode].text;
                                myNamedArray[nID].rootNode = $("#node_" + nID).parent("ul").parent("li").parent("ul").parent("li").parent("ul").parent("li").children("span").text()
                                ++counter;
                            }
                        }
                    }
                }
            }
            
            return myNamedArray;
        }
		
		$.each(response, createNode, [child]);
		//treelistDataObj = $.extend({}, parseData(response));
		$.extend(treelistDataObj, parseData(response));
		
        $(container).treeview({add: child});
        
        $(".treeview").find("li").children("div").next("span").css("color", "#4BA1CF");
        //$(".treeview").find("li").children("div").next("span").css("font-weight", "bold");
        $(".treeview").children("li").children("div").next("span").css("color", "#666666");
        //$(".treeview").children("li").children("div").next("span").css("font-weight", "bold");
    });
}

var proxied = $.fn.treeview;
$.fn.treeview = function(settings) {
	if (!settings.url) {
		return proxied.apply(this, arguments);
	}
	var container = this;
	load(settings, "-1" , this, container);
	var userToggle = settings.toggle;
	return proxied.call(this, $.extend({}, settings, {
		collapsed: true,
		toggle: function() {
			var $this = $(this);
			if ($this.hasClass("hasChildren")) {
				var childList = $this.removeClass("hasChildren").find("ul");
				childList.empty();
				load(settings, this.id, childList, container);
			}
			if (userToggle) {
				userToggle.apply(this, arguments);
			}
		}
	}));
};
})(jQuery);


vmf.TreeList = function($){
    return {
      build: function(id , options)
      {
           $("#" + id).treeview(options);
      },
      getSelectedData: function()
      {
           return $.fn.getSelectedData();
      }      
    };
}(jQuery);