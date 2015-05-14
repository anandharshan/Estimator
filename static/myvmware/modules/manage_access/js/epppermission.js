if (typeof epp == "undefined") epp = {};
epp.perm = {
    init: function () {
        //Bind events for remaining tabs
        $("#tab1").unbind('click').bind('click', function () {
            window.location = epp.globalVar.licenseFolderViewRenderURL
        });
        $('#tab2').unbind('click').bind('click', function () {
            window.location = epp.globalVar.renderManageAccessByUser
        });
        $('#tab3').unbind('click').bind('click', function () {
            window.location = epp.globalVar.renderManageAccessByContract
        });
        $('#tab4').unbind('click').bind('click', function () {
            window.location = epp.globalVar.renderManageAccessMyPermissions
        });
        //Load data in Funds pane
        epp.perm.getFundDetails();
        //Send tracking request
        vmf.scEvent = true;
        epp.perm.adjustHt(); //Adjusting pane height/width
        callBack.addsc({
            'f': 'riaLinkmy',
            'args': ['users-permissions : epp']
        });
    },
    getFundDetails: function () {
        epp.perm.resetPage(); //Reset the page to default state
        //Send the request to controller to fetch data
        vmf.ajax.post(epp.globalVar.getFundsUrl, {
            'selectedEANumber': epp.perm.getSelectedEA
        }, epp.perm.loadFunds, epp.perm.error,
        function () {
            $("#prodTreeLoading").addClass("hidden")
        }, null, function () {
            $("#prodTreeLoading").removeClass("hidden")
        });
    },
    loadFunds: function (data) {
        if (typeof data != "object") data = vmf.json.txtToObj(data); //Evaluating the data
        var fundJson = data.userFundList, //Take funds in a object
            aTree = $("<ul></ul>"), //Store the tree structure in an object before appending to DOM
            chTree = null; //Store the child tree in this object, before appending to DOM
        if (fundJson.length > 0) {
            $.each(fundJson, function (i, item) {
                aTree.append($("<li class=\"level1 folderlist\"><span class=\"pName folderNode\"><a class=\"openClose\" class=\"pName\" pId=" + item.fId + "></a>" + item.fName + "</span></li>").data("fD", {
                    "fN": item.foFName,
                    "lN": item.foLName,
                    "em": item.foEmail,
					"fo": item.isFO
                }));
                if (item.sFund.length > 0) {
                    chTree = $("<ul style=\"display:none;\"></ul>");
                    $.each(item.sFund, function (j, sfData) {
                        chTree.append($("<li class=\"level2 folderlist no_child\"><span pCode=" + sfData.sfId + " class=\"pName folderNode\">" + sfData.sfName + ((sfData.primaySf=="Y")?'<span class=\"badge primary\">PRIMARY</span>':'')+"</span></li>").data("fD", {
                            "fN": sfData.fuFName,
                            "lN": sfData.fuLName,
                            "em": sfData.fuEmail
                        }));
                    });
                    aTree.append(chTree);
                }
            });
            $("#fundList").append(aTree);
            $("#selectFundInfoDiv").show();
        } else {
            $("#emptyTree").removeClass("hidden");
        }
        epp.perm.bindEvents();
		epp.perm.adjustHt();
    },
    bindEvents: function () {
        $("#fundList a.openClose").unbind('click').bind('click', function (e) {
            if ($(this).closest('li').next("ul").length) { //toggle next ul if available
                $(this).toggleClass("open").closest('li').next().animate({
                    height: 'toggle',
                    opacity: 'toggle'
                });
            }
            e.preventDefault();
            e.stopPropagation();
        });
        $("#fundList li span").unbind('mouseover click').bind('mouseover click', function (e) {
            if (e.type == "mouseover") {
                $("#fundList li span").removeClass('hover');
                $(this).addClass('hover');
            } else {
                if ($(this).hasClass("active")) return;
                $("#fundList li span").removeClass('active');
                $(this).addClass('active');
                $("#selectFundInfoDiv").hide();
                var o = false,
                    oInfo, sInfo,
					fnId;
                if ($(this).closest('li').hasClass("level1")) {
                    oInfo = $(this).closest('li').data("fD");
                    o = true;
                } else {
                    sInfo = $(this).closest('li').data("fD");
                    oInfo = $(this).closest('ul').prev('li.level1').data("fD");
                }
                $("#userDiv ul").html("<li class=\"without_icon active "+((o)?'o':'')+" \"><label>" + ((o)?oInfo.fN:sInfo.fN)+ " " + ((o)?oInfo.lN:sInfo.lN) + "</label></li>");
				$("#owner").find("label").html(oInfo.fN + " " + oInfo.lN).end().find(".title").html(ice.globalVars.fundOwner).end().find(".email").html("<a href=\"mailto:" + oInfo.em + "\">" + oInfo.em + "</a>").end().show();
                if (!o) {
					fnId = $(this).closest('ul').prev('li.level1').find('a.openClose').attr('pid');
                    $("#user").find("label").html(sInfo.fN + " " + sInfo.lN).end().find(".title").html("Fund User").end().find(".email").html("<a href=\"mailto:" + sInfo.em + "\">" + sInfo.em + "</a>").end().show();
                    if(oInfo.fo) {
						$("#userPermissionPane table tr.perText td").html("<div class=\"userP\">" + epp.globalVar.userPermission + "</div><div>" + epp.globalVar.ownerPermission1 + epp.globalVar.overviewUrl + "?_VM_fundDetails=true&_VM_back=false&_VM_preSelect=default&_VM_FundID=" + fnId + epp.globalVar.ownerPermission2 + "</div>");
					}else{
						$("#userPermissionPane table tr.perText td").html("<div class=\"userP\">" + epp.globalVar.userPermission + "</div><div>" + epp.globalVar.ownerPermission + "</div>");
					}
                } else {
					fnId = $(this).find('a.openClose').attr('pid');
                    $("#user").hide();
                    if(oInfo.fo) {
						$("#userPermissionPane table tr.perText td").html(epp.globalVar.ownerPermission1 + epp.globalVar.overviewUrl + "?_VM_fundDetails=true&_VM_back=false&_VM_preSelect=default&_VM_FundID=" + fnId + epp.globalVar.ownerPermission2);
					}else{
						$("#userPermissionPane table tr.perText td").html(epp.globalVar.ownerPermission);
					}
                }
                $("#userPermissionPane").show();
            }
        });
        $("button.fn_cancel").unbind('click').bind('click',function(){vmf.modal.hide()})
    },
    error: function () {vmf.modal.show("errorModal")},
    getSelectedEA: function () {
        return $("#eaSelectorDropDown option:selected").val();
    },
    resetPage: function(){
        $("#fundList ul, #userDiv ul li").remove();
        $("#emptyTree").addClass("hidden");
        $("#owner, #user, #userPermissionPane, #selectFundInfoDiv").hide();
    },
	adjustHt: function(){
		myvmware.common.adjustPanes();
		var cHeight = ($("#content-section").height() > parseInt($("#content-section").css("min-height")))? parseInt($("#content-section").css("min-height")) : $("#content-section").height();
		var folderHeight = $("section.column .scroll").height()+(cHeight-$("#epp").height());
		folderHeight = (folderHeight>428)? folderHeight: 428;
		$("section.column .scroll").height(folderHeight+"px");
	}
}
window.onresize=epp.perm.adjustHt;

if (typeof ice=="undefined") ice={};
if (typeof ice.eaSelector=="undefined") ice.eaSelector={};
ice.eaSelector.impl={
	beforeEaSelectorChange:function(){
		//no implementation required
	},
	afterEaSelectorChange_success:function(){
        epp.perm.getFundDetails();
		$("#owner").find("label").html(oInfo.fN + " " + oInfo.lN).end().find(".title").html(ice.globalVars.fundOwner).end().find(".email").html("<a href=\"mailto:" + oInfo.em + "\">" + oInfo.em + "</a>").end().show();
	},
	afterEaSelectorChange_error:function(){
		epp.perm.error();
	}
};