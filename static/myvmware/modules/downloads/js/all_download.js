if (typeof(myvmware) == "undefined")  myvmware = {};
myvmware.ad = { // All downloads
	$loading : '<div class="loading"><span class="loading_big">'+rs.lblLoading+'...</span></div>',
	cMap : null, // current mapping object
	ad:null, // namespace object
	curHash :"tab1",
	hash:"",
	defaultSelected :0,
	onload :true,
	clicked : false,
	init: function() {
                // Added to load breadcrumbs
                 if(jQuery('.breadcrumbs')!=null && jQuery('#tempbreadcrumbs')!=null){
                    jQuery('.breadcrumbs').html(jQuery('#tempbreadcrumbs').html());
                    jQuery('#tempbreadcrumbs').html("").remove();
                 }
                
		ad = myvmware.ad;
		ad.map = {
			"tab1" : {"url":rs.tab1Url,"f":ad.renderEAs,"hasData":0,"cnt":$('#tab_license'),"tab":"ttab1","hash":"tab1","oTag":"downloads : my-products"},
			"tab2" : {"url":rs.tab2Url,"f":ad.renderAllProd,"hasData":0,"cnt":$('#tab_all'),"tab":"ttab2","hash":"tab2","oTag":"downloads"},
			"tab3" : {"url":rs.tab3Url,"f":ad.renderAtoZProd,"hasData":0,"cnt":$('#tab_prod_A-Z'),"tab":"ttab3","hash":"tab3","oTag":"downloads : products-a-z"}
			};
			
		ad.bindEvents();
		ad.getHashURL();
		//var ob = vmf.cookie.read("ObSSOCookie")
		//ad.isLoggedInUser = (ob == "loggedout" || ob == "loggedoutcontinue" || ob == null || ob == "")?false:true;
			ad.isLoggedInUser=vmusf;
		if( ad.isLoggedInUser ){
			ad.curHash = "tab1";
			ad.renderEOL();
		}else{
			$('div.tabbed_area ul.tabs li a#ttab1,.LogedinVersion').hide();
			ad.curHash = "tab2";
			document.cookie = "ObFormLoginCookie=; expires=" + new Date + "; path=/" ; 
		}
		ad.curHash = (ad.hash=="")?ad.curHash :ad.hash;
		ad.setHashURL(ad.curHash)
		ad.cMap = ad.map[ad.curHash];
		$('div.tabbed_area ul.tabs li a#'+ad.cMap.tab).trigger('click');
		$(window).hashchange( function(){// Alerts every time the hash changes!
			ad.getHashURL();
			ad.curHash = (ad.hash=="")?ad.curHash :ad.hash;
			//if(!ad.clicked ){
				$('div.tabbed_area ul.tabs li a#'+ad.map[ad.curHash].tab).trigger('click');	
			//}	
			//ad.clicked = false;	
		});

		if( ad.isLoggedInUser ){ // show beaks only for logged-in users
			myvmware.common.showMessageComponent('DOWNLOADS');

			if( myvmware.ad.curHash === 'tab1' ){
				setTimeout(function(){
					myvmware.ad.showMyProductsTabBeak();
				}, 2000);
			}else{
				$('div.tabbed_area ul.tabs a#ttab1').one('click', function(){
					myvmware.ad.showMyProductsTabBeak();
				});
			}
		}
	},
	showMyProductsTabBeak: function(){
		myvmware.ad.processBeak({
			  beakKeyString: "BEAK_DOWNLOADS_PAGE_FOR_MY_PRODUCTS"
			, beakNewText: 'New: '
			, beakHeading: 'Product Ownership tab'
			, beakContent: 'View and download licensed products for your permissioned accounts'
			, beakTarget: $('#ttab1')
			, multiple: true
		});
	},
	showProductsHoverMenuBeak: function(){
		myvmware.ad.processBeak({
			  beakKeyString: "BEAK_DOWNLOADS_PAGE_FOR_ALL_PRODUCTS_HOVER_MENU"
			, beakNewText: 'New: '
			, beakHeading: 'Hover Action Menu'
			, beakContent: 'Hover mouse over the product name to link to actions.'
			, beakTarget: $($('.warpLongText')[0])
			, multiple: true
		});
	},
	processBeak: function( options ){
		if( ad.isLoggedInUser ){ // show beaks only for logged-in users
			myvmware.common.setBeakPosition({
				  beakId: myvmware.common.beaksObj[options.beakKeyString]
				, beakName: options.beakKeyString
				, beakNewText: options.beakNewText
				, beakHeading: options.beakHeading
				, beakContent: options.beakContent
				, target: options.beakTarget
				, multiple: options.multiple
			});
		}
	},
	getHashURL:function(){
		ad.hash = decodeURIComponent(window.location.hash.substring(1));
	},
	setHashURL:function(hrshURL){
		ad.curHash = hrshURL;
		//window.location.hash = hrshURL;
	},
	bindEvents: function(){ // Bind events
		$('div.tabbed_area ul.tabs a.tab').click(function(){
			if(ad.cMap!=null && !ad.onload){
				ad.cMap.cnt.hide();
				$("#"+ad.cMap.tab).removeClass('active')
			}
			ad.cMap = ad.map[$(this).data('hash')];
			if(ad.onload){
				vmf.scEvent =true;
				callBack.addsc({'f':'riaLinkmy','args':[ad.cMap.oTag]});
				ad.onload = false;
			}	
			else{
				riaLinkmy(ad.cMap.oTag); 
			};	
			$("#"+ad.cMap.tab).addClass('active');
			if(!ad.cMap.hasData){
				ad.cMap.cnt.append(ad.$loading)
				ad.getData(ad.cMap);
				ad.cMap.hasData = 1;
			}
			ad.cMap.cnt.show();
			//ad.clicked = true
			ad.setHashURL(ad.cMap.hash);

			/* on tab change, show/hide hover-menu-beak - start */
			var firstWarpLongText = $($('.warpLongText')[0]);
			if( firstWarpLongText.data('beak-obj') ){
				if( firstWarpLongText.is(':visible') ){
					firstWarpLongText.data('beak-obj').show();
				}else{
					firstWarpLongText.data('beak-obj').hide();
				}
			}
			/* on tab change, show/hide hover-menu-beak - end */
			return false;
		});// End of Tab click events
		
		$('ul.eas li a.openClose').die('click').live('click', function(e){
			// check if the current product is already expanded. If expanded, return 
			var li = $(this).closest('li');
                        var eaNum = $(li).attr('eanum');   
                        var eaName = $(li).attr('eaname');
			if( $(this).hasClass('open') ){
				$(this).removeClass('open');
				li.find('div.moredetails').hide();
				return;
			}else{
                                      
			/* get the siblings of the current LI and find if there are any 'open'ed products. 
			   If yes, (1) remove the open class for the anchor tag. (2) remove the table container '.moredetails' */
			li.siblings('li').each(function(){
				var openCloseObj = $(this).find('a.openClose');
				if( openCloseObj.hasClass('open') ){
					openCloseObj.removeClass('open');
					$(this).find('.moredetails').remove();
					$(this).attr('hasdata', false);
				}
			});

			$(this).addClass('open');
			var tableId = 'protable'+li.attr('idx');
			if (li.attr('hasdata') != "true"){
				li.append('<div class="moredetails bottomarea clearfix"><table class="productDetailsTbl" id="'+tableId+'"></table></div>');
				ad.renderproducts(tableId,li,eaNum, eaName);
			}
			else {
				li.find('div.moredetails').show();
			}
		}	
			e.preventDefault();
		});
		/*$('ul.products li.prodChilds').live('mouseover',function(){
			$(this).addClass('hover').find('span').css('display','block');
			$(this).find('div.warpLongText').css('width','50%')
		});
		$('ul.products li.prodChilds').live('mouseout',function(){
			//$(this).removeClass('hover').find('span').hide();
			$(this).find('div.warpLongText').css('width','auto')
		}); */
		// click event:: when user clicks on 'set as default' link for any of the products 
		$('ul.eas li a.setAsDefault').die('click').live('click', function(e){
			riaLinkmy('downloads : my-products : set-default');
			var $this = $(this),
				curDefaultLI = $this.closest('li.download_lists'),
				prevDefaultLI = $('li.download_lists'),
				tempEAlist = $.extend({}, ealist); // take a tempObj to hold the ealist items
                                    
			// TO-BE-ADDED: send an ajax request to server to let it know the changed 'default product id'
                        var eaNum = $(this).closest('div').attr('eanum');                          
                        var defaultSetURL = rs.setAsDefault+"&eaNumber="+eaNum;                                                    
                        vmf.ajax.post(defaultSetURL,null,function(data){                            
                            var temp = vmf.json.txtToObj(data);
                            if(temp['success'] == "true"){
                                // place the 'set as default' link inside the prevDefaultLI
                                prevDefaultLI.find('span.defaulttext').html('<a href="javascript:;" class="setAsDefault">'+rs.lblSetAsDefault+'</a>');
                                //sort all the LIs that are rendered in the products-UL, based on the accountName 
                                var lis = $('ul.eas li').sort(function(a, b) {
                                    var aEanum = parseInt($('.accountName', a).attr('eanum'));                                                                        
                                    var bEanum = parseInt($('.accountName', b).attr('eanum'));                                    
                                    var sorted = aEanum - bEanum; // Fix for BUG-00052436.  > comparison do not work with IE                                     
                                    return sorted;
                                    //return  $('.accountName', a).text() > $('.accountName', b).text();
                                });
                                // now place the sorted LIs into UL 
                                $('ul.eas').html(lis);
                                // now place the curDefaultLI to the top and replace 'set as default' link inside it 
                                curDefaultLI.prependTo( $('ul.eas') );
                                curDefaultLI.find('span.defaulttext').html(rs.lblDefaultaccount);
                            }
                            else{
                                 alert(rs.lblGenericError);
                            }
                        });   
		});
		$('.endOfLifeProducts').hoverIntent(function(){                        
			var w = $('.downarrow').width();
			var l =  parseInt(w-287)+"px"
			//console.log(l)
			$('.eol_dropdown').css("left",l)
                        
			$(this).find('.downarrow').addClass('opened');
			$(this).find('.downarrow').closest('li').find('.eol_dropdown').show().addClass('hovered');
		},function() {
			var cc = $(this);
			setTimeout(function(){
				if(cc.find('.eol_dropdown').hasClass('hovered')){
					$('.downarrow').removeClass('opened');
					cc.find('.eol_dropdown').hide().removeClass('hovered');
				}
			}, 500);
		});
		
		//To get the url to be redirected on click of ":button"
        $('ul.products li.prodChilds :button').live('click',function(){
		   window.location = $(this).attr('url');
        });      
        $('.endOfLifeProducts').parent('li').css({'float':'left', 'width':'180px'});

        $('ul.sf-menu li ul li a').click(function(){
			$(this).closest('ul').css({"display":"none"});
		});
	},
	renderEOL :function(){
		vmf.ajax.post(rs.eolURL,'',function(resp){
			var list = vmf.json.txtToObj(resp).productCategoryList[0].proList;
			var txt = "";
			$.each(list,function(i,item){
				txt += "<li class='eolList'><a href='"+item.actions[0].target+"'>"+item.name+"</a></li>"
			})
			$('.eol_dropdown').html(txt);
		},function(){})
	},
	getData:function(m){
		vmf.ajax.post(m.url,'',	m.f, function(){});
	},
	renderEAs: function(resp){ // After successfull ajax loading create HTML
		var achtml=[];
		var data =  vmf.json.txtToObj(resp);
		if(data.errDesc){
			ad.cMap.cnt.find('div.loading').remove();
			var errData = $('<p>').append(data.errDesc).css({"text-align":"center","font-weight":"bold"})
			ad.cMap.cnt.append(errData);
		}
		else{
			ealist =data.jsonEAs.eaList; // global variable, will access this obj when user makes any other product as default
			if(ealist.length>0){
				var ulList = $("<ul class='eas'></ul>"),
					expHtml = '<div class="openCloseSelect"><a class="openClose" href="#"></a></div>',
					defSpanHtml = '';
				$.each(ealist, function(i,item){
					ad.defaultSelected = (item.selected)?i:ad.defaultSelected;                               
					if(item.isDefault){
						defSpanHtml = '<span class="defaulttext">'+rs.lblDefaultaccount+'</span>';
					}else{
						defSpanHtml = '<span class="defaulttext"><a href="javascript:;" class="setAsDefault">'+rs.lblSetAsDefault+'</a></span>'
					}
					achtml.push("<li idx='"+i+"' eanum='"+item.entitlementNumber+"'"+"' eaname='"+item.name+"'"+" class=\"download_lists clearfix\"><div class=\"eaContainer\" >"+expHtml+"<div class=\"accountName\" eanum="+item.entitlementNumber+">"+rs.lblAccount+": "+item.entitlementNumber+": "+item.name +""+defSpanHtml+"</div></div></li>");
					ulList.append($(achtml.join('')).data("eid",item.entitlementNumber));
					achtml = [];
				});
				ad.cMap.cnt.find('div.loading').remove();
				ad.cMap.cnt.append(ulList);
				$('ul.eas li a.openClose:eq('+ad.defaultSelected+')').trigger('click');
			}
		}	
	},
	dataTableError:function(table,json){
			var err_msg = (json.errDesc) ? json.errDesc : rs.lblGenericError;
			var emptyRow =table.find("tbody tr td.dataTables_empty");
			if(emptyRow.length) emptyRow.html(err_msg).closest("tr").show();
			else {
				$("<tr><td colspan="+table.fnSettings().aoColumns.length+" class=\"dataTables_empty\">"+err_msg+"</td></tr>").appendTo(table.find("tbody")).show();
			}
			var thdr = table.closest('.dataTables_wrapper').find('.productDetailsTbl th');
			thdr.unbind('click').find('span').removeClass('descending');
		},
	renderproducts :function(t,li,eaNum, eaName){
                var dataTableURL = rs.prodUrl+"&EA_NUMBER_SELECTED_BY_USER="+eaNum+"&EA_NAME_SELECTED_BY_USER="+eaName;                
		vmf.datatable.build($('#'+t),{
				"aoColumns": [{"sTitle": "<span class='descending'>"+rs.lblProduct+"</span>","sWidth":"100%"}],
				"sAjaxSource": dataTableURL,
				"error":ad.dataTableError,
				"bInfo": false,
				"bServerSide": false,
				"bAutoWidth" : false,
				"bFilter": false,
				"sScrollY": 79,
				"sDom": 'zrtSpi',
				"bProcessing": true,
				"oLanguage": {
					"sProcessing" : rs.lblLoading+"...",
					"sLoadingRecords":"",
					"sZeroRecords": "No Customers Found"
				},
				"fnRowCallback": function(nRow,aData,iDisplayIndex){ 
                                        var prodDetailContent ='';
                                        var prodDetails = $('<div class="prodDetails"/>');
                                        if(aData[0] != ""){
                                            var productName = aData[0];
                                            prodDetailContent = '<div>'+'<div class="fLeft leftContainer"><div class="prodName">'+productName+'</div></div>';
                                        }
                                        var buttonHrefs = aData[2].split('|');
                                        var bHref = buttonHrefs.splice(0,1);    
										prodDetailContent += '<div class="fRight">';
                                        if(bHref != "" && bHref != "null" && bHref != null){
                                        prodDetailContent += '<a class="download" href="'+bHref+'">';                                        
                                        }                                        
                                        var buttonTexts = aData[1].split('|');
                                        var bText = buttonTexts.splice(0,1);
                                        if(bText != "" && bText != "null" && bText != null){
                                            prodDetailContent += bText+'</a>';                                            
                                        }
										for( var i=0; i<buttonTexts.length; i++ ){
										    if(buttonTexts.length >= 1 && (bText != "" && bText != "null" && bText != null)){
												 prodDetailContent += '<span class="linksSeparator">|</span>';
											 }
											 prodDetailContent += '<a href="'+buttonHrefs[i]+'">'+buttonTexts[i]+'</a>';
									  	}	
										 prodDetailContent += '</div>'+'<p class="clear"/>'+'</div>';
					prodDetails.append(prodDetailContent);
					var leftContainer = prodDetails.find('.leftContainer');
					/*for( var i=0; i<buttonTexts.length; i++ ){
						if( i != 0 ){
							leftContainer.append('<span class="linksSeparator">|</span>');
						}
						leftContainer.append('<a href="'+buttonHrefs[i]+'">'+buttonTexts[i]+'</a>');
					}*/					
					$(nRow).find('td').html(prodDetails);
					$(nRow).hoverIntent(function(){
						$(this).addClass('backgroundBlue');
					}, function(){
						$(this).removeClass('backgroundBlue');
					});
					return nRow;
				},
				"fnInitComplete": function () {
					li.find('div.loading').remove();
					li.attr('hasdata',true);
					var $hTbl = this;
					var rLen = $hTbl.find('tr').length-1;
					var ht = (rLen < 5)?(rLen*79)+"px": "390px";
					$hTbl.closest('div').css({'overflow-y':'scroll','height':ht});
				},
				"bPaginate": false,
				"sPaginationType": "full_numbers"
			});
	},
	loadProdCategories: function(){
		vmf.ajax.post(rs.category_list,null,function(jData){
			if(jData != null){
				var  oList = [];
				var dt = vmf.json.txtToObj(jData).categoryList//data.reportsList.options;
				$.each(dt,function(c,v){oList.push('<option value="' + v.id + '">' + v.name + '</option>');})
				$('#prodCategory').empty().append(oList.join('')).val('').change();
				$('#prodCategory option:first-child').attr("selected", "selected");
		if(vmf.dropdown && $("select#prodCategory").length && $("select#prodCategory").find("option").length>0){
				 $("select#prodCategory").css("width","300px")
				vmf.dropdown.build($("select#prodCategory"), {optionsDisplayNum:10,ellipsisSelectText:false,ellipsisText:'',optionMaxLength:70,inputMaxLength:40,position:"right",onSelect:ad.onCategoryChange,optionsId:"eaDropDownOpts",inputWrapperClass:"eaInputWrapper",spanpadding:true,spanClass:"corner-img-left"});
				$('#eaDropDownOpts a:first').css({"border-bottom":"1px dotted #aaa"});
		}
			}
		},function(){},ad.genericError);
	},
	genericError :function(){},
	onCategoryChange:function(){
		var sel = $("select#prodCategory");
		 $('.paneLeft,.paneRight').removeAttr('style');
		var opt =   $(sel).find('option:selected').val();
		if(opt=="000")
			$('#tab_all ul.products, .BTP').show();
		else {
			$('#tab_all ul.products, .BTP').hide();
			$('#tab_all').find('ul#'+opt).show();
			if($('.paneLeft ul:visible').length==0){
				 $('.paneLeft').css({'width':'0','margin':'0'})
				 $('.paneRight').css({'margin':'0'})
			}	
		}
	},
	renderAllProd1:function(resp){
		ad.loadProdCategories();
	},
	renderAllProd:function(resp){
	    $(".right-side-panel").hide();
		ad.loadProdCategories();
		var plist = vmf.json.txtToObj(resp).productCategoryList;
		var achtml=[];
		var itemTxt ="";
		var linksTxt="";
		var linksButTxt="";
		var buttonTxt="";
		var iconholder="";
		var randomImageNumber = 0;
		var $paneLeft= $("<div class='paneLeft'></div>").appendTo(ad.cMap.cnt);
		/*var $paneRight= $("<div class='paneRight'></div>").appendTo(ad.cMap.cnt);   --Not Required */
		var container = $paneLeft;
		$.each(plist, function(i,item){
			/* if((plist.length/2) <= i) {ad.cMap.cnt.append(container); container=  $paneRight;}  --Not Required */
			if(i==(plist.length-1)){
				achtml.push("<ul  id='"+item.id+"' class=\"products lastProdUl\">");
			}
			else{
				achtml.push("<ul  id='"+item.id+"' class=\"products\">")
			}
			
			randomImageNumber = Math.floor((Math.random()*6))
			iconholder = "<p class='iconholder ich"+randomImageNumber+"'> </p>";
			if(i==0){
				achtml.push("<li tabindex='1' class='product focusli' idx='"+i+"'>"+iconholder+item.name);
			}
			else{
				achtml.push("<li class='product' idx='"+i+"'>"+iconholder+item.name + "<span class='BTP'> " + rs.lblBackToTop +" </span></li>");
			}
			$.each(item.proList,function(j,child){
				if(j==(item.proList.length-1)){
					itemTxt = "<li class='prodChilds liLast' idx='"+j+"'>";
				} 
				else{				
					itemTxt = "<li class='prodChilds' idx='"+j+"'>";
				}
				itemTxt +="<div class='warpLongText'>"+child.name +"</div>";
				linksButTxt = "<span>";
				buttonTxt="";
				linksTxt="";
				$.each(child.actions,function(k,action){
					if(action.type=="button"){
						buttonTxt += "<a class='download' href='"+action.target+"'>"+action.linkname+"</a>"
					}	
					else{
                        linksTxt += "<a href='"+action.target+"'>"+action.linkname+"</a>"
					}		
				})
				linksButTxt += buttonTxt+linksTxt+"</span>"
				itemTxt += linksButTxt+"</li>";
				linksButTxt = "";
				achtml.push(itemTxt);
			});
			achtml.push("</ul>")
			container.append($(achtml.join('')));
			achtml = [];
		});
		ad.cMap.cnt.find('div.loading').remove();
		setTimeout(function(){
			myvmware.ad.showProductsHoverMenuBeak();
		}, 2000);
	},
	renderAtoZProd:function(resp){
	 $(".right-side-panel").hide();
		var A_Zlist = vmf.json.txtToObj(resp).productCategoryList;
		var plist = A_Zlist[0].proList;
		var achtml=[];
		var itemTxt ="";
		var linksTxt="";
		var linksButTxt="";
		var buttonTxt="";
		var $paneLeft= $("<div class='paneLeft'></div>").appendTo(ad.cMap.cnt);
		//var $paneRight= $("<div class='paneRight'></div>").appendTo(ad.cMap.cnt);
		var container = $paneLeft;
		$.each(plist,function(j,child){
		/*	if((plist.length/2) <= j) {
				ad.cMap.cnt.append(container); container=  $paneRight;
			} */
			if(j==(plist.length-1)){
				achtml.push("<ul  class=\"products lastProdUl\">");
			}
			else{
				achtml.push("<ul  class=\"products\">");
			}
			if(j==(plist.length-1)){
				itemTxt = "<li class='prodChilds liLast' idx='"+j+"'>";
			} 
			else{				
				itemTxt = "<li class='prodChilds' idx='"+j+"'>";
			}
			
			itemTxt +="<div class='warpLongText'>"+child.name +"</div>";
			linksButTxt = "<span>";
			buttonTxt="";
			linksTxt="";
			$.each(child.actions,function(k,action){
			
			if(action.type=="button"){
						buttonTxt += "<a class='download' href='"+action.target+"'>"+action.linkname+"</a>"
					}	
					else{
                        linksTxt += "<a href='"+action.target+"'>"+action.linkname+"</a>"
					}		
			})
			linksButTxt+=buttonTxt+linksTxt+"</span>"
			itemTxt += linksButTxt+"</li>";
			achtml.push(itemTxt);
			achtml.push("</ul>");
			container.append($(achtml.join('')));
			achtml = [];
		});
		ad.cMap.cnt.find('div.loading').remove();
	},getVmEan:function(){
        // This is the expected format of the url, once portal is ready this can be replaced by window.loction.href
        var rawUrl = 'http://my-dev4.vmware.com/group/vmware/downloads?_VM_EAN=111821860#tab1';
        //var rawUrl = window.location.href;
        var startPoint = 0, endPoint = 0;
        startPoint = rawUrl.indexOf('_VM');                
        endPoint = rawUrl.indexOf('#tab');                
        var eanToAttach = rawUrl.substring(startPoint, endPoint);
        return eanToAttach;
    }
}// End of ad

;function setFramedURL(dynamicURLPart,currentObj)
{
       var baseURL = "//" ;
       baseURL += window.location.host.replace("my","www");
       baseURL += dynamicURLPart;
       currentObj.href = baseURL;
};

$(".products .BTP").live('click',function(){
	  $(".focusli").focus();
});
