/* 1. Resource bundle for all the text , map
2. map for identifying the containers, event handlers
3.

1. decide which containers to display , identify the urls to data calls
2. decide the event handlers to be attached / detached
3. identify the view state to be shown ( involves showing and hiding )
a. manage the view state navigation ( involves showing and hiding )
4. close : clean up the containers and data */

/* The following object literal contains all the resources ( text strings ) used in Manage Licenses modals. This will go in to the JSP page */

if (typeof(myvmware) == "undefined") {
    myvmware = {};
}
ml = {};
myvmware.managelicenses = {
    init: function() {
        ml = myvmware.managelicenses;
        //Following variables must be reset to default values on closing popup
        ml.$modalRef = null;
        ml.mlType = "";
        ml.isCheckUpgrade = false;
        ml.isOptionSelected = false;
        ml.maxAllowedLicenseKeys = 50; // For performing upgrade 
        ml.selectedOption = -1;
        ml.selectedOptionObj = {};
        ml.qtyDirtyFlag = false;
        ml.licenseQuantitiesData = {};
        ml.isManyFromProducts = false;
        ml.currentViewState = "";
        ml.selectedLicenses = [];
        ml.moveToFolderID = "";
        ml.moveToFolderPath = "";
        ml.moveLicensesPreviewData = {};
        ml.refreshLicensesPane = false;
        /* flag to reload the licenseKey pane in the main page... cleaned up in the destructor method */
        ml.refreshProductsPane = false;
        ml.haveCustomLabels = false;
        // add methods to capture post data
        ml.mlMap = {
            combine: {
                initFun: ml.showCombineLicensesModal,
                mainCntr: "clSelection",
                dataTableData: [],
                postUrl: mlRS.combine.url.confirmActionUrl,
                postFun: ml.postDataCombine,
                renderFun: ml.common.renderClDlSuccess,
                rHeading: mlRS.combine.txt.resultHeading,
                successHeadingMsg: mlRS.combine.txt.finalSuccessMsg,
                resultKey: mlRS.result.resultCombineKey
            },
            divide: {
                initFun: ml.showDivideLicensesModal,
                mainCntr: "dlContainer",
                postFun: ml.postDataDivide,
                postUrl: mlRS.divide.url.confirmActionUrl,
                renderFun: ml.common.renderClDlSuccess,
                rHeading: mlRS.divide.txt.resultHeading,
                successHeadingMsg: mlRS.divide.txt.finalSuccessMsg,
                resultKey: mlRS.result.resultDivideKey
            },
            downgradeLicense: {
                initFun: ml.showDowngradeLicensesModal,
                mainCntr: "dglContainer",
                postFun: ml.postDataDowngrade,
                postUrl: mlRS.downgradeLicense.url.confirmActionUrl,
                renderFun: ml.common.renderDgUpSuccess,
                rHeading: mlRS.downgradeLicense.txt.resultHeading,
                successHeadingMsg: mlRS.downgradeLicense.txt.finalSuccessMsg
            },
            move: {
                initFun: ml.handleMoveLicenses,
                mainCntr: "mvlContainer",
                postFun: ml.common.preparePostDataToMoveLicenses,
                postUrl: mlRS.move.url.confirmActionUrl,
                renderFun: ml.common.renderMoveSuccess,
                rHeading: mlRS.move.txt.resultHeading,
                successHeadingMsg: mlRS.move.txt.finalSuccessMsg
            },
            upgradeLicense: {
                initFun: ml.handleUpgradeLicenses,
                mainCntr: "uglContainer",
                postFun: ml.postDataUpgrade,
                postUrl: mlRS.upgradeLicense.url.confirmActionUrl,
                renderFun: ml.common.renderDgUpSuccess,
                rHeading: mlRS.upgradeLicense.txt.resultHeading,
                successHeadingMsg: mlRS.upgradeLicense.txt.finalSuccessMsg
            }
        };

        ml.omniture = {
            combine: {
                start: 'vmware : my : group : my-licenses : combine',
                blank: 'vmware : my : group : my-licenses : combine : leave-labels-blank',
                newL: 'vmware : my : group : my-licenses : combine : create-new-labels',
                continueB: 'vmware : my : group : my-licenses : combine : continue',
                confirmB: 'vmware : my : group : my-licenses : combine : confirm',
                cancel: 'vmware : my : group : my-licenses : combine : cancel',
                continueNLB: 'vmware : my : group : my-licenses : combine : new-label-confirm',
                cancelNLB: 'vmware : my : group : my-licenses : combine : new-label-cancel',
                email: 'vmware : my : group : my-licenses : combine : send-email'
            },
            divide: {
                start: 'vmware : my : group : my-licenses : divide',
                blank: 'vmware : my : group : my-licenses : divide : leave-labels-blank',
                newL: 'vmware : my : group : my-licenses : divide : create-new-labels',
                copyL: 'vmware : my : group : my-licenses : divide : copy-labels',
                continueB: 'vmware : my : group : my-licenses : divide : continue',
                confirmB: 'vmware : my : group : my-licenses : divide : confirm',
                cancel: 'vmware : my : group : my-licenses : divide : cancel',
                continueNLB: 'vmware : my : group : my-licenses : divide : new-label-confirm',
                cancelNLB: 'vmware : my : group : my-licenses : divide : new-label-cancel',
                email: 'vmware : my : group : my-licenses : divide : send-email'
            },
            move: {
                start: 'vmware : my : group : my-licenses : move',
                confirmB: 'vmware : my : group : my-licenses : move : confirm',
                cancel: 'vmware : my : group : my-licenses : move : cancel',
                addF: 'vmware : my : group : my-licenses : move : add-folder',
                cancelF: 'vmware : my : group : my-licenses : move : cancel-folder',
                email: 'vmware : my : group : my-licenses : move : send-email'
            },
            downgradeLicense: {
                start: 'vmware : my : group : my-licenses : downgrade',
                blank: 'vmware : my : group : my-licenses : downgrade : leave-labels-blank',
                newL: 'vmware : my : group : my-licenses : downgrade : create-new-labels',
                copyL: 'vmware : my : group : my-licenses : downgrade : copy-labels',
                continueB: 'vmware : my : group : my-licenses : downgrade : continue',
                confirmB: 'vmware : my : group : my-licenses : downgrade : confirm',
                cancel: 'vmware : my : group : my-licenses : downgrade : cancel',
                continueNLB: 'vmware : my : group : my-licenses : downgrade : new-label-confirm',
                cancelNLB: 'vmware : my : group : my-licenses : downgrade : new-label-cancel',
                email: 'vmware : my : group : my-licenses : downgrade : send-email'
            },
            upgradeLicense: {
                start: 'vmware : my : group : my-licenses : upgrade',
                blank: 'vmware : my : group : my-licenses : upgrade : leave-labels-blank',
                newL: 'vmware : my : group : my-licenses : upgrade : create-new-labels',
                copyL: 'vmware : my : group : my-licenses : upgrade : copy-labels',
                continueB: 'vmware : my : group : my-licenses : upgrade : continue',
                confirmB: 'vmware : my : group : my-licenses : upgrade : confirm',
                cancel: 'vmware : my : group : my-licenses : upgrade : cancel',
                continueNLB: 'vmware : my : group : my-licenses : upgrade : new-label-confirm',
                cancelNLB: 'vmware : my : group : my-licenses : upgrade : new-label-cancel',
                email: 'vmware : my : group : my-licenses : upgrade : send-email'
            }
        }

        ml.viewStates = {
            "selection": "selection",
            "notesLabels": "notesLabels",
            "result": "result"
        };
    },
    common: {
        /*-----------------------------------------------------------------------------*/
        //Common / Helper  methods for all the flows of managing license keys go here.
        /*-----------------------------------------------------------------------------*/

        /**
         * Updates text in header portion of the modal window.
         */
        updateHeader: function(headerText, showDesc) {

            headerText = typeof headerText !== "undefined" ? headerText : mlRS[ml.mlType].txt.heading;
            showDesc = typeof headerText !== "undefined" ? showDesc : true;
            //Update heaer text
            //ml.$modalRef.find('#heading').html(mlRS[ml.mlType].txt.heading);
            ml.$modalRef.find('#heading').html(headerText);
            //Update description text
            var descText = '';
            if (showDesc) {
                if (ml.currentViewState === ml.viewStates.selection) {
                    descText = mlRS[ml.mlType].txt.selHeadingDesc;
                } else if (ml.currentViewState == ml.viewStates.notesLabels) {
                    descText = mlRS.common.nlHeadingDesc;
                }
                ml.$modalRef.find('#headingDesc').html(descText);
            } else {
                ml.$modalRef.find('#headingDesc').html("");
            }
        },
        /**
         * Updates text in notes and labels selection portion of the modal window.
         */
        updateNotesAndLabels: function() {
            if (ml.mlType === "move") {
                //Do not display notes and labels selection for move licenses
                ml.$modalRef.find("#mlNotesLabelsSel").hide();
            } else {
                ml.$modalRef.find('#nlHeading').html(mlRS[ml.mlType].txt.notesAndCustomLabelsHeading)
                    .end().find('#nlLeaveBlankText').html(mlRS[ml.mlType].txt.leaveBlankNotesText)
                    .end().find('#nlCopyExistingText').html(mlRS[ml.mlType].txt.copyExistingNotesText)
                    .end().find('#nlCreateNewText').html(mlRS[ml.mlType].txt.createNewNotesText);

                // while initializing the notes&labels radios, leaveBlank checkbox to be checked by default
                ml.$modalRef.find('#leaveBlank').attr('checked', 'checked');

                ml.events.validateNotesTA(300);
            }
        },
        /**
         *Updates text in attention portion of the modal window.
         */
        updateAttentionText: function() {
            ml.$modalRef.find('#attentionHeader').html(mlRS.common.attentionHeading)
                .end().find('#attentionMsg').html(mlRS[ml.mlType].txt.attentionMessageText)
                .end().find('#disclaimerContainer').html('<strong>' + mlRS[ml.mlType].txt.disclaimerText + '</strong>');
        },
        /**
         * Updates text labels for action buttons ( buttons in footer portion of the modal window ).
         */
        updateActionButtonsText: function() {
            ml.$modalRef.find('#backButton').html(mlRS.common.backButtonText)
                .end().find('#continueButton').html(mlRS.common.continueButtonText)
                .end().find('#confirmButton').html(mlRS.common.confirmButtonText)
                .end().find('#cancelButton').html(mlRS.common.cancelButtonText)
                .end().find('#okButton').html(mlRS.common.okButtonText);
        },
        /**
         * Updates the attention text and buttons text in bulk move alert modal window.
         */
        updateBulkMoveModalText: function() {
            ml.$modalRef.find('#mlAttention').find('span.boldText').html(mlRS.common.attentionHeading);
            ml.$modalRef.find('#bulkMoveattentionMsg').html(mlRS.move.txt.bulkMoveAttentionText);
            ml.$modalRef.find('#bulkMoveContinueBtn').html(mlRS.common.continueButtonText);
            ml.$modalRef.find('#bulkMoveCancel').html(mlRS.common.cancelButtonText);
        },

        /**
         * Handles navigation between multiple view states  inside modal window.
         * Possible view states are 1) Selection 2) Notes and Labels 3) confirmation.
         */
        navigateTo: function(viewState) {
            //Save the view state to which the user is navigating
            ml.currentViewState = viewState;
            ml.$modalRef.find(".mlView").hide();
            //Update text in header portion
            ml.common.updateHeader();
            //Update display of action buttons
            ml.common.toggleActionButtons(viewState);

            if (viewState === "selection") {
                ml.$modalRef.find("#mlCenterContainer").show();
                ml.$modalRef.find("#" + ml.mlMap[ml.mlType].mainCntr).show();
                ml.$modalRef.find('#innerCon').addClass('innerConHt');
            } else if (viewState === "notesLabels") {
                ml.$modalRef.find("#mlNotesLabels").show();
                ml.$modalRef.find('#innerCon').removeClass('innerConHt');
            } else if (viewState === "result") {
                ml.$modalRef.find("#mlResult").show();
                ml.common.initializeZeroclip();
                ml.$modalRef.find('#innerCon').removeClass('innerConHt');
            }
        },
        /**
         * Handles visibility of actions buttons ( in footer portion of the modal window ).
         */
        toggleActionButtons: function(viewState) {
            ml.$modalRef.find("#mlActions button").show();
            ml.$modalRef.find("#editQtyButton,#saveQtyButton").hide();
            if (viewState === "selection") {
                ml.$modalRef.find("#backButton, #okButton").hide();
                ml.handlers.handleNlRadioChange();
                if (ml.mlType == "upgradeLicense") {
                    ml.$modalRef.find("#confirmButton").hide();
                }
            } else if (viewState === "notesLabels") {
                //Upgrade options specific                                   
                ml.$modalRef.find("#continueButton, #okButton").hide();
            } else if (viewState === "result") {
                ml.$modalRef.find("#backButton, #continueButton, #confirmButton, #cancelButton,#editQtyButton,#saveQtyButton").hide();
            }
        },
        /**
         * Adds Get help Icon to the Modal
         */
        updateGetHelp: function() {
            $('#simplemodal-container').prepend('<a class="help" href="javascript:myvmware.common.openHelpPage(&#39;' + mlRS[ml.mlType].txt.getHelp + '&#39;);"></a>');
        },
        /**
         * To initialize Zero clip board module - To enable copy button functionality
         */
        initializeZeroclip: function() {
            $(window).scrollTop(0);
            vmf.zeroClipboardShow.init("#btncopyToClipboard", mlRS.result.lblCopied);
        },
        /* @method to render the result of combine license and divide license result.
         * @param {JSON} response
         */
        renderClDlSuccess: function(response) {
            ml.refreshLicensesPane = true;
            /*
             * @ variables to hold rendering result
             */
            var oldKeyHtml = [],
                newKeyHtml = [],
                newProdName = '';
            // To construct html structre for old license key list
            oldKeyHtml.push('<ul class="oldKeyResultList">');
            $.each(response.oldLicenseList, function(key, value) {
                oldKeyHtml.push('<li class="leftList">' + value.licenseKey + '&nbsp;' + '</li><li class="rightList"><span class="instanceCount">' + value.quantity + '&nbsp;' + value.unitOfMeasure + '&nbsp;' + '</span>' + '</li>');
            });
            oldKeyHtml.push('</ul>');
            // Append list to oldKey container
            ml.$modalRef.find('#oldKeyContainer').append(oldKeyHtml.join(''));
            // To construct html structre for new license key list
            newKeyHtml.push('<ul class="newKeyResultList">');
            $.each(response.newLicenseList, function(key, value) {
                newProdName = value.productName;
                newKeyHtml.push('<li class="leftList">' + value.licenseKey + '&nbsp;' + '</li><li class="rightList"><span class="instanceCount">' + value.quantity + '&nbsp;' + value.unitOfMeasure + '&nbsp;' + '</span>' + '<span class="newBadge">' + mlRS.result.newKey + '&nbsp;' + '</span>' + '</li>');
            });
            newKeyHtml.push('</ul>');
            ml.$modalRef.find('#oldHeading').html(ml.mlMap[ml.mlType].rHeading)
                .end().find('#newHeading').html(ml.mlMap[ml.mlType].resultKey + '&nbsp;' + newProdName + ':');
            // Append list to newKey container
            ml.$modalRef.find('#cLdLheading').html(ml.mlMap[ml.mlType].newClDlHeading);
            ml.$modalRef.find('#cLdLheading').show();
            ml.$modalRef.find("#successMessage").show();
            ml.$modalRef.find('#newKeyContainer').append(newKeyHtml.join(''));
            ml.$modalRef.find("#okButton").show();
            // method to set text for copy button
            ml.common.setTextForCopy();
        },
        renderMoveSuccess: function(response) {
            var len1,
                moveFromString,
                i,
                len2,
                _folderName,
                j;
            if (typeof response === "object") {
                ml.refreshLicensesPane = true; // updating the licenses-refreshing flag TEMPORARILY. update the flag updating when the service is ready
                ml.$modalRef.find(".moveWrapper").show();
                ml.$modalRef.find("#successMessage").show();
                ml.$modalRef.find("#movedToCntr h2").html(mlRS.result.moveResult);
				ml.$modalRef.find("#movedToCntr").append("<div>"+response.targetFolder+"</div>");

                len1 = ml.moveLicensesPreviewData.folder.length;
                moveFromString = "";
                for (i = 0; i < len1; i++) {
                    len2 = ml.moveLicensesPreviewData.folder[i].licenseKeys.length;
                    _folderName = ml.moveLicensesPreviewData.folder[i].name;
                    moveFromString +=  '<p class="movedHeading">' +_folderName+ '&nbsp;' + '</p>' ;
                    for (j = 0; j < len2; j++) {
						moveFromString +=   '<p>' + ml.moveLicensesPreviewData.folder[i].licenseKeys[j] + '&nbsp;' + '</p>';
                    }
                }
                ml.$modalRef.find("#movedFromCntr h2").html(mlRS.result.movedFrom);
                ml.$modalRef.find("#movedFromCntr").append(moveFromString);

            } else if (typeof response === "string") {

                if (response === "S") { // bulk move success
                    ml.refreshLicensesPane = true; // updating the licenses-refreshing flag TEMPORARILY. update the flag updating when the service is ready

                    ml.$modalRef.find("#bulkMoveuccessMessage").show();
                    ml.$modalRef.find(".resultContainer").hide();
                    ml.$modalRef.find(".sendBtnContainer").hide();
                } else {
                    ml.$modalRef.find(".moveWrapper").hide();
                    ml.common.renderError(response);
                }
            }
            ml.$modalRef.find("#okButton").show();
            // method to set text for copy button
                        ml.common.setTextForMoveCopy();
        },
        /*
         * @method  to render downgrade license and upgrade license result
         * @param {JSON} response
         */
        renderDgUpSuccess: function(response) {
            // variables to hold differenent operation result
            var deActivatedList = [],
                upDatedLicense = [],
                remaningLicenses = [],
                newProdName = '',
                targetProductList,
                baseProductList,
                instanceType = '',
                targetProdLen, i;

            // To construct html structre for old license key list
            deActivatedList.push('<ul class="oldKeyResultList">');
            $.each(response.deactivatedLicenses, function(key, value) {
                value[3] = (value[3] == undefined) ? "" : value[3];
                deActivatedList.push('<li class="leftList">' + value[0] + '&nbsp;' + '</li><li class="rightList"><span class="instanceCount">' + value[1] + '&nbsp;' + value[2] + '</span><span class="uglFolderPath">' + value[3] + '</span></li>');
                instanceType = value[2];
            });
            deActivatedList.push('</ul>');
            // if the operation is restricted downgrade
            if (response.restrictedProductDowngrade) {
                upDatedLicense.push('<ul class="oldKeyResultList">');
                upDatedLicense.push('<li>' + response.restrictedProductDowngrade.actualRestrictedDowngradedProduct + ' <span class="instanceCount">' + response.restrictedProductDowngrade.totalUpgradeDowngradeQuantity + ' ' + instanceType + '</span></li>');
                upDatedLicense.push('</ul>');
            } else if (response.restrictedProductUpgrade) { // if the operation is restricted upgrade
                upDatedLicense.push('<ul class="oldKeyResultList">');
                upDatedLicense.push('<li>' + response.restrictedProductUpgrade.actualRestrictedUpgradedProduct + ' <span class="instanceCount">' + response.restrictedProductUpgrade.totalUpgradeDowngradeQuantity + ' ' + instanceType + '</span></li>');
                upDatedLicense.push('</ul>');
            } else {
                // Append list to oldKey container
                targetProdLen = response.targetProductDetails.length;
                for (i = 0; i < targetProdLen; i++) {
                    upDatedLicense.push('<p>' + response.targetProductDetails[i].targetProduct + ':' + '</p>');
                    targetProductList = response.targetProductDetails[i].targetProductLicenses;
                    upDatedLicense.push('<ul class="newKeyResultList">');
                    $.each(targetProductList, function(key, value) {
                        value[3] = (value[3] == undefined) ? "" : value[3];
                        upDatedLicense.push('<li class="leftList">' + value[0] + '&nbsp;' + '</li><li class="rightList"><span class="instanceCount">' + value[1] + '&nbsp;' + value[2] + '</span>' + '<span class="newBadge">' + mlRS.result.newKey + '</span><span class="uglFolderPath">' + value[3] + '</span></li>');
                    });
                    upDatedLicense.push('<li class="clear"></li>');
                    upDatedLicense.push('</ul>');
                }
            }
            if (response.baseProductDetails) { // In partial downgrade/upgrade operation baseProductDetails obj will be present in response
                ml.refreshLicensesPane = true;

                // render base product list
                $.each(response.baseProductDetails, function(key, value) {
                    remaningLicenses.push('<p>' + value.baseProduct + ':' + '</p>');
                    baseProductList = value.baseProductLicenses;
                });
                // render remaning product list
                remaningLicenses.push('<ul class="remaningKeyList">');
                $.each(baseProductList, function(key, value) {
                    value[3] = (value[3] == undefined) ? "" : value[3];
                    remaningLicenses.push('<li class="leftList">' + value[0] + '&nbsp;' + '</li><li class="rightList"><span class="instanceCount">' + value[1] + '&nbsp;' + value[2] + '</span>' + '<span class="newBadge">' + mlRS.result.newKey + '&nbsp;' + '</span><span class="uglFolderPath">' + value[3] + '</span></li>');
                });
                remaningLicenses.push('<li class="clear"></li>');
                remaningLicenses.push('</ul>');
            } else { //In FULL downgrade/upgrade operation baseProductDetails obj will not be present in response
                ml.refreshProductsPane = true;
            }
            ml.$modalRef.find('#oldKeyContainer').append(deActivatedList.join(''));
            ml.$modalRef.find('#oldHeading').html(ml.mlMap[ml.mlType].rHeading)
                .end().find('#newHeading').html(mlRS.result.resultUpgradeKey + '<p>' + newProdName + '</p>');
            ml.$modalRef.find('#newKeyContainer').append(upDatedLicense.join(''));
            ml.$modalRef.find("#successMessage").show();
            ml.$modalRef.find('#remaningKeyContainer').append(remaningLicenses.join(''));
            ml.$modalRef.find("#okButton").show();
            // method to set text for copy functionality
            ml.common.setTextForCopy();
        },
        renderError: function(response) {
            var errorMsg = response || mlRS.error.generalAjaError;
            ml.$modalRef.find('#mlErrorContainer').html(mlRS.error.generalAjaError)
                .end().find('#mlErrorContainer').show();
            ml.$modalRef.find("#okButton").show();
        },
        // Zeroclipboard plugin needs data without html structure to avoid unnecessary space and carriage return
        setTextForCopy: function() {
            var printData = [];
            ml.$modalRef.find('#resultDataContainer').children().each(function(index) {
                if ($.trim($(this).text()) != '') {
                    printData.push($.trim($(this).text()));
                }
            });
            ml.$modalRef.find('#printContainer').html(printData.join("\r\n"));
        },
                        // Fix for BUG-00069811, quick fix need to find a better solution
                setTextForMoveCopy:function(){
                var printData = [];
                ml.$modalRef.find('#resultDataContainer').children().children().children().each(function(index){
                    if($.trim($(this).text()) != ''){
                        printData.push($.trim($(this).text()));
                    }
                });                    
                ml.$modalRef.find('#printContainer').html(printData.join("\r\n"));                
            },
        /**
         * Prepares DIV element to display custom lables Text Input
         */
        prepareCustomLabelCntr: function(clName, clContainerID, clInputID) {
			return "<div class='ctrlHolder clearfix' id='" + clContainerID + "'>"
			 	+ "<label >" + clName + "</label>"
			 	+ "<input type='text' placeholder='" + mlRS.common.value + "' value='' name='" + clName + "' id='" + clInputID + "'>"
			 	+ "<br class='clear'/>"
			 	+ "<div class='error_msg'>&nbsp;</div>"
			 + "</div>";
        },
        /**
         * Checks for special characters in string.
         * Used to validate the entry while entering 'custom label' values.
         */
        checkSpecialCharacters: function(txtval) {
            var splChars = "^~",
                eflag = false,
                i;
            for (i = 0; i < txtval.length; i++) {
                if (splChars.indexOf(txtval.charAt(i)) != -1 && !eflag) {
                    eflag = true;
                }
            }
            return eflag;
        },
        /**
         * Validates the 'custom label' values.
         * Checks for special characters (~^) and minimum length (3 chars).
         * Doesn't validate if the user leave the custom lable field blank.
         */
        validateCustomLabels: function() {
            var isFormValid = true;
            ml.$modalRef.find("#mlLabelsContainer div.ctrlHolder input[type='text']").each(function() {
                var clValue = $.trim($(this).val()),
                    isEntryValid = false,
                    splCharChk = false,
                    lengthChk = false,
                    errorMsg = '&nbsp;';
                if (clValue.length > 0) { //validate for non-empty
                    splCharChk = ml.common.checkSpecialCharacters(clValue);
                    lengthChk = clValue.length < 3;
                    if (splCharChk) {
                        errorMsg = mlRS.common.specialCharsValidationMsg;
                    } else if (lengthChk) {
                        errorMsg = mlRS.common.minLengthValidationMsg;
                    }
                }
                $(this).siblings("div.error_msg").html(errorMsg);
                isEntryValid = !(splCharChk || lengthChk);
                isFormValid = (isFormValid && isEntryValid);
            });
            return isFormValid;
        },
        /**
         * Prepares a concatenated string of custom label 'name' and 'value'.
         * Format : "name~value~NEW^name~value~NEW".
         * This string is used in the post request.
         */
        prepareCustomLabelsString: function() {
            var clStringArray = [],
                clPostString = "";
            ml.$modalRef.find("#mlLabelsContainer div.ctrlHolder input[type='text']").each(function() {
                var $this = $(this),
                    clValue = $this.val(),
                    clName = $this.attr("name");
                if ($.trim(clValue) != '' && clValue != $this.attr('placeholder')) {
                    clStringArray.push(clName + "~" + clValue + "~NEW");
                }
            });
            clPostString = clStringArray.join("^");
            return clPostString;
        },
        /**
         * Prepares LI element to display 'folder name' and associated licenses selected for moving.
         */
        prepareMoveFromListItem: function(folderName, licensesArray) {
            var len = licensesArray.length,
                licenseLI = "",
                moveFromLI,
                i;
            for (i = 0; i < len; i++) {
                licenseLI += "<li class='licenseItem'>" + licensesArray[i] + "</li>";
            }
			moveFromLI = "<li class='folderItem'><span class='moveFolderN ellipsisTxt'>" + folderName
				 + "</span><ul class='moveFromList'>"
				+licenseLI
				 + "</ul>"
				 + "</li>";
            return moveFromLI;
        },
        /**
         * Displays folder tree for all the available folders.
         */
        renderMoveToContainer: function() {

            var config = new Object();
            config.uniqueDiv = 'targetfolderPane';
            config.ajaxTimeout = 60000;
            config.wrapEllipseBtn = true;
            config.loadingClass = 'ajaxLoading';
            config.inputType = 'radio';
            //config.npMsgContent = fldConfnpMsgContent;
            /*config.npMsgFunction = function (msg) {
			ice.movekey.showExceptionMessages(msg);
			};*/
            config.cbOnClickFunction = function(folderId, cbState) {
                if ($('.' + folderId).children('span').hasClass('active')) {
                    $('.folderTxt').removeClass('normalWhiteSpace');
                    $('.' + folderId).children('span').find('.folderTxt').addClass('normalWhiteSpace').end().find('.openClose,input,.ellipsBadge').addClass('vAlignChilds');
                } else {
                    $('.' + folderId).children('span').find('.folderTxt').removeClass('normalWhiteSpace').end().find('.openClose,input,.ellipsBadge').removeClass('vAlignChilds');
                }
                var _folderHT = vmf.foldertreeAnother.getFolderHashtable(),
                    _folderId = _folderHT.get(folderId).folderId,
                    _fullFolderPath = _folderHT.get(folderId).fullFolderPath;
                //Store selected folder ID and folder path 
                ml.moveToFolderID = _folderId;
                ml.moveToFolderPath = _fullFolderPath;

                ml.common.handleFolderSelection(folderId, cbState);
            };
            config.cbOnFolderNodeCreate = function(folderElement, folderIds) {
                if (folderElement.find('li span').hasClass('disabled')) {
                    folderElement.find('li input[type=radio]').parent().append('<a class="tooltip" title="' + greyedOutFolderTooltip + '" data-tooltip-position="bottom" href="#">' + greyedOutFolderTooltip + '</a>');
                }
                myvmware.hoverContent.bindEvents($('a.tooltip'), 'defaultfunc');
            };
            config.validateJSONFunction = function(folderListJSON) {
                if (folderListJSON.error) {
                    ml.common.renderError(folderListJSON.message);
                }
            };
            config.errorFunction = function(response, errorDesc, errorThrown) {
                ml.common.renderError(folderListJSON.message);
            };
            var folderTreeResourceUrl = mlRS.move.url.foldersList;
            vmf.foldertreeAnother.build(folderTreeResourceUrl, config);
        },
        handleFolderSelection: function(folderId, cbState) {
            if (cbState == "checked") {
                //Disable 'add new folder link', 'disclaimer checkbox' and 'confirm' button 
                //Handle enabling or disabling based on the permissions retrieved 			
                ml.$modalRef.find('#fpDisclaimer').removeAttr('checked', 'checked').attr('disabled', 'disabled');
                ml.$modalRef.find('#confirmButton').attr('disabled', 'disabled').addClass('disabled');
                ml.$modalRef.find("#addNewFolderLink").removeClass("active");

                ml.ajax.getMinPermissionData(folderId, cbState);
            }
        },
        preparePostDataToMoveLicenses: function() {
            var _postData = {};
            _postData.targetFolderId = ml.moveToFolderID;
            _postData.targetFolderPath = ml.moveToFolderPath;

            if (!(ml.mlMap.move.postUrl == mlRS.move.url.bulkMove)) {
                _postData.selectedLicenseKeys = ml.selectedLicenses.join(',');
            }

            return _postData;
        },
        validateDowngradeDT: function(ele) {
            /* element to be validated is passed when onblur is executed. ELSE all the elements should be validated */
            var ele = ele || ml.$modalRef.find("#tbl_downgradelic input:text"),
                isDowngradeError = false;

            ele.removeClass('errorBorder').each(function() {
                var $this = $(this),
                    isnumber = /^-{0,1}\d*\.{0,1}\d+$/,
                    qtylen = $this.attr('id').length;
                maxId = $this.attr('id').substring(4, qtylen),
                isError = false,
                error_msg = '&nbsp;';
                if (!isnumber.test($this.val())) {
                    error_msg = ice.globalVars.enterNumericVal; //Note: static text needs to be moved to resource bundle
                    isError = true;
                } else if ($this.val() <= 0) {
                    error_msg = ice.globalVars.enterOneOrMoreMsg; //Note: static text needs to be moved to resource bundle
                    isError = true;
                } else if ($this.val() % 1 !== 0) {
                    error_msg = ice.globalVars.enterOneOrMoreMsg; //Note: static text needs to be moved to resource bundle
                    isError = true;
                } else if ($this.val() > parseInt($('#max_' + maxId).html())) {
                    error_msg = ice.globalVars.valueMustBeEqualMsg; //Note: static text needs to be moved to resource bundle
                    isError = true;
                }

                if (isError) {
                    isDowngradeError = true;
                    $this.addClass('errorBorder');
                }
                $this.closest('td').find('.error_msg').html(error_msg);
                                if(error_msg != '&nbsp;'){
                                    $this.closest('td').find('.error_msg').show();
                                }
                                else{
                                    $this.closest('td').find('.error_msg').hide();
                                }
                                
            });
            if (isDowngradeError) {
                ml.$modalRef.find("#tbl_downgradelic input[type=text].errorBorder")[0].focus();
            }
            return isDowngradeError;
        },
        validateUpgradeDT: function(ele) {
            /* element to be validated is passed when onblur is executed. ELSE all the elements should be validated */
            var ele = ele || ml.$modalRef.find("#tbl_upgradeLicenseQuantities input.totalQty"),
                isUpgradeError = false;
            ele.removeClass('errorBorder').each(function() {
                var $this = $(this),
                    isnumber = /^-{0,1}\d*\.{0,1}\d+$/,
                    qtylen = $this.attr('id').length;
                maxId = $this.attr('id').substring(4, qtylen),
                isError = false,
                error_msg = '';
                if (!isnumber.test($this.val())) {
                    error_msg = ice.globalVars.enterNumericVal; //Note: static text needs to be moved to resource bundle
                    isError = true;
                } else if ($this.val() <= 0) {
                    error_msg = ice.globalVars.enterOneOrMoreMsg; //Note: static text needs to be moved to resource bundle
                    isError = true;
                } else if ($this.val() % 1 !== 0) {
                    error_msg = ice.globalVars.enterOneOrMoreMsg; //Note: static text needs to be moved to resource bundle
                    isError = true;
                } else if ($this.val() > parseInt($(this).data().qtyToUpgradeAvail)) { // parseInt($('#max_' + maxId).html())
                    error_msg = ice.globalVars.valueMustBeEqualMsg; //Note: static text needs to be moved to resource bundle
                    isError = true;
                }

                if (isError) {
                    isUpgradeError = true;
                    $this.addClass('errorBorder');
                }
                $this.closest('td').find('.error_msg').html(error_msg);
            });
            if (isUpgradeError) {
                ml.$modalRef.find("#tbl_upgradeLicenseQuantities input[type=text].errorBorder")[0].focus();
            }
            return isUpgradeError;
        },
        renderUpgradeOptions: function(upgradeOptions) {

            ml.$modalRef.find('#uglContainer .loading, #uglErrorContainer, #okButton').hide();
            ml.$modalRef.find("#uglOptionsContainer, div.exportLicenseKey").show();
            var len = upgradeOptions.options.length;
            var i,
                upgradeOptionObj,
                upgradeToString,
                upgradeFromString,
                upgradeToHeight,
                upgradeFromHeight,
                upgradeString,
                varBgClr = "";

            ml.$modalRef.find("##uplOptionsContent table").empty();

            for (i = 0; i < len; i++) {

                upgradeOptionObj = upgradeOptions.options[i];

                upgradeToString = ml.common.prepareUpgradeTo(upgradeOptionObj.option, upgradeOptionObj.to, true, false, null);
                upgradeFromString = ml.common.prepareUpgradeFrom(upgradeOptionObj.option, true, upgradeOptionObj.from, false);

                varBgClr = (i%2 != 0 ? " style='background-color: #F5FAFF;'" : "");
                upgradeString = "<tr" + varBgClr + ">" + upgradeFromString + upgradeToString + "</tr>";
                ml.$modalRef.find("#uplOptionsContent table").append(upgradeString);
                //Setting the upgrade option data which is used to display selected option on the licenses page 
                ml.$modalRef.find("#uglOptionsContainer button.selectOption").eq(i).data("selectedOption", upgradeOptionObj);
            }

            //Register event handler for option select 
            ml.$modalRef.find("#uglOptionsContainer button.selectOption").unbind('click').bind('click', ml.handlers.handleUpgradeOptionSelect);
        },
        prepareUpgradeTo: function(option, upgradeTo, withDesc, withQty, upgradeFrom) {

            var len = upgradeTo.length;
            var upgradeToProduct,
                upgradeToLIs = "",
                upgradeToDIV = "",
                upgradeToProdDesc = "",
                userUpgradeQuantity = 0,
                qtyToUpgradeAvail = 0,
                totalQuantity = "",
                i;

            if (withQty && upgradeFrom != null){
            	//var fromLen = upgradeFrom.length;
            	var upgradeFromProduct = upgradeFrom[0];
            	var licenseKeyLen = upgradeFromProduct.licenseKeys.length;
            	var j;
            	for (j = 0; j < licenseKeyLen; j++){
            		userUpgradeQuantity += upgradeFromProduct.licenseKeys[j].userUpgradeQty;
            		qtyToUpgradeAvail += upgradeFromProduct.licenseKeys[j].qtyToUpgradeAvail;
            	}
            }
            for (i = 0; i < len; i++) {
                upgradeToProduct = upgradeTo[i];

                if (upgradeToProduct.productDesc != null && upgradeToProduct.productDesc != "") {
                    upgradeToProdDesc = "<p>" + upgradeToProduct.productDesc + "</p>";
                } else {
                    upgradeToProdDesc = "";
                }
                if (withQty){
                	totalQuantity = Math.round((upgradeToProduct.totalAvailQty *  userUpgradeQuantity) /  qtyToUpgradeAvail);
                	totalQuantity = totalQuantity + " " + upgradeToProduct.uom;
                }
                upgradeToLIs += "<li><span class='qtyUOM'>" + (withQty ? totalQuantity : "") + "</span><label>" + upgradeToProduct.productName + "</label>" + (withDesc ? upgradeToProdDesc : "") + "</li>";
            }

            upgradeToDIV = " <div class='uplToProduct'><ul>" + upgradeToLIs + "</ul></div>";

            if (withDesc) { // Select option button is only displayed in the modal window 
                upgradeToDIV += "<button id='option_" + option + "' class='button primary selectOption'>Select this option</button>";
            }
            upgradeToDIV = "<td class='uglToProducts'>" + upgradeToDIV + "</td>";

            return upgradeToDIV;
        },
        prepareUpgradeFrom: function(option, showOption, upgradeFrom, withQty) {

            var len = upgradeFrom.length;
            var nonAnchorDescDIV = "<div class='nonAnchorDesc'><p>This option requires you to upgrade other related products at the same time.</p><label>These products include:</label></div>";
            var upgradeFromDIV = "",
                optionLabel = "",
                anchorProductLbl = "",
                nonAnchorProductLbl = "",
                nonAnchorProducts = "",
                isAnchorProduct = false,
                upgradeFromProduct, i;

            if (len == 1) { // There is only one product, so it has to be an anchor product 
                if (showOption) {
                    optionLabel = "<span class='uplFromOption'><p>OPTION " + option + "</p></span>";
                }
                anchorProductLbl = "<span class='qtyUOM'>" + (withQty ? upgradeFrom[0].totalAvailQty : "") + "</span><label class='anchorProduct'>" + upgradeFrom[0].productName + "</label>";
                upgradeFromDIV = "<div class='uplFromProduct'>" + optionLabel + anchorProductLbl + "</div>";
            } else {
                for (i = 0; i < len; i++) {
                    upgradeFromProduct = upgradeFrom[i];
                    isAnchorProduct = (upgradeFromProduct.anchor === "TRUE") ? true : false;
                    if (isAnchorProduct) {
                        if (showOption) {
                            optionLabel = "<span class='uplFromOption'><p>OPTION " + option + "</p></span>";
                        }
                        anchorProductLbl = "<span class='qtyUOM'>" + (withQty ? upgradeFromProduct.totalAvailQty : "") + "</span><label class='anchorProduct'>" + upgradeFromProduct.productName + "</label>";
                    } else {
                        nonAnchorProductLbl = "<span class='qtyUOM'>" + (withQty ? upgradeFromProduct.totalAvailQty : "") + "</span><label class='nonAnchorProduct'>" + upgradeFromProduct.productName + "</label>";
                        nonAnchorProducts += nonAnchorProductLbl;
                    }
                }
                upgradeFromDIV = "<div class='uplFromProduct'>" + optionLabel + anchorProductLbl + nonAnchorDescDIV + nonAnchorProducts + "</div>";
            }
            upgradeFromDIV = "<td class='uglFromProducts'>" + upgradeFromDIV + "</td>";

            return upgradeFromDIV;
        },
        addExpandCollapseColumn: function() {

            $('#tbl_upgradeLicenseQuantities tbody tr').each(function() {
                //this.insertBefore(nCloneTd.cloneNode(true), this.childNodes[0]);
                $(this).find("td:eq(0)").html('<div class="openCloseSelect"><a href="#" class="openClose"></a></div>' + $(this).find("td:eq(0)").html());
                $(this).find("td:eq(0)").css("width", "421px");
                $(this).find("td:eq(1)").css({
                    "width": "123px",
                    "text-align": "center"
                });
                $(this).find("td:eq(2)").css({
                    "width": "183px",
                    "text-align": "center"
                });

            });

            // Add event listener for opening and closing details          
            $('#tbl_upgradeLicenseQuantities tbody td a.openClose').unbind('click').bind('click', ml.handlers.handleDetailsExpandCollapse);
            $('#tbl_upgradeLicenseQuantities tbody td a.openClose').eq(0).trigger('click');

        },
        fnFormatDetails: function(oTable, nTr) {
            var aData = $('#tbl_upgradeLicenseQuantities').dataTable().fnGetData(nTr);

            var rowIndex = $('#tbl_upgradeLicenseQuantities').dataTable().fnGetPosition(nTr);
            var subTableId = "tbl_upgradeLicenseQuantities" + rowIndex;

            var sOut = "<table cellpadding='0' cellspacing='0' border='0' class='display' id='" + subTableId + "'>" +
                "<thead>" +
                "<tr>" +
                "<th>licenseKey</th>" +
                "<th>TtotalQty</th>" +
                "<th>qtyToUpgradeAvail</th>" +
                "<th>folder</th>" +
                "</tr>" +
                "</thead>" +
                "</table>";

            return sOut;
        },
        createUglQtyTable: function(fromData) {

            $("#tbl_upgradeLicenseQuantities").not('.isinitialized').addClass('isinitialized');
            vmf.datatable.build(ml.$modalRef.find('#tbl_upgradeLicenseQuantities'), {
                "bInfo": false,
                "bPaginate": false,
                "bFilter": false,
                "sDom": 'zrtSpi',
                "sScrollY": 275,
                "bAutoWidth": false,
                "bServerSide": false,
                "aoColumns": [{
                    "sWidth": "421px",
                    "sTitle": "<span class='uplQtyHeader'> Product </span>",
                    "bSortable": false,
                    "mDataProp": "productName"
                }, {
                    "sWidth": "123px",
                    "sTitle": "<span class='uplQtyHeader'> License Keys </span>",
                    "bSortable": false,
                    "mDataProp": function(data, type, full) {
                        return data.licenseKeys.length;
                    }
                }, {
                    "sWidth": "183px",
                    "sTitle": "<span class='uplQtyHeader'> Total Available Qty(s)</span>",
                    "bSortable": false,
                    "mDataProp": "totalAvailQty"
                }],
                "aaData": fromData,
                "bSort": false,
                "fnInitComplete": function() {
                    ml.$modalRef.find("#tbl_upgradeLicenseQuantities_wrapper div.dataTables_scrollHeadInner").css("width", '100%');
                    ml.$modalRef.find("#tbl_upgradeLicenseQuantities_wrapper div.dataTables_scrollHeadInner table.isinitialized").css("width", '100%');
                    $("#tbl_upgradeLicenseQuantities>thead").remove(); /*Removing the table header to show no header*/
                    ml.$modalRef.find("#tbl_upgradeLicenseQuantities_wrapper span.uplQtyHeader").parent("th").addClass("uglQtyHeader");
                    ml.common.addExpandCollapseColumn();
                }
            });
        },
        getUpgradeLicenseQtyString: function(isKeyId) {

            var originalVal, currentVal, licenseKey,keyId, i, j, len1, len2, fromObj, licenseObj,upgradeLicenseQtyString="";
            var arrayOfQtyChange = new Array();
            var _postData = {};
            
            var qtyInputs = $("#tbl_upgradeLicenseQuantities input.totalQty");
            if (qtyInputs.length > 0) {

                qtyInputs.each(function() {

                	if(isKeyId){
                    	keyId = $(this).data().keyId;
                    	currentVal = parseInt($(this).val());
                    	arrayOfQtyChange.push(keyId + ":" + currentVal);
                    }else{
                    	licenseKey = $(this).data().licenseKey;
                    	currentVal = parseInt($(this).val());
                    	arrayOfQtyChange.push(licenseKey + ":" + currentVal);
                    }                        

                });

            } else {

                len1 = ml.licenseQuantitiesData.from.length;
                for (i = 0; i < len1; i++) {
                    fromObj = ml.licenseQuantitiesData.from[i];
                    if (fromObj.anchor == "TRUE") {
                        len2 = fromObj.licenseKeys.length;
                        for (j = 0; j < len2; j++) {
                            licenseObj = fromObj.licenseKeys[j];

                            if(isKeyId){
                            	keyId = licenseObj.keyId;
                            	currentVal = licenseObj.userUpgradeQty;
                            	arrayOfQtyChange.push(keyId + ":" + currentVal);
                            }else{
                            	licenseKey = licenseObj.licenseKey;
                            	currentVal = licenseObj.userUpgradeQty;
                            	arrayOfQtyChange.push(licenseKey + ":" + currentVal);
                            }                            

                        }

                    }
                }
            }

           upgradeLicenseQtyString = arrayOfQtyChange.join(',');
           return upgradeLicenseQtyString; 

        },
        renderUglError: function(response) {
            if(ml.$modalRef){
                ml.$modalRef.find("#mlNotesLabelsSel,#mlAttention,#uglOptionsContainer,#uglQuantitiesContainer,#uglTblcontainer, div.exportLicenseKey, #uglContainer .loading, #cancelButton, #editQtyButton, #continueButton, #saveQtyButton, #backButton, #confirmButton").hide();
                ml.$modalRef.find('#innerCon').removeClass('innerConHt');
                var errorMsg = response || mlRS.error.generalAjaError;
                ml.$modalRef.find('#uglErrorContainer').html(mlRS.error.generalAjaError)
                    .end().find('#uglErrorContainer').show();
                ml.$modalRef.find("#okButton").show();    
            }
            
        }, 
        cleanUpgradeData:function(){

        	ml.isCheckUpgrade = false;
            ml.isOptionSelected = false;
            ml.selectedOption = -1;
            ml.selectedOptionObj = {};
            ml.qtyDirtyFlag = false;
            ml.licenseQuantitiesData = {};
            ml.isManyFromProducts = false;                       
        }
    },
    events: {
        /** All the event bindings go here **/
        addActionButtonHandlers: function() {
            ml.$modalRef.find("#backButton").bind('click', ml.handlers.handleBack);
            ml.$modalRef.find("#continueButton").bind('click', ml.handlers.handleContinue);
            ml.$modalRef.find("#confirmButton").bind('click', ml.handlers.handleConfirm);
            ml.$modalRef.find("#cancelButton").bind('click', ml.handlers.handleCancel);
            ml.$modalRef.find("#okButton").bind('click', ml.handlers.handleOk);
            //ml.$modalRef.find(".simplemodal-close").bind('click', ml.handlers.handleClose);
            $(".simplemodal-close").bind('click', ml.handlers.handleClose);
            /*Event Bindings for result component*/
            ml.$modalRef.find(".closeSuccessMsg").bind('click', function() {
                ml.$modalRef.find('#successMessage').hide();
            });
            ml.$modalRef.find("#btnPrint").bind('click', function() {
                ml.handlers.handlePrint();
            });
        },
        nlRadioChange: function() {
            ml.$modalRef.find('input[name=notesAndCustomlabels]').unbind('click').bind('click', ml.handlers.handleNlRadioChange);
        },
        disclaimerCheckboxChange: function() {
            ml.$modalRef.find('#fpDisclaimer').unbind('click').bind('click', ml.handlers.handleDisclaimerCheckBox).attr('checked', false);
        },
        /**
         * Registers event handles for 'Add' , 'Cancel' and 'New Folder' links in the Move To Container.
         */
        regNewFolderActionHandlers: function() {
            ml.$modalRef.find("#mlNewFolderName").unbind('keyup').bind('keyup', ml.handlers.newFolderNameChange);
            ml.$modalRef.find("#addNewFolderLink").unbind('click').bind('click', ml.handlers.toggleAddNewFolderCntr);
            ml.$modalRef.find("#mlAddFolderCancel").unbind('click').bind('click', ml.handlers.toggleAddNewFolderCntr);
            ml.$modalRef.find("#mlAddFolder").unbind('click').bind('click', ml.handlers.doAddNewFolder)
                .attr('disabled', true).addClass('disabled');
        },
        /**
         * Registers and handles actions in bulk move modal for Continue and Cancel buttons.
         */
        regBulkMoveModalActionHandlers: function() {

            ml.$modalRef.find('#bulkMoveContinueBtn').unbind('click').bind('click', function() {
                vmf.modal.hide();
                ml.mlMap.move.postUrl = mlRS.move.url.bulkMove;
                //Using normal URL for now for bulk move
                //ml.mlMap.move.postUrl = mlRS.move.url.confirm;
                // Timer added to wait for the completion of cleaning up data for previous modal before showing next modal. 
                setTimeout(function() {
                    ml.showMoveLicensesModal();
                }, 50);
            });
            ml.$modalRef.find('#bulkMoveCancel').unbind('click').bind('click', function() {
                vmf.modal.hide();
                ml.mlMap.move.postUrl = mlRS.move.url.confirm;
            });
        },
        validateNotesTA: function(limit) {
            ml.$modalRef.find('#mlNotesTA').unbind('keypress keydown').bind('keypress keydown', function(e) {
                var val = $(this).val(),
                    limit = $(this).attr('maxlength') || limit,
                    key = e.keyCode || e.charCode;
                if ((key != 8 && key != 46) && val.length > limit) {
                    e.preventDefault();
                }
            });
        },
        registerQuantityChageHandler: function() {

            ml.$modalRef.find('#tbl_upgradeLicenseQuantities input.totalQty').die('focus', 'blur').live({
                'focus': function() {
                    if (this.value == 0)
                        this.value = '';
                },
                'blur': function() {
                    if (this.value == '') {
                        this.value = 0;
                    }
                    ml.handlers.handleQuantityChange($(this));
                }
            });
        }
        /*, sendEmailCheckboxChange: function() {
		ml.$modalRef.find('#copyToMymail').to .unbind('click').bind('click', ml.handlers.handleCopytoMyMail).attr('checked', false);
		}*/
    },
    handlers: {
        /** All the  event handlers go here **/
        successCustomLabels: function(data) {
            //Hide the Loading Text content
            ml.$modalRef.find('#mlNotesLabels .loading').hide();

            //Show the container having custom label text inputs
            ml.$modalRef.find("#mlLabelsContainer").show();
            var labelsArray = vmf.json.txtToObj(data),
                len = labelsArray.labels.length,
                clName,
                clNameForID,
                clContainerID,
                clInputID,
                clContainerDiv,
                i;
            if (len > 0) {
                for (i = 0; i < len; i++) {
                    clName = labelsArray.labels[i];
                    clNameForID = clName.replace(/\s+/g, ''); //removeSpace
                    clContainerID = clNameForID + "Div";
                    clInputID = clNameForID + "TI";
                    clContainerDiv = ml.common.prepareCustomLabelCntr(clName, clContainerID, clInputID);
                    if (i < (len / 2)) {
                        ml.$modalRef.find("#mlLabelsContainer div.first").append(clContainerDiv);
                    } else {
                        ml.$modalRef.find("#mlLabelsContainer div.second").append(clContainerDiv);
                    }
                }
                ml.haveCustomLabels = true;
                myvmware.common.putplaceHolder(ml.$modalRef.find("#mlLabelsContainer input[type=text]"));
            }
        },
        handleContinue: function() {
            if (ml.mlType === 'divide') {
                var isError = ml.computeTotal();
                if (isError) {
                    return false;
                }
            } else if (ml.mlType === 'downgradeLicense') {
                if (ml.common.validateDowngradeDT()) {
                    return false;
                }
            } else if (ml.mlType === 'upgradeLicense') {
                ml.$modalRef.find("#editQtyButton,#saveQtyButton").hide();
                ml.$modalRef.find("#backButton").unbind('click').bind('click', ml.handlers.handleBack);
                if (ml.common.validateUpgradeDT()) {
                    return false;
                }
            }
            //Navigate to notes and custom labels view
            ml.common.navigateTo(ml.viewStates.notesLabels);
            //Make an ajax call to retrive custom labels if not already retrieved
            riaLinkmy(ml.omniture[ml.mlType].continueB);
            if (!ml.haveCustomLabels) {
                ml.ajax.getCustomLabels();
            }
        },
        handleConfirm: function() {

        	//Disabling the 'confirm' button to avoid duplicate calls  BUG-00071291
        	ml.$modalRef.find("#confirmButton").attr("disabled","disabled");

            if (ml.mlType === 'divide') {
                var isError = ml.computeTotal();
                if (isError) {
                    return false;
                }
            } else if (ml.mlType === 'downgradeLicense') {
                if (ml.common.validateDowngradeDT()) {
                    return false;
                }
            } else if (ml.mlType === 'upgradeLicense') {
                if (ml.common.validateUpgradeDT()) {
                    return false;
                }
            }

            //validateDisclaimer
            //perform validation based on the state ( i.e if the current state is in custom lables ) : validateNotesAndCustomLabels
            //post the data to the server
            var postData = {},
                isError;
            // get notes and labels data for post
            if (ml.currentViewState === ml.viewStates.notesLabels) {
                if (ml.common.validateCustomLabels()) {
                    postData.licenseKeyNotes = (ml.$modalRef.find("#mlNotesTA").val()).substring(0, 299);
                    postData.labelLov = ml.common.prepareCustomLabelsString();
                    riaLinkmy(ml.omniture[ml.mlType].continueNLB);
                } else {
                    return false;
                }
            } else {
                riaLinkmy(ml.omniture[ml.mlType].confirmB);
            }
            postData.notesLabelsOption = ml.$modalRef.find('input[name=notesAndCustomlabels]:checked').attr('id');
            $.extend(postData, ml.mlMap[ml.mlType].postFun.call());
            ml.common.navigateTo(ml.viewStates.result);
            // send the data to server to combine licensekeys
            vmf.ajax.post(ml.mlMap[ml.mlType].postUrl, postData, function(resp) {
                // on the ajax's success, Hide the Loading Text content AND enable the OK button
                ml.$modalRef.find('#mlResult .loading').hide()
                    .end().find(".sendBtnContainer, .resultMainContainer").show()
                    .end().find("#okButton").attr('disabled', false).removeClass('disabled')
                    .end().find("#lblSendMail").html('<strong>' + mlRS.result.lblSendCopy + '</strong>');
                ml.$modalRef.find("#successMessage h3").html(ml.mlMap[ml.mlType].successHeadingMsg);
                ml.$modalRef.find("#confirmButton").removeAttr("disabled");
                resp = vmf.json.txtToObj(resp);
                if (resp == null) {
                    ml.mlMap[ml.mlType].renderFun(resp)
                }
                resp.error ? ml.common.renderError(resp.message) : ml.mlMap[ml.mlType].renderFun(resp);

            }, function() {
                //error handler
            });
        },
        handleCancel: function() {
            if (ml.currentViewState === ml.viewStates.notesLabels) {
                riaLinkmy(ml.omniture[ml.mlType].cancelNLB);
            } else {
                riaLinkmy(ml.omniture[ml.mlType].cancel);
            }
            vmf.modal.hide();
            //TODO : move this to a common place 
            //ml.isOptionSelected = false;
            //ml.ajax.clearSessionForUpgrade();
        },
        handleBack: function() {
            ml.common.navigateTo(ml.viewStates.selection);
            if (ml.mlType === 'upgradeLicense') {
                ml.common.updateHeader(mlRS[ml.mlType].txt.headingLicKeysQtys, false);
                ml.$modalRef.find("#mlNotesLabelsSel input[type='radio']").eq(0).attr("checked", "checked");
                ml.$modalRef.find("#fpDisclaimer").removeAttr("checked");
                ml.$modalRef.find('#innerCon').removeClass('innerConHt');
                ml.$modalRef.find("#backButton").removeAttr('disabled').removeClass('disabled').show();
                ml.$modalRef.find("#continueButton").attr('disabled', 'disabled').addClass('disabled').hide();
                ml.$modalRef.find("#confirmButton").attr('disabled', 'disabled').addClass('disabled').show();
                ml.$modalRef.find("#backButton").unbind('click').bind('click', ml.handlers.handleBackForUGL);
            }
        },
        handlePopupClose: function(mlType, isCheckUpgrade) {
            if (ml.$modalRef) {
                ml.$modalRef.find('.modalContent [style]').removeAttr('style');
                ml.$modalRef.find('#mlActions button').unbind('click');
                //clean up validation messages ( notes and labels section )
                ml.$modalRef.find("#mlLabelsContainer div.error_msg").text('&nbsp;');
                ml.$modalRef = null;
                //ml.mlType = null;
                ml.currentViewState = null;
                ml.selectedLicenses = [];
                ml.refreshLicensesPane = false;
                ml.refreshProductsPane = false;
                ml.haveCustomLabels = false;

                var isInUpgradeFlow = (!isCheckUpgrade) && ml.isOptionSelected && (ml.mlType == 'upgradeLicense') && (mlType == 'upgradeLicense');

                if (isCheckUpgrade || !isInUpgradeFlow) {
                   ml.mlType = null;
                   ml.common.cleanUpgradeData();
                   ml.ajax.clearSessionForUpgrade();
                }
                vmf.modal.hide();
            }
        },        
        handleNlRadioChange: function() {
            var selRBtn = ml.$modalRef.find('input[name=notesAndCustomlabels]:checked').attr('id');
            if (selRBtn === 'createNew') {
                riaLinkmy(ml.omniture[ml.mlType].newL);
                ml.$modalRef.find("#continueButton").show()
                    .end().find("#confirmButton").hide();
                if (ml.$modalRef.find("#fpDisclaimer").is(":checked")) {
                    ml.$modalRef.find("#continueButton").removeAttr("disabled").removeClass('disabled');
                } else {
                    ml.$modalRef.find("#continueButton").attr("disabled", "disabled").addClass('disabled');
                }
            } else {
                switch (selRBtn) {
                    case 'leaveBlank':
                        riaLinkmy(ml.omniture[ml.mlType].blank);
                        break;
                    case 'copyExisting':
                        riaLinkmy(ml.omniture[ml.mlType].copyL);
                        break;
                }
                //ml.$modalRef.find("#fpDisclaimer").attr("checked",$(this).is(":checked"));
                ml.$modalRef.find("#continueButton").hide()
                    .end().find("#confirmButton").show();
            }
        },
        handleDisclaimerCheckBox: function() {
            ml.$modalRef.find("#continueButton, #confirmButton").attr('disabled', !$(this).is(":checked"))
                .toggleClass('disabled');
        },
        handlePrint: function() {
            var data = ml.$modalRef.find('#resultDataContainer').html();
            var parentLocation = window.location;
            var mywindow = window.open(parentLocation + '/print.html', '', 'height=400,width=600');
            mywindow.document.write('<!DOCTYPE html><html><head><title>Result</title><meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />');
            mywindow.document.write('</head><body>');
            mywindow.document.write(data);
            mywindow.document.write('</body></html>');
            mywindow.focus();
            mywindow.print();
            // IE bug - need to reload the page to execute window.print
            mywindow.location.reload();
            mywindow.close();
            return true;
        },
                handleIEPrint : function(){                   
                },
        handleOk: function() {
            var postParam = '';
            //TODO : move this to a common place 
            ml.isOptionSelected = false;
            ml.ajax.clearSessionForUpgrade();
            if (ml.$modalRef.find("#copyToMymail").attr('checked')) {
                postParam = 'licenseKeyAction=' + ml.mlType;
                riaLinkmy(ml.omniture[ml.mlType].email);
                vmf.ajax.post(mlRS.combine.url.sendEmails, postParam, function(resp) {
                    // @resp - is not used
                    $(".simplemodal-close").trigger('click');
                }); //*/                   
            } else {
                $(".simplemodal-close").trigger('click');
            }
        },
        handleClose: function() {
            //TODO : move this to a common place 
            //ml.isOptionSelected = false;
            //ml.ajax.clearSessionForUpgrade();
            if (ml.refreshLicensesPane || ml.refreshProductsPane) {
                ice.managelicense.uiSession = [];
                var productId = $('#productSummary tr.selected').data("productId");
                if (productId != "") {
                    ice.managelicense.uiSession.prodId = productId;
                }
				$("#sel_wantTo option[value='viewLicense']").attr("selected", "selected");
                $('#sel_wantTo').trigger('change');
                // code to clear the licensespane's content
                $("#productMessage, #currentProductName, #keyManagement, .rightaligned_link").slideUp();
                $(".filter-section-header, .content", $("#keyManagement")).slideUp();
            } else {
                if (ml.currentViewState === ml.viewStates.selection) {
                    riaLinkmy(ml.omniture[ml.mlType].cancel);
                } else if (ml.currentViewState == ml.viewStates.notesLabels) {
                    riaLinkmy(ml.omniture[ml.mlType].cancelNLB);
                }
            }
        },
        successMoveLicensesPreview: function(data) {

            ml.$modalRef.find(".moveFromWrapper .loading").hide();
            data = vmf.json.txtToObj(data);

            //save the data for rendering success page
            ml.moveLicensesPreviewData = data;

            var len = data.folder.length,
                moveFromLIs = "";
            ml.$modalRef.find("#moveProductName").text(ice.globalVars.productLbl + " " + data.prodName);
            for (var i = 0; i < len; i++) {
                moveFromLIs += ml.common.prepareMoveFromListItem(data.folder[i].name, data.folder[i].licenseKeys);
            }
            ml.$modalRef.find("#moveFromListItems").append(moveFromLIs);
            ml.$modalRef.find('#mvlContainer').find('.ellipsisTxt').die('click').live("click", function() {
                $(this).addClass('normalWhiteSpace');
            });

        },
        failureMoveLicensesPreview: function() {
            //handle display of error here
        },
        /**
         * Handles show / hide of the add new folder container.
         */
        toggleAddNewFolderCntr: function(event) {
            myvmware.common.putplaceHolder(ml.$modalRef.find("#mlNewFolderName"));
            var selCntrl = $(this).attr("id");
            if ((selCntrl == "addNewFolderLink") && (!$(this).hasClass("active"))) {
                event.preventDefault();
            } else {
                if (selCntrl != "addNewFolderLink") {
                    if (selCntrl == "mlAddFolderCancel") riaLinkmy(ml.omniture[ml.mlType].cancelF);
                    if ($("#addNewfolderDiv").is(':visible'))
                        ml.$modalRef.find("#addNewfolderDiv").toggle();
                } else {
                    ml.$modalRef.find("#addNewfolderDiv").toggle();
                }
                var $targetFolderPane = ml.$modalRef.find("#targetfolderPane");
                if (!$("#addNewfolderDiv").is(':visible')) {
                    ml.$modalRef.find("#targetfolderPane").removeClass("minimized");
                } else {
                    ml.$modalRef.find("#targetfolderPane").addClass("minimized");
                }
            }
        },
        doAddNewFolder: function(event) {
            riaLinkmy(ml.omniture[ml.mlType].addF);
            var _selectedFolderID = ml.moveToFolderID,
                $newFolderName = ml.$modalRef.find("#mlNewFolderName"),
                _newFolderName = ($newFolderName.val() !== $newFolderName.attr('placeholder')) ? $newFolderName.val() : '';
            if (_newFolderName.length > 0) {
                //_addFolderUrl = mlRS.move.url.addFolder + '&selectedFolderId=' + _selectedFolderID + '&newFolderName=' + _newFolderName;
                var _addFolderUrl = $("#createFolderResourceUrl").val();
                var _postData = new Object();
                _postData['selectedFolderId'] = _selectedFolderID;
                _postData['newFolderName'] = _newFolderName;
                $('#mlAddFolder').attr('disabled', true).addClass('waitcursor');
                vmf.ajax.post(_addFolderUrl, _postData, ml.handlers.onSuccessAddFolder, ml.handlers.onFailureAddFolder);
            } else {
                error_msg = "Enter folder name."; // NOTE: pls update this static text to rs variable
                $newFolderName.siblings("div.error_msg").html(error_msg);
            }
        },
        onSuccessAddFolder: function(data) {
            var $newFolderName = ml.$modalRef.find("#mlNewFolderName"),
                _errorMessage = vmf.json.txtToObj(data);
            if (_errorMessage != null && _errorMessage.error) {
                $('#mlAddFolder').attr('disabled', false).removeClass('waitcursor');
                $newFolderName.siblings("div.error_msg").html(_errorMessage.message);
                return;
            } else {
                ml.$modalRef.find("#mlNewFolderName").val('');
                ml.$modalRef.find("#addNewfolderDiv .error_msg").html('');

                ml.$modalRef.find("#mlAddFolderCancel").trigger('click');
                $('#mlAddFolder').attr('disabled', false).removeClass('waitcursor');
                $("#addNewFolderLink").removeClass("active");
                ml.common.renderMoveToContainer();
            }
        },
        onFailureAddFolder: function(data) {
            var $newFolderName = ml.$modalRef.find("#mlNewFolderName");
            $newFolderName.siblings("div.error_msg").html(data.message);
            $('#mlAddFolder').attr('disabled', false).removeClass('waitcursor');
        },
        handleGetMinPermissions: function(folderId) {

            var _folderHT = vmf.foldertreeAnother.getFolderHashtable();
            var _folderTreeObj = vmf.foldertreeAnother.getFolderJSON();
            var _folderId = _folderHT.get(folderId).folderId;
            var _fullFolderPath = _folderHT.get(folderId).fullFolderPath;
            var _folderVariable = _folderId + "," + _fullFolderPath;
            var _folderAccess = _folderHT.get(folderId).folderAccess;
            var _selectedFolderName = _folderHT.get(folderId).folderName;

            if (_folderAccess != 'MANAGE') {
                //Keep the add new folder link disabled
                ml.$modalRef.find("#addNewFolderLink").removeClass("active");
                //close add new folder container if it's open
                ml.$modalRef.find("#mlAddFolderCancel").trigger('click');
            } else {
                ml.$modalRef.find("#addNewFolderLink").addClass("active");
            }

            if (ml.moveLicensesPreviewData.folder.length > 1) {
                ml.$modalRef.find('#fpDisclaimer').removeAttr('checked', 'checked').removeAttr('disabled', 'disabled');
                ml.$modalRef.find("#sameFolderMsg").hide();
            } else {
                var oldFolderName = ml.moveLicensesPreviewData.folder[0].name;
                var lenFval = oldFolderName.length;
                if (_fullFolderPath == oldFolderName || _fullFolderPath == oldFolderName.substring(2, lenFval)) {
                    //Temporary , need to add a class
                    ml.$modalRef.find("#sameFolderMsg").css('color', 'red');
                    ml.$modalRef.find("#sameFolderMsg").show();
                    ml.$modalRef.find('#fpDisclaimer').removeAttr('checked', 'checked').attr('disabled', 'disabled');
                } else {
                    ml.$modalRef.find("#sameFolderMsg").hide();
                    ml.$modalRef.find('#fpDisclaimer').removeAttr('checked', 'checked').removeAttr('disabled', 'disabled');
                }
            }
        },
        newFolderNameChange: function() {
            var $this = $(this);
            if ($.trim($this.val()) !== '' && $this.val() !== $this.attr('placeholder')) {
                ml.$modalRef.find('#mlAddFolder').attr('disabled', false).removeClass('disabled');
            } else {
                ml.$modalRef.find('#mlAddFolder').attr('disabled', true).addClass('disabled');
            }
        },
        successUpgradeOptions: function(data) {

            var upgradeOptions = vmf.json.txtToObj(data);
            var len;

            if (upgradeOptions.options == undefined) {
                //TODO :  Handle wrong data
                //BUG-00069479
                if(upgradeOptions.error){
                    if(ml.$modalRef == null){
                        ml.showUpgradeLicenseOptionsModal(mlRS[ml.mlType].txt.headingOptions);
                    }
                    ml.common.renderUglError(upgradeOptions.message);
                }

            } else {
                len = upgradeOptions.options.length;
                if (ml.isCheckUpgrade) {
                    //Show upgrade options in modal window 
                    ml.common.renderUpgradeOptions(upgradeOptions);
                } else {                	
                    if (len > 1) {
                        //Show upgrade options in modal window as there is more than one option 
                        ml.showUpgradeLicenseOptionsModal(mlRS[ml.mlType].txt.headingOptions);
                        ml.common.renderUpgradeOptions(upgradeOptions);
                    } else {
                        //Get license keys & quantities, in this case there is only one option 
                        ml.selectedOption = 1;
                        ml.showUpgradeLicenseOptionsModal(mlRS[ml.mlType].txt.headingLicKeysQtys);
                        ml.ajax.getSelectedUpgradeLicenses(true);
                    }
                }
            }

        },
        failureUpgradeOptions: function() {
            //TODO: Handle the failure 

        },
        handleUpgradeOptionSelect: function() {

            var selectedOptionArr;

            ml.isOptionSelected = true;
            selectedOptionArr = $(this).attr("id").split("_");
            ml.selectedOption = selectedOptionArr[1];
            ml.selectedOptionObj = $(this).data("selectedOption");

            if (ml.isCheckUpgrade) {

                //Show processing for licenses data table 
                $("#viewLicense .dataTables_scroll, #keyManagement .filter-section-header,#upgradeOptionsContainer").hide();
                var table = $('#licenseDetail').dataTable();
                var oSettings = table.fnSettings();
                table.oApi._fnProcessingDisplay(oSettings, true);

                ml.ajax.getLicensesForSelUpgradeOption();
                vmf.modal.hide();
                $("#btn_cancel_ugl").removeAttr("disabled").removeClass('disabled').show();
                $("#btn_cancel_ugl").unbind('click').bind('click', ml.handlers.handleCancelForUGL);

            } else {
                ml.$modalRef.find("#mlNotesLabelsSel,#mlAttention,#uglOptionsContainer,#uglQuantitiesContainer,#uglTblcontainer, div.exportLicenseKey, #uglErrorContainer, #okButton").hide();
                ml.$modalRef.find('#uglContainer .loading').show();
                ml.ajax.getSelectedUpgradeLicenses(false);
            }

        },
        handleCancelForUGL: function() {

            ml.refreshLicensesPane = true;
            ml.refreshProductsPane = true;
            ml.isOptionSelected = false;
            ml.ajax.clearSessionForUpgrade();
            ml.handlers.handleClose();

        },
        handleContinueForUGL: function() {

            ml.$modalRef.find("#continueButton").hide();
            ml.$modalRef.find("#continueButton").unbind('click').bind('click', ml.handlers.handleContinue);

            ml.$modalRef.find("#uglOptionsContainer,#uglQuantitiesContainer,#uglTblcontainer,#editQtyButton,#saveQtyButton, div.exportLicenseKey, #uglErrorContainer, #okButton").hide();
            ml.$modalRef.find("#mlNotesLabelsSel,#mlAttention").show();

            if (ml.isManyFromProducts) ml.$modalRef.find("#copyExisting").parent().hide();

            ml.$modalRef.find("#backButton").removeAttr('disabled').removeClass('disabled').show();
            ml.$modalRef.find("#backButton").unbind('click').bind('click', ml.handlers.handleBackForUGL);

            ml.$modalRef.find("#confirmButton").attr("disabled", "disabled").addClass('disabled').show();
            ml.$modalRef.find('#innerCon').removeClass('innerConHt');

        },
        handleBackForUGL: function() {

            ml.$modalRef.find("#mlNotesLabelsSel input[type='radio']").eq(0).attr("checked", "checked");
            ml.$modalRef.find("#fpDisclaimer").removeAttr("checked");

            if (ml.isManyFromProducts) ml.$modalRef.find("#copyExisting").parent().hide();

            ml.$modalRef.find("#uglQuantitiesContainer,#editQtyButton,#continueButton, div.exportLicenseKey").show();
            ml.$modalRef.find("#continueButton").removeAttr('disabled').removeClass('disabled');
            ml.$modalRef.find("#mlNotesLabelsSel,#mlAttention,#backButton,#confirmButton, #uglErrorContainer, #okButton").hide();
            ml.$modalRef.find("#continueButton").unbind('click').bind('click', ml.handlers.handleContinueForUGL);

             if(ml.$modalRef.find('#innerCon').hasClass('qtyTblVisible')){
             	ml.$modalRef.find('#innerCon').addClass('innerConHt');
             	ml.$modalRef.find('#uglTblcontainer,#saveQtyButton').show();             	
             	ml.$modalRef.find('#editQtyButton').hide();
             }

            ml.common.updateHeader(mlRS[ml.mlType].txt.headingLicKeysQtys, false);

        },
        successUpgradeLicenseQuantities: function(data, isSave) {

            var upgradeToString,
                upgradeFromString,
                upgradeToHeight,
                upgradeString,
                i, j;

            if (typeof data == "string") {
                ml.licenseQuantitiesData = vmf.json.txtToObj(data);
            } else {
                ml.licenseQuantitiesData = data;
            }

           if (ml.licenseQuantitiesData.from == undefined) {
                if(ml.licenseQuantitiesData.error){
                    ml.common.renderUglError(ml.licenseQuantitiesData.message);
                }

            }else{
                ml.isManyFromProducts = ml.licenseQuantitiesData.from.length > 1 ? true : false;
                //Update header             
                ml.common.updateHeader(mlRS[ml.mlType].txt.headingLicKeysQtys, false);

                ml.$modalRef.find('#uglContainer .loading, #uglErrorContainer, #okButton').hide();
                ml.$modalRef.find("#uglQuantitiesContainer, div.exportLicenseKey").show();

                //Handle edit and save buttons 
                ml.$modalRef.find("#editQtyButton").show();
                ml.$modalRef.find("#saveQtyButton").hide();

                ml.$modalRef.find("#editQtyButton").unbind('click').bind('click', function() {
                    $(this).hide();
                    ml.$modalRef.find('#innerCon').addClass('innerConHt qtyTblVisible');
                    ml.$modalRef.find("#uglTblcontainer,#saveQtyButton").show();
                    ml.$modalRef.find("#saveQtyButton").attr('disabled', 'disabled').addClass('disabled');
                    //Register handler for saving the quantities 
                    ml.$modalRef.find("#saveQtyButton").unbind('click').bind('click', ml.handlers.saveUpgradeQty);

                });

                ml.$modalRef.find("#continueButton").removeAttr('disabled').removeClass('disabled').show();
                ml.$modalRef.find("#continueButton").unbind('click').bind('click', ml.handlers.handleContinueForUGL);

                //Prepare From and To HTML Strings 
                upgradeToString = ml.common.prepareUpgradeTo(ml.selectedOption, ml.licenseQuantitiesData.to, false, true, ml.licenseQuantitiesData.from);
                upgradeFromString = ml.common.prepareUpgradeFrom(ml.selectedOption, false, ml.licenseQuantitiesData.from, true);

                //Append the content 
                upgradeString = "<tr>" + upgradeFromString + upgradeToString + "</tr>";
                $("#uplQuantitiesContent table").empty().append(upgradeString);

                if ($("#tbl_upgradeLicenseQuantities").hasClass('isinitialized')) {
                    if ($("#tbl_upgradeLicenseQuantities").children().length > 0) {
                        //Table is available to so, destory it 
                        var ugltTable = $("#tbl_upgradeLicenseQuantities").dataTable();
                        ugltTable.fnDestroy();
                        $("#tbl_upgradeLicenseQuantities").empty();
                    }
                }

                var headerPadding = ml.$modalRef.find("#uglQuantitiesContainer .uglToHeader").width() - ml.$modalRef.find("#uglQuantitiesContainer .uplToProduct").width();
                ml.$modalRef.find("#uglQuantitiesContainer .uglToHeader").css("padding-left", headerPadding);
                ml.common.createUglQtyTable(ml.licenseQuantitiesData.from);

                if (isSave) {
                    ml.$modalRef.find("#uglTblcontainer").show();
                    ml.$modalRef.find("#editQtyButton").hide();
                    ml.$modalRef.find("#saveQtyButton").attr("disabled", "disabled").addClass("disabled").show();
                } else {
                    ml.$modalRef.find('#innerCon').removeClass('innerConHt');
                }
            } 

            

        },
        handleDetailsExpandCollapse: function() {

            var nTr = this.parentNode.parentNode.parentNode;
            $(this).parents("#tbl_upgradeLicenseQuantities tr").toggleClass("openSelectRowBackground");
            //this.src.match('details_close')
            if ($(this).hasClass("open")) {
                /* This row is already open - close it */
                $(this).removeClass("open");
                $('#tbl_upgradeLicenseQuantities').dataTable().fnClose(nTr);
            } else {
                /* Open this row */
                $(this).addClass("open");
                $('#tbl_upgradeLicenseQuantities').dataTable().fnOpen(nTr, ml.common.fnFormatDetails($('#tbl_upgradeLicenseQuantities').dataTable(), nTr), 'details');
                $("#tbl_upgradeLicenseQuantities td.details").attr("colspan", "4");

                var rowIndex = $('#tbl_upgradeLicenseQuantities').dataTable().fnGetPosition(nTr);
                var subTableId = "tbl_upgradeLicenseQuantities" + rowIndex;
                var ex = document.getElementById(subTableId);
                if (!$("#" + subTableId).hasClass('initialized')) {

                    $("#" + subTableId).not('.initialized').addClass('initialized');

                    vmf.datatable.build($("#" + subTableId), {
                        "bPaginate": false,
                        "bLengthChange": false,
                        "bSort": false,
                        "bInfo": false,
                        "bFilter": false,
                        "bAutoWidth": false,
                        "aaData": $('#tbl_upgradeLicenseQuantities').dataTable().fnGetData(nTr).licenseKeys,
                        "aoColumns": [{
                            "sWidth": "250px",
                            "sTitle": "<span> License Keys</span>",
                            "bSortable": false
                        }, {
                            "sWidth": "100px",
                            "sTitle": "<span> Total Qty. </span>",
                            "bSortable": false

                        }, {
                            "sWidth": "150px",
                            "sTitle": "<span> Quantity to Upgrade/Available</span>",
                            "bSortable": false
                        }, {
                            "sWidth": "150px",
                            "sTitle": "<span> Folder",
                            "bSortable": false
                        }],
                        "aoColumnDefs": [{
                                "mDataProp": "licenseKey",
                                "aTargets": [0]
                            }, {
                                "mDataProp": function(data, type, full) {

                                    return data.totalQty + "&nbsp;" + data.uom;
                                },
                                "aTargets": [1]
                            }, {
                                "mDataProp": function(data, type, full) {

                                    if ($('#tbl_upgradeLicenseQuantities').dataTable().fnGetData(nTr).anchor == "FALSE") {
                                        return data.userUpgradeQty + "&nbsp;" + data.uom;
                                    } else {
                                        return '<input type="text" class="totalQty"  value="' + data.userUpgradeQty + '"></input> / ' + data.qtyToUpgradeAvail + "&nbsp;" + data.uom + "<br class='clear'/><div class='error_msg'></div>";
                                    }
                                },
                                "aTargets": [2]
                            }, {
                                "mDataProp": function(data, type, full) {
                                    if (data.folder == undefined) {
                                        return "No Folder Path";
                                    } else {
                                        return data.folder;
                                    }
                                },
                                "aTargets": [3]
                            }

                        ],
                        "fnRowCallback": function(nRow, aData, iDisplayIndex) {
                            $(nRow).find("td:eq(0)").prepend("<span class='openclose'></span>").end().data("id", aData);
                            $(nRow).find("input.totalQty").data({
                                "qtyToUpgradeAvail": aData.qtyToUpgradeAvail,
                                "licenseKey": aData.licenseKey,
                                "keyId": aData.keyId,
                                "userUpgradeQty": aData.userUpgradeQty
                            });
                            return nRow;
                        },
                        "fnInitComplete": function() {
                            $tbl = this;
                            ml.$modalRef.find("#" + subTableId).find('span.openclose').die('click').live("click", function() {
                                ml.handlers.expandQtyRowDetails($(this), $tbl);
                            });
                            ml.events.registerQuantityChageHandler();
                        }
                    });
                }
            }

            return false;
        },
        expandQtyRowDetails: function(o, t) {
            var nTr1 = o[0].parentNode.parentNode;
            if (o.hasClass('minus')) {
                o.removeClass('minus');
                $(nTr1).removeClass("expanded noborder").next("tr").hide();
            } else {
                o.addClass('minus');
                $(nTr1).addClass("expanded noborder");
                if (!nTr1.haveData) {
                    t.fnOpen(nTr1, '', '');
                    ml.handlers.getQtyRowDetails($(nTr1), nTr1.idx);
                    nTr1.haveData = true;
                    $(nTr1).next("tr").addClass('more-detail');
                } else {
                    $(nTr1).next("tr").show();
                }
            }
        },
        getQtyRowDetails: function(rowObj, idx) {
            var sOut = [],
                cdata = rowObj.data("id"),
                cLHtml = [];
            sOut.push("<div class='note-wrapper clearfix'><div class='noteH'>"+ mlRS[ml.mlType].txt.dNote +"</div><span class='note ellipsisTxt'>" + cdata.notes + "</span></div>");
            $.each(cdata.customlabels, function(cL, cLv) {
                if (cLv != "") {
                    cLHtml.push("<div class='lCont'><div class='sLabeln'>" + cL + ": </div><div class='sLabelv'>" + cLv + "</div></div>");
                }
            });
            sOut.push("<div class='note-wrapper clearfix clDiv'>" + cLHtml.join('') + "</div>")
            rowObj.next("tr").addClass('more-detail').find("td").html(sOut.join(''));
        },
        failureUpgradeLicenseQuantities: function() {
            //TODO : Handle failure 
        },
        successLicensesForUpgradeOption: function(data) {

            var upgradeToString,
                upgradeFromString,
                upgradeToHeight,
                licenseData,
                upgradeString;
            //Display the containers for license details data table 
            $("#productMessage, #keyManagement").hide();
            $("#viewLicense .dataTables_scroll, #currentProductName, #keyManagement .filter-section-header").show();
            //Display license keys for selected option  
            licenseData = vmf.json.txtToObj(data).aaData;
            ice.managelicense.RefreshTable('licenseDetail', licenseData);
            //Display selected option details 
            $("#upgradeOptionsContainer,a.togUpgradeOptions").hide();
            $("#selectedOptionsContainer").show();
            upgradeToString = ml.common.prepareUpgradeTo(ml.selectedOptionObj.option, ml.selectedOptionObj.to, false, false, null);
            upgradeFromString = ml.common.prepareUpgradeFrom(ml.selectedOptionObj.option, false, ml.selectedOptionObj.from, false);
            upgradeString = "<tr>" + upgradeFromString + upgradeToString + "</tr>";
            $("#selUplOptionsContent table").empty().append(upgradeString);
            var headerWidth = ($("#selUplOptionsContent td.uglFromProducts").width() * 100) / $("#selUplOptionsContent").width();
            $("#selectedOptionsDiv td.uglFromHeader").width(headerWidth + "%");
            ice.managelicense.adjustHt();
        },
        successLicensesForUpgradeOption_old: function(data) {

            var upgradeToString,
                upgradeFromString,
                upgradeToHeight,
                licenseData;
            //Display the containers for license details data table 
            $("#productMessage, #keyManagement").hide();
            $("#viewLicense .dataTables_scroll, #currentProductName, #keyManagement .filter-section-header").show();
            //Display license keys for selected option  
            licenseData = vmf.json.txtToObj(data).aaData;
            ice.managelicense.RefreshTable('licenseDetail', licenseData);
            //Display selected option details 
            $("#upgradeOptionsContainer").hide();
            $("a.togUpgradeOptions").hide();
            $("#selectedOptionsContainer").show();
            upgradeToString = ml.common.prepareUpgradeTo(ml.selectedOptionObj.option, ml.selectedOptionObj.to, false, false, null);
            upgradeFromString = ml.common.prepareUpgradeFrom(ml.selectedOptionObj.option, false, ml.selectedOptionObj.from, false);
            $("#selectedOptionsDiv .uglToProducts").empty().append(upgradeToString);
            upgradeToHeight = $("#selectedOptionsDiv .uplToProduct").eq(0).outerHeight();
            $("#selectedOptionsDiv .uglFromProducts").empty().append(upgradeFromString);
            $("#selectedOptionsDiv .uglFromProduct").eq(0).css("height", upgradeToHeight + 20);
            var headerPadding = $("#selectedOptionsDiv .uglToHeader").width() - $("#selectedOptionsDiv .uplToProduct").width();
            $("#selectedOptionsDiv .uglToHeader").css("padding-left", headerPadding);
            ice.managelicense.adjustHt();
        },
        failureLicensesForUpgradeOption: function() {

            //TODO : Handle failure 
        },
        handleQuantityChange: function($inputElement) {

            var currentVal, qtyToUpgradeAvail,userUpgradeQty;

            if (!ml.common.validateUpgradeDT()) {

                ml.qtyDirtyFlag = false;
                ml.$modalRef.find("#tbl_upgradeLicenseQuantities input.totalQty").each(function() {

                    currentVal = parseInt($(this).val());
                    qtyToUpgradeAvail = parseInt($(this).data().qtyToUpgradeAvail);
                    userUpgradeQty = parseInt($(this).data().userUpgradeQty);
                    //Fix for defect BUG-00069707                                      
                    if (!(currentVal == userUpgradeQty) && (currentVal <=qtyToUpgradeAvail) ) {
                        ml.qtyDirtyFlag = true;
                    }                    

                });

                if (ml.qtyDirtyFlag) {
                    ml.$modalRef.find("#saveQtyButton").removeAttr('disabled').removeClass('disabled');
                    ml.$modalRef.find("#continueButton").attr('disabled', 'disabled').addClass('disabled');
                } else {
                    ml.$modalRef.find("#saveQtyButton").attr('disabled', 'disabled').addClass('disabled');
                    ml.$modalRef.find("#continueButton").removeAttr('disabled').removeClass('disabled');
                }
            }
        },
        saveUpgradeQty: function() {

            ml.$modalRef.find("#mlNotesLabelsSel,#mlAttention,#uglOptionsContainer,#uglQuantitiesContainer,#uglTblcontainer, div.exportLicenseKey, #uglErrorContainer, #okButton").hide();
            ml.$modalRef.find('#uglContainer .loading').show();
            if (!ml.isManyFromProducts) {

                var currentVal, licenseKey, i, j, len1, len2, fromObj, licenseObj;
                var _licenseKeyQtyMap = {};
                var qtyInputs = $("#tbl_upgradeLicenseQuantities input.totalQty");
                if (qtyInputs.length > 0) {

                    qtyInputs.each(function() {
                        licenseKey = $(this).data().licenseKey;
                        currentVal = parseInt($(this).val());
                        _licenseKeyQtyMap[licenseKey] = currentVal;
                    });

                    len1 = ml.licenseQuantitiesData.from.length;
                    for (i = 0; i < len1; i++) {
                        fromObj = ml.licenseQuantitiesData.from[i];
                        if (fromObj.anchor == "TRUE") {
                            len2 = fromObj.licenseKeys.length;
                            for (j = 0; j < len2; j++) {
                                licenseObj = fromObj.licenseKeys[j];
                                licenseObj.userUpgradeQty = _licenseKeyQtyMap[licenseObj.licenseKey];
                            }

                        }
                    }

                }

                ml.handlers.successUpgradeLicenseQuantities(ml.licenseQuantitiesData, true);

            } else {
                ml.ajax.saveSelectedUpgradeLicenses();
            }
        }
    },
    ajax: {
        /*--------------------------------------------------*/
        // All the methods handling server requests ( AJAX ) go here.
        /*--------------------------------------------------*/
        getCustomLabels: function() {
            vmf.ajax.post(mlRS.combine.url.getCustomLabels, {}, ml.handlers.successCustomLabels);
        },
        getDowngradeKeys: function() {
            var _postData = "selectedLicenseKeys=" + ml.selectedLicenses.join(',');
            vmf.ajax.post(mlRS.downgradeLicense.url.getDowngradeKeys, _postData, ml.renderDowngradeKeys);
        },
        getUpgradeKeys: function() {
            var _postData = "selectedLicenseKeys=" + ml.selectedLicenses.join(',');
            vmf.ajax.post(mlRS.upgradeLicense.url.getUpgradeKeys, _postData, ml.renderUpgradeKeys);
        },
        getMoveLicensesPreview: function() {
            var _postData = {};
            if (ml.selectedLicenses.length > 0) {
                _postData.selectedLicenseKeys = ml.selectedLicenses.join(',');
                vmf.ajax.post(mlRS.move.url.preview, _postData, ml.handlers.successMoveLicensesPreview, ml.handlers.failureMoveLicensesPreview);
            }
        },
        postMoveLicenses: function() {
            var _postData = {};
        },
        getMinPermissionData: function(selectedFolder, cbState) {

            var _fPerPostData = new Object();
            _fPerPostData['selectedFolderId'] = selectedFolder;
            $.ajax({
                type: 'POST',
                url: mlRS.move.url.folderPermission,
                async: true,
                dataType: "json",
                data: _fPerPostData,
                success: function(folderPermission) {
                    //Store permission in folder tree HT
                    vmf.foldertreeAnother.storePermission(selectedFolder, folderPermission);
                    ml.handlers.handleGetMinPermissions(selectedFolder);
                },
                error: function(response, errorDesc, errorThrown) {
					//console.log("In error: " + errorThrown);
                },
                beforeSend: function() {
                    //TODO
                },
                complete: function(jqXHR, settings) {
                    //TODO
                }
            });
        },
        getUpgradeOptions: function() {
            var _postData = {};
            _postData.licenseKeys = ml.selectedLicenses.join(',');
            _postData.isCheckUpgrade = ml.isCheckUpgrade;
            vmf.ajax.post(mlRS.upgradeLicense.url.upgradeOptions, _postData, ml.handlers.successUpgradeOptions, ml.handlers.failureUpgradeOptions);
        },
        getLicensesForSelUpgradeOption: function(option) {

            var _postData = {};
            _postData.optionSelected = ml.selectedOption;
            _postData.isCheckUpgrade = ml.isCheckUpgrade;
            vmf.ajax.post(mlRS.upgradeLicense.url.previewSelectedOption, _postData, ml.handlers.successLicensesForUpgradeOption, ml.handlers.failureLicensesForUpgradeOption);
        },
        getSelectedUpgradeLicenses: function(fromSession) {

            var _postData = {};
            _postData.licenseKeys = ml.selectedLicenses.join(',');
            _postData.isCheckUpgrade = ml.isCheckUpgrade;
            _postData.optionSelected = ml.selectedOption;
            if (fromSession) {
                vmf.ajax.post(mlRS.upgradeLicense.url.previewSelectedUpgradeLicensesFromSessionUrl, _postData,
                    function(data) {

                        ml.handlers.successUpgradeLicenseQuantities(data, false);

                    }, ml.handlers.failureUpgradeLicenseQuantities);
            } else {
                vmf.ajax.post(mlRS.upgradeLicense.url.previewSelectedUpgradeLicenses, _postData,
                    function(data) {

                        ml.handlers.successUpgradeLicenseQuantities(data, false);

                    }, ml.handlers.failureUpgradeLicenseQuantities);
            }

        },
        clearSessionForUpgrade: function() {
            var _postData = {};
            vmf.ajax.post(mlRS.upgradeLicense.url.clearSessionOnCancelOrConfirmUrl, _postData);
        },
        saveSelectedUpgradeLicenses: function() {
                        
            var _postData = {};      

            _postData.licForUpgrade = ml.common.getUpgradeLicenseQtyString(false);

            vmf.ajax.post(mlRS.upgradeLicense.url.previewEditUpgradeQuantity, _postData,
                function(data) {
                    ml.handlers.successUpgradeLicenseQuantities(data, true);
                },
            ml.handlers.failureUpgradeLicenseQuantities);
        }
    },
    startManagingLicenses: function(mlType, selectedLicenses, isCheckUpgrade) {

        //Note: temperory cleanup.. should be handled in onclose and handdlecancel
        ml.handlers.handlePopupClose(mlType, isCheckUpgrade);

        //Save manage license type
        ml.mlType = mlType;

        riaLinkmy(ml.omniture[ml.mlType].start);

        ml.isCheckUpgrade = ml.isCheckUpgrade ? ml.isCheckUpgrade : isCheckUpgrade;
        //Save selected licenes
        ml.selectedLicenses = selectedLicenses;

        if ((ml.mlType !== "move") && (ml.mlType !== "upgradeLicense")) {
            ml.showManageLicensesModal();
        }
        //Invoke the relevant method to handle the display of modal
        ml.mlMap[mlType].initFun.call();
    },
    showManageLicensesModal: function() {

        vmf.modal.show("mlMainContainer", {
            modalWidth: '900px',
            maximize: true
        });

        //Get the reference object for modal window
        ml.$modalRef = $("#simplemodal-container #mlMainContainer");
        // call the common methods to update the notesAndLabels, attention, action buttons (text) containers
        ml.common.updateActionButtonsText();

        //if (ml.mlType === "upgradeLicense") {
        //   ml.$modalRef.find("#mlNotesLabelsSel").css('visibility', 'hidden');
        //}

        ml.common.updateNotesAndLabels();
        //|| ml.mlType === "upgradeLicense"
        if (ml.mlType === "downgradeLicense") {
            ml.$modalRef.find('#mlAttention .warning_big').css('visibility', 'hidden');
            // show disclaimer text (explicitly showing for downgrade/upgrade)
            ml.$modalRef.find('#disclaimerContainer').html('<strong>' + mlRS[ml.mlType].txt.disclaimerText + '</strong>');
        } else {
            ml.common.updateAttentionText();
        }
        ml.common.updateGetHelp();
        ml.events.addActionButtonHandlers();
    },
    showCombineLicensesModal: function() {
        //Handle display of relevant containers
        ml.common.navigateTo(ml.viewStates.selection);
        // Attach notes&lables radio buttons' change event AND disclaimer checkbox change events
        ml.events.nlRadioChange();
        ml.events.disclaimerCheckboxChange();

        // hide un-wanted elements - specific to combine linceses flow ( move to common method )
        ml.$modalRef.find('#copyExisting').closest('div.nlOptionContainer').hide();

        ml.$modalRef.find('#clProductName').html(mlRS.common.productName);

        /* code to render datatable */
        ml.loadCLDataTable();
    },
    showDivideLicensesModal: function() {
        //Handle display of relevant containers
        ml.common.navigateTo(ml.viewStates.selection);
        // Attach notes&lables radio buttons' change event AND disclaimer checkbox change events
        ml.events.nlRadioChange();
        ml.events.disclaimerCheckboxChange();
        ml.loadDivideData();

    },
    handleMoveLicenses: function() {
        //Identify total number of licenses selected
        var len = ml.selectedLicenses.length;
        if (len > 200) {
            //show bulk move alert
            ml.showBulkMoveLicensesModal();

        } else {
            //URL to use for post in case of normal move
            ml.mlMap.move.postUrl = mlRS.move.url.confirm;
            ml.showMoveLicensesModal();
        }
    },
    showBulkMoveLicensesModal: function() {
        vmf.modal.show("mlBulkMoveCntr", {
            minHeight: '300px',
            modalWidth: '600px',
            maximize: false,
            escClose: false
        });
        //Get the reference object for modal window
        ml.$modalRef = $("#simplemodal-container #mlBulkMoveCntr");
        ml.common.updateBulkMoveModalText();
        ml.events.regBulkMoveModalActionHandlers();
    },
    showMoveLicensesModal: function() {

        vmf.modal.show("mlMainContainer", {
            minHeight: '500px',
            modalWidth: '900px',
            maximize: true,
            escClose: false
            /*, onClose: function(){
				ml.handlers.handlePopupClose();
			}*/
        });
        //Get the reference object for modal window
        ml.$modalRef = $("#simplemodal-container #mlMainContainer");

        //Specific to this scenario as enabling depends on selecting a folder 
        ml.$modalRef.find('#fpDisclaimer').removeAttr('checked', 'checked').attr('disabled', 'disabled')
        // call the common methods to update the notesAndLabels, attention, action buttons (text) containers
        ml.events.disclaimerCheckboxChange();
        ml.common.updateGetHelp();
        ml.events.addActionButtonHandlers();
        ml.common.updateActionButtonsText();
        ml.common.updateNotesAndLabels();
        ml.common.updateAttentionText();

        ml.events.regNewFolderActionHandlers();

        //show move selection
        ml.common.navigateTo(ml.viewStates.selection);
        ml.ajax.getMoveLicensesPreview();
        ml.common.renderMoveToContainer();

    },
    showUpgradeLicensesModal: function() {
        //Handle display of relevant containers
        ml.common.navigateTo(ml.viewStates.selection);

        // Attach notes&lables radio buttons' change event AND disclaimer checkbox change events
        ml.events.nlRadioChange();
        ml.events.disclaimerCheckboxChange();

        ml.ajax.getUpgradeKeys();
    },
    handleUpgradeLicenses: function() {
        	//1. 'Check Upgrade Options' button clicked 
        if (ml.isCheckUpgrade && !ml.isOptionSelected) {
            ml.showUpgradeLicenseOptionsModal(mlRS[ml.mlType].txt.headingOptions);
            //Retrieve the upgrade options 
            ml.ajax.getUpgradeOptions();
        } else if (ml.isCheckUpgrade && ml.isOptionSelected) {
            //2. 'Check Upgrade Options' clicked > Option selected > Continue button clickec 
            //Allow only 50 licenses to be upgraded
            if (ml.selectedLicenses.length > ml.maxAllowedLicenseKeys) {
                ml.selectedLicenses = ml.selectedLicenses.slice(0, ml.maxAllowedLicenseKeys);
                //NOTE: Do we ned to show any alert to the user here ? 
            }
            ml.showUpgradeLicenseOptionsModal(mlRS[ml.mlType].txt.headingLicKeysQtys);
            //Get license keys & quantities for selected option 
            ml.ajax.getSelectedUpgradeLicenses(false);
        } else if (!ml.isCheckUpgrade) {
        	ml.common.cleanUpgradeData();
            //3.User has clicked on continue button directly 
            if (ml.selectedLicenses.length > ml.maxAllowedLicenseKeys) {
                ml.selectedLicenses = selectedLicenses.slice(0, ml.maxAllowedLicenseKeys);
                //NOTE: Do we ned to show any alert to the user here ? 
            }
            //Retrieve the upgrade options 
            ml.ajax.getUpgradeOptions();
        }
    },
    showUpgradeLicenseOptionsModal: function(heading) {

        ml.showManageLicensesModal();
        ml.common.navigateTo(ml.viewStates.selection);
        ml.common.updateHeader(heading, false);
        ml.events.nlRadioChange();
        ml.events.disclaimerCheckboxChange();
        ml.$modalRef.find("#mlNotesLabelsSel,#mlAttention,#uglOptionsContainer,#uglQuantitiesContainer,#uglTblcontainer, div.exportLicenseKey, #uglErrorContainer, #okButton").hide();
        ml.$modalRef.find('#uglContainer .loading').show();
    },
    showDowngradeLicensesModal: function() {
        //Handle display of relevant containers
        ml.common.navigateTo(ml.viewStates.selection);

        // Attach notes&lables radio buttons' change event AND disclaimer checkbox change events
        ml.events.nlRadioChange();
        ml.events.disclaimerCheckboxChange();

        ml.ajax.getDowngradeKeys();
    },
    postDataCombine: function() {
        var postData = {};
        postData.selectedLicenseKeys = ml.selectedLicenses.join(',');
        return postData;
    },
    postDataDivide: function() {
        var postData = {},
            _selectedLicense = "",
            $activeRow,
            newList = '';
        $activeRow = $('#licenseDetail tr:.active');
        if ($activeRow.length) {
            _selectedLicense = $activeRow.find("input:radio[name=opensel12]").val();
        }
        postData.selectedLicenseKeys = _selectedLicense;
        ml.$modalRef.find('#newKeys li input').each(function() {
            newList += $(this).val() + ',';
        });
        postData.newLicenseKeysQuantityList = newList;
        return postData;
    },
    postDataUpgrade: function() {
        var postData = {},
            licForUpgradeArr = [];
        /*$("#tbl_upgradelic input:text").each(function() {
            var qtylen = $(this).attr('id').length,
                maxId = $(this).attr('id').substring(4, qtylen);

            licForUpgradeArr.push($('#key_' + maxId).html() + ':' + $(this).val());
        });*/
        var arrayOfQtyChange = new Array();
        var licensekey, currentVal, i, j, len1, len2, fromObj, licenseObj;

        if ($("#tbl_upgradeLicenseQuantities input.totalQty").length > 0) {

            $("#tbl_upgradeLicenseQuantities input.totalQty").each(function() {
                licenseKey = $(this).data().licenseKey;
                currentVal = parseInt($(this).val());
                arrayOfQtyChange.push(licenseKey + ":" + currentVal);
            });

        } else {

            len1 = ml.licenseQuantitiesData.from.length;
            for (i = 0; i < len1; i++) {
                fromObj = ml.licenseQuantitiesData.from[i];
                if (fromObj.anchor == "TRUE") {
                    len2 = fromObj.licenseKeys.length;
                    for (j = 0; j < len2; j++) {
                        licenseObj = fromObj.licenseKeys[j];
                        licenseKey = licenseObj.licenseKey;
                        currentVal = licenseObj.userUpgradeQty;
                        arrayOfQtyChange.push(licenseKey + ":" + currentVal);
                    }

                }
            }

        }
        postData.licForUpgrade = arrayOfQtyChange.join(',');

        //postData.licForUpgrade = licForUpgradeArr.join(',');
        //postData.productInventoryId = $('#upgrade_server_name').val();
        //postData.productName = $("#upgrade_server_name option:selected").text();

        return postData;
    },
    postDataDowngrade: function() {
        var postData = {},
            licForDowngradeArr = [];
        $("#tbl_downgradelic input:text").each(function() {
            var qtylen = $(this).attr('id').length,
                maxId = $(this).attr('id').substring(4, qtylen);

            licForDowngradeArr.push($('#key_' + maxId).html() + ':' + $(this).val());
        });
        postData.licForDowngrade = licForDowngradeArr.join(',');
        postData.productInventoryId = $('#downgrade_server_name').val();
        postData.productName = $("#downgrade_server_name option:selected").text();

        return postData;
    },
    postDataMove: function() {},
    loadCLDataTable: function() {

        /** need to hide the header through data table configuration, add scroll **/
        vmf.datatable.build(ml.$modalRef.find('#clDataTable'), {
            "aoColumns": [{
                "bVisible": false
            }, {
                "sTitle": "<span class='descending'>" + mlRS.common.dataTableHeadingCombine + "</span>",
                "sWidth": "35%",
                "bSortable": false
            }, {
                "sTitle": "<span class='descending'>" + mlRS.combine.txt.combineDataQuantity + "</span>",
                "sWidth": "25%",
                "bSortable": false
            }, {
                "sTitle": "<span class='descending'>" + mlRS.combine.txt.DataFolder + "</span>",
                "sWidth": "40%",
                "bSortable": false
            }, {
                "bVisible": false
            }, {
                "bVisible": false
				}
			],
            "bInfo": false,
            "bServerSide": false,
            "bAutoWidth": false,
            "aaData": ml.mlMap.combine.dataTableData,
            "bProcessing": true,
            "oLanguage": {
                "sProcessing": "Loading...", // Note: to be moved to resource bundle
                "sLoadingRecords": ""
            },
            "bPaginate": false,
            "sPaginationType": "full_numbers",
            "sScrollY": 187,
            "sDom": 'zrtSpi',
            "bFilter": false,
            "fnRowCallback": function(nRow, aData, iDisplayIndex) {
                $(nRow).find("td:eq(0)").prepend("<span class='openclose'></span>").end().data("id", aData);
                $(nRow).find("td:eq(2)").html("<span class='ellipsisTxt folderPathCL'>" + aData[3] + "</span>");
                return nRow;
            },
            "fnDrawCallback": function() {
                var settings = this.fnSettings();
                if (settings.jqXHR && settings.jqXHR.responseText !== null && settings.jqXHR.responseText.length && typeof settings.jqXHR.responseText == "string") {
                    var jsonRes = vmf.json.txtToObj(settings.jqXHR.responseText);
                    ml.mlMap.combine.dataTableData = jsonRes.aaData;
                    ml.$modalRef.find('#clProductName').html(mlRS.common.productName + " : " + jsonRes.prodName);
                }
            },
            "fnInitComplete": function() {
                $tbl = this;
                ml.$modalRef.find('#clDataTable').find('span.openclose').die('click').live("click", function() {
                    ml.expandRow($(this), $tbl);
                });
                ml.$modalRef.find('#clDataTable').find('.ellipsisTxt').die('click').live("click", function() {
                    $(this).addClass('normalWhiteSpace');
                });
            }
        }); // End of datatable config

        var _postData = "selectedLicenseKeys=" + ml.selectedLicenses.join(',');
        vmf.datatable.reload(ml.$modalRef.find('#clDataTable'), mlRS.combine.url.getLicenseDetails, "", "POST", _postData);
    },
    expandRow: function(o, t) {
        var nTr1 = o[0].parentNode.parentNode;
        if (o.hasClass('minus')) {
            o.removeClass('minus');
            $(nTr1).removeClass("expanded noborder").next("tr").hide();
        } else {
            o.addClass('minus');
            $(nTr1).addClass("expanded noborder");
            if (!nTr1.haveData) {
                t.fnOpen(nTr1, '', '');
                ml.getCdata($(nTr1), nTr1.idx);
                nTr1.haveData = true;
                $(nTr1).next("tr").addClass('more-detail');
            } else {
                $(nTr1).next("tr").show();
            }
        }
    },
    getCdata: function(rowObj, idx) {
        var sOut = [],
            cdata = rowObj.data("id"),
            cLHtml = [];
        sOut.push("<div class='note-wrapper clearfix'><div class='noteH'>" + mlRS[ml.mlType].txt.dNote + "</div><span class='note ellipsisTxt'>" + cdata[4] + "</span></div>");
        $.each(cdata[5], function(cL, cLv) {
            if (cLv != "") {
                cLHtml.push("<div class='lCont'><div class='sLabeln'>" + cL + ": </div><div class='sLabelv'>" + cLv + "</div></div>");
            }
        });
        sOut.push("<div class='note-wrapper clearfix clDiv'>" + cLHtml.join('') + "</div>")
        rowObj.next("tr").addClass('more-detail').find("td").html(sOut.join(''));
    },
    loadDivideData: function() {
        var dlResp,
            postData = "selectedLicenseKeys=" + ml.selectedLicenses;
        vmf.ajax.post(mlRS.divide.url.getLicenseDetails, postData, function(resp) {
            ml.$modalRef.find('#dlContainer .loading').hide()
                .end().find('.dlDivideData').show();
            dlResp = vmf.json.txtToObj(resp);
            dlResp.error ? ml.dlGetLicenseFailure(dlResp) : ml.dlGetLicenseSuccess(dlResp);
        });

    },
    dlGetLicenseSuccess: function(dlResp) {
        var optionList = [],
            cData = [],
            i;
        // append strings form mlRS
		ml.$modalRef.find('#dlLabelKeyFrom').html(mlRS.common.productName+ '&nbsp;' +':'+ '&nbsp;' +dlResp.prodName);
        ml.$modalRef.find('#dlKeyHeading').html(mlRS.common.dlKey);
		ml.$modalRef.find('#dlLabelSelectedProduct').append('<span id="activeLicense">' + dlResp.licenseKey + '</span>');
        ml.$modalRef.find('#dlNotesLabel').html("<div class='note-wrapper clearfix'><div class='noteH'>" + mlRS[ml.mlType].txt.dNote + "</div><span class='note dlNotesLabel ellipsisTxt'>" + dlResp.note + "</span></div>");
        // append data from response  @ responsejson.value
        $.each(dlResp.custLabels, function(custKey, custValue) {
            if (custValue != "") {
                cData.push("<div class='lCont'><div class='sLabeln'>" + custKey + ": </div><div class='sLabelv dlNotesLabel'>" + custValue + "</div></div>");
            }
        });
        if (cData.join('') != "") {
            ml.$modalRef.find('#customData').append("<div class='note-wrapper clearfix clDiv'>" + cData.join('') + "</div>");
            ml.$modalRef.find('#customData').show();
        }
        ml.$modalRef.find('.dlKeyCount').append(mlRS.divide.txt.divideCount);
        ml.$modalRef.find('.dlTotalInstance').append(mlRS.divide.txt.totalCount + ' ' + dlResp.quantity + ' ' + dlResp.uom);
        ml.$modalRef.find('.dlRemaningInstance').append(mlRS.divide.txt.remaning + ' <span id="dlrInstance">' + '0' + '</span> ' + dlResp.uom);
        optionList.push('<select id="selectedInstance" class="dlInput">');
        for (i = 2; i <= dlResp.quantity; i++) {
            optionList.push('<option' + ' value="' + i + '"' + '>' + i + '</option>');
        }
        optionList.push('</select>');
        ml.$modalRef.find('.dlSelectedKeyCount').append(optionList.join(''));
        ml.$modalRef.find('#newKeys').find('.cpus').html(dlResp.uom);
        ml.autoPopulate(dlResp.quantity);
        ml.$modalRef.find('#dlContainer').find('.ellipsisTxt').die('click').live("click", function() {
            $(this).addClass('normalWhiteSpace');
        });
                ml.$modalRef.find('#dlLabelSelectedProduct .openclose').die('click').live("click", function (){
                    $(this).toggleClass('minus');
                    $('#dlNotesLabel').toggleClass('hideAll');
                    $('#customData').children('div').show();
                    $('#customData').toggleClass('hideAll');
                });
    },
    dlGetLicenseFailure: function(dlResp) {
        ml.$modalRef.find('.dlDivideData .error_msg').html(mlRS.divide.txt.ajaxError);
    },
    /*Re using the existing code  - @ needs clean up and opmization */
    autoPopulate: function(totalInstance) {
        if (totalInstance != '') {
            var selval = ml.$modalRef.find('#selectedInstance').val();
            ml.populatelists(selval, totalInstance);
            ml.$modalRef.find('#selectedInstance').change(function() {
                ml.populatelists($(this).val(), totalInstance);
                ml.registerInputChange();
                ml.computeTotal();
            });
        }
        // ml.computeTotal();
        ml.registerInputChange();
    },
    /*Re using the existing code  - @ needs clean up and opmization */
    populatelists: function(selectedValue, totalInstance) {
        var dividedKey,
            mode,
            prevLabel,
            prevNo,
            newNo,
            $newKeys = ml.$modalRef.find('#newKeys'),
            $newli,
            i;
        if (selectedValue > 0) {
            //var diff = selectedValue - $newKeys.find('li').length;
            dividedKey = Math.floor(totalInstance / selectedValue);
            mode = totalInstance % selectedValue;
            $newli = $newKeys.find('li:first').clone();
            $newKeys.find('li').remove();

            $newKeys.append($newli);

            // foreach difference
            for (i = 0; i < selectedValue - 1; i++) {
                // Divide with total count

                // Need to clone and create new ones
                $newli = $newKeys.find('li:first').clone();
                $newKeys.find('li:first input').val(dividedKey);

                // Get the previous number
                // Look in the html for the second instance of "[" and then the second instance of "]".
                prevLabel = $newKeys.find('li:last label').attr('for');
                prevNo = prevLabel.substring(prevLabel.indexOf("[") + 1, prevLabel.indexOf("]"));
                newNo = parseInt(prevNo) + 1;

                // Simple, just find replace all the instances of [0] in attribute.
                $newli.find('label').attr('for', $newli.find('label').attr('for').replace(/\[0\]/, '[' + newNo + ']'));
                $newli.find('input').attr('id', $newli.find('input').attr('id').replace(/\[0\]/, '[' + newNo + ']'));
                $newli.find('input').attr('name', $newli.find('input').attr('name').replace(/\[0\]/, '[' + newNo + ']'));
                $newli.find('input').attr('value', dividedKey);
                $newKeys.append($newli); //Put it into the DOM after the last li
            }

            if (mode > 0) {
                for (i = 0; i < mode; i++) {
                    var iv = $newKeys.find('li input[name="licenseKey[' + i + ']"]').val();
                    var newv = Number(iv) + 1;
                    $newKeys.find('li input[name="licenseKey[' + i + ']"]').val(newv);
                }
            }
        }
    },
    /*Re using the existing code  - @ needs clean up and opmization */
    registerInputChange: function() {
        ml.$modalRef.find('#newKeys li input').blur(function() {
            ml.computeTotal();
        });
    },
    /*Re using the existing code  - @ needs clean up and opmization */
    computeTotal: function() {
        var _total = 0,
            error_msg = '&nbsp;',
            isError = false,
            _maxCPU,
            remaningInstance;
        if (ml.$modalRef.find("#newKeys input[type=text]").length <= 1) {
            return isError;
        }
        ml.$modalRef.find("#newKeys input[type=text]").each(function() {
            if (!isNaN($(this).val())) {
                if ($(this).val().length > 0) {
                    var value = parseInt($(this).val());
                    if (value > 0) {
                        _total = parseInt(_total + value);
                    } else {
                        error_msg = mlRS.divide.txt.zeroError;
                        isError = true;
                    }
                }
            } else {
                error_msg = mlRS.divide.txt.nonNumericError;
                isError = true;
            }
        });
        _maxCPU = parseInt(ml.$modalRef.find('#selectedInstance option:last-child').val());
        remaningInstance = _maxCPU - _total;
        if (remaningInstance >= 0) {
            ml.$modalRef.find('#dlrInstance').html(remaningInstance);
        }
        if (_maxCPU != _total && !isError) {
            error_msg = mlRS.divide.txt.misMatchError;
            isError = true;
        }
        ml.$modalRef.find('.dlDivideData .error_msg').html(error_msg);
        return isError;
    },
    renderDowngradeKeys: function(data) {
        var _jsonResponse = vmf.json.txtToObj(data),
            _lData = _jsonResponse.aaData,
            dataTableData = [],
            versionList = _jsonResponse.versionList || [],
            i,
            versionOptionsArr = [];

        ml.$modalRef.find('#dglContainer > .loading').hide();
        ml.$modalRef.find('.dglMiddleContainer').show();

        ml.$modalRef.find('#mlAttention .warning_big').css('visibility', 'visible');
        if (_jsonResponse.prodConfig && _jsonResponse.prodConfig.notes) {
            // show the attension message if restricted upgrade
            ml.$modalRef.find('#attentionHeader').html(mlRS.common.attentionHeading)
                .end().find('#attentionMsg').html(myvmware.common.buildLocaleMsg(mlRS.downgradeLicense.txt.restrictedText1, _jsonResponse.prodConfig.notes));
        } else {
            ml.common.updateAttentionText();
        }
        // update the base product name
		ml.$modalRef.find('#baseProductName').text(ice.globalVars.downgradeFrom+' ' + _jsonResponse.baseProduct+' ' + mlRS.common.dgUpTo);

        // update the versionList-dropdown values
        for (i = 0; i < versionList.length; i++) {
            versionOptionsArr.push('<option value="' + versionList[i].strLicenseGenInventoryId + '">' + versionList[i].strPrimaryDescription + '</option>');
        }
        ml.$modalRef.find('#downgrade_server_name').html(versionOptionsArr.join(''));

        // render the datatable
        for (i = 0; i < _lData.length; i++) {
            dataTableData[i] = [];
            dataTableData[i][0] = '<span class="textBlack" id="key_' + i + '">' + _lData[i][0] + '</span>';
            dataTableData[i][1] = '<div><input type="text" value="0" size="2" id="qty_' + i + '" class="text_right"><span> / </span><span id="max_' + i + '">' + _lData[i][1] + '</span> <span>' + _lData[i][2] + '</span></div><div class="error_msg">&nbsp;</div><div class="clearfix"></div>';
            dataTableData[i][2] = '<span class="textGrey ellipsisTxt folderPathDGL">\\\\' + _lData[i][3] + '</span>';
                        dataTableData[i][3] = _lData[i][3];
                        dataTableData[i][4] = _lData[i][4];
                        dataTableData[i][5] = _lData[i][5];
                        //console.log('line 1741 : dataTableData[i][5] : '+dataTableData[i][5]);
        };
        vmf.datatable.build(ml.$modalRef.find('#tbl_downgradelic'), {
            "bInfo": false,
            "bPaginate": false,
            "sPaginationType": "full_numbers",
            "bFilter": false,
            "sDom": 'zrtSpi',
			"sScrollY" : '151px',
            "bAutoWidth": false,
            "aoColumns": [{
                "sWidth": "270px",
                "sTitle": "<span>" + mlRS.common.dataTableHeadingCombine + "</span>",
                "bSortable": false
            }, {
                "sWidth": "200px",
                "sTitle": "<span>" + mlRS.downgradeLicense.txt.qtyToDowngrade + "</span>",
                "bSortable": false
            }, {
                "sWidth": "auto",
                "sTitle": "<span>" + mlRS.common.folderName + "</span>",
                "bSortable": false
				}
			],
            "aoColumnDefs": [{
                "sClass": "with_input",
                "aTargets": [1]
				}
			],
            "aaData": dataTableData,
            "fnInitComplete": function() {
                            $tbl = this;
                ml.$modalRef.find('#tbl_downgradelic input:text').die('focus', 'blur').live({
                    'focus': function() {
                        if (this.value == 0)
                            this.value = '';
                    },
                    'blur': function() {
                        if (this.value == '') {
                            this.value = 0;
                        }
                        ml.common.validateDowngradeDT($(this));
                    }
                });
                ml.$modalRef.find('#loading').hide();
                                ml.$modalRef.find('#tbl_downgradelic').find('span.openclose').die('click').live("click", function () {
					ml.expandRow($(this), $tbl);
				});
				ml.$modalRef.find('#tbl_downgradelic').find('.ellipsisTxt').die('click').live("click", function () {
					$(this).addClass('normalWhiteSpace');
				});
            },
            "fnRowCallback": function(nRow, aData, iDisplayIndex) {
				ml.$modalRef.find('#tbl_downgradelic').find('span.ellipsisTxt.folderPathCL').die('click').live("click", function () {
					$(this).addClass('normalWhiteSpace').css({'width' : '140px'});
                });
                $(nRow).find("td:eq(0)").prepend("<span class='openclose'></span>").end().data("id", aData);
				$(nRow).find("td:eq(2)").html("<span class='ellipsisTxt folderPathCL'>" + aData[3] + "</span>");
                return nRow;
            }

        });
    },
    renderUpgradeKeys: function(data) {
        var _jsonResponse = vmf.json.txtToObj(data),
            _lData = _jsonResponse.aaData,
            dataTableData = [],
            versionList = _jsonResponse.targetProducts || [],
            i,
            versionOptionsArr = [];

        ml.$modalRef.find('#uglContainer > .loading').hide();
        ml.$modalRef.find('.uglMiddleContainer').show();

        ml.$modalRef.find('#mlAttention .warning_big').css('visibility', 'visible');
        if (_jsonResponse.prodConfig && _jsonResponse.prodConfig.notes) {
            // hide the notes&labels section in the initial screen for restricted upgrade
            ml.$modalRef.find("#mlNotesLabelsSel").hide();
            ml.$modalRef.find('#innerCon').removeClass('innerConHt');

            // show the attension message if restricted upgrade
            ml.$modalRef.find('#attentionHeader').html(mlRS.common.attentionHeading)
                .end().find('#attentionMsg').html(myvmware.common.buildLocaleMsg(mlRS.upgradeLicense.txt.restrictedText1, _jsonResponse.prodConfig.notes));
        } else {
            ml.$modalRef.find("#mlNotesLabelsSel").css('visibility', 'visible');
            ml.common.updateAttentionText();
        }

        // update the base product name
		ml.$modalRef.find('#baseProductName').text(ice.globalVars.upgradeFrom+' ' + _jsonResponse.baseProduct +' ' + mlRS.common.dgUpTo);

        // update the versionList-dropdown values
        for (i = 0; i < versionList.length; i++) {
            versionOptionsArr.push('<option value="' + versionList[i].strLicenseGenInventoryId + '">' + versionList[i].strPrimaryDescription + '</option>');
        }
        ml.$modalRef.find('#upgrade_server_name').html(versionOptionsArr.join(''));

        // render the datatable
        for (i = 0; i < _lData.length; i++) {
            dataTableData[i] = [];
            dataTableData[i][0] = '<span class="textBlack" id="key_' + i + '">' + _lData[i][0] + '</span>';
            dataTableData[i][1] = '<span class="textBlack">' + _lData[i][1] + '</span> <span>' + _lData[i][2] + '</span>';
			dataTableData[i][2] = '<div><input type="text" value="0" size="2" id="qty_' + i + '" class="text_right"><span> / </span><span id="max_' + i + '">' + _lData[i][3] + '</span> <span>' + _lData[i][2] + '</span></div><div class="error_msg">&nbsp;</div>';
            dataTableData[i][3] = '<span class="textGrey ellipsisTxt folderPathUGL">\\\\' + _lData[i][4] + '</span>';
            dataTableData[i][4] = _lData[i][5];
            dataTableData[i][5] = _lData[i][6];
        };
        vmf.datatable.build(ml.$modalRef.find('#tbl_upgradelic'), {
            "bInfo": false,
            "bPaginate": false,
            "sPaginationType": "full_numbers",
            "bFilter": false,
            "sDom": 'zrtSpi',
			"sScrollY" : '151px',
            "bAutoWidth": false,
            "aoColumns": [{
                "sWidth": "250px",
                "sTitle": "<span>" + mlRS.common.dataTableHeadingCombine + "</span>",
                "bSortable": false
            }, {
                "sWidth": "150px",
                "sTitle": "<span>" + mlRS.common.totalQty + "</span>",
                "bSortable": false
            }, {
                "sWidth": "200px",
                "sTitle": "<span>" + mlRS.upgradeLicense.txt.qtyToUpgrade + "</span>",
                "bSortable": false
            }, {
                "sWidth": "auto",
                "sTitle": "<span>" + mlRS.common.folderName + "</span>",
                "bSortable": false
				}
			],
            "aoColumnDefs": [{
                "sClass": "with_input",
                "aTargets": [1]
				}
			],
            "aaData": dataTableData,
            "fnInitComplete": function() {
                                $tbl = this;
                ml.$modalRef.find('#tbl_upgradelic input:text').die('focus', 'blur').live({
                    'focus': function() {
                        if (this.value == 0)
                            this.value = '';
                    },
                    'blur': function() {
                        if (this.value == '') {
                            this.value = 0;
                        }
                        ml.common.validateUpgradeDT($(this));
                    }
                });
                ml.$modalRef.find('#loading').hide();
				ml.$modalRef.find('#tbl_upgradelic').find('span.openclose').die('click').live("click", function () {
					ml.expandRow($(this), $tbl);
				});
				ml.$modalRef.find('#tbl_upgradelic').find('.ellipsisTxt').die('click').live("click", function () {
					$(this).addClass('normalWhiteSpace');
				});
            },
            "fnRowCallback": function(nRow, aData, iDisplayIndex) {
				ml.$modalRef.find('#tbl_upgradelic').find('span.ellipsisTxt.folderPathUGL').die('click').live("click", function () {
					$(this).addClass('normalWhiteSpace').css({'width' : '90px'});
                });
                 $(nRow).find("td:eq(0)").prepend("<span class='openclose'></span>").end().data("id", aData);
                return nRow;
            }
        });
    },
    showDowngradeVI3OrderList: function(contractFormActionURL) {
        $('#selectedLicenseKeys').val(ml.selectedLicenses.join(','));
        $("#contractForm").attr('action', contractFormActionURL)
            .attr('target', '_blank');
        $("#contractForm").submit();
    }
};

/**
 * Folder Tree jQuery Plugin
 * Version **** 1.0.3  ****
 * Updated: 12/30/2011
 * This plugin can take in a list representation of tree structure and produce a folder tree for a subset of tree and attach events to the tree
 * @author Praveer Sengaru (psengaru@vmware.com)
 */
(function($) {
    /**
     * Function to get Folder JSON using Post Request, the response of this request is a JSON object
     *
     * @params
     * url: url for which POST request has to be made
     * requestParams: The set of request attribute/value pairs to be sent in the POST request
     * onSuccess: The callback function invoked upon successful execution of JSON POST request
     * onFailure: The callback function invoked upon failed execution of JSON POST request
     * onComplete: The callback function invoked irrespective of whether the execution was success or failure
     *
     * @return
     * JavaScript object representing folderPane as a Array List of folder information
     *
     */
    $.ft = {};
    $.ft.getFolderJSONPost = function(url, requestParams, onSuccess, onFailure, onComplete) { //Make sure there is no current ongoing request, if yes cancel it
        if ($.ft._fjqXHR && $.ft._fjqXHR.readystate != 4) {
            $.ft._fjqXHR.abort();
        }
        if ($.ft.opts.managePermViewFlag) {
            if (requestParams == null) {
                requestParams = new Object();
            }
            requestParams['managePermView'] = true;
        }
        $.ft._fjqXHR = $.ajax({
            type: 'POST',
            url: url,
            async: true,
            dataType: "json",
            data: requestParams,
            success: function(jsonResponse) {
                $.ft._folderListJSON = jsonResponse; //Making sure to disable loading
                $("#" + $.ft.opts.uniqueDiv + " ." + $.ft.opts.loadingClass).hide(); //Do validation
                var validationResult = $.ft.opts.validateJSONFunction(jsonResponse);
                if (validationResult != undefined && !validationResult) return false; //foldertree wont be constructed
                if (onSuccess != null) onSuccess(jsonResponse);
            },
            error: function(response, errorDesc, errorThrown) {
                if (errorDesc == "abort") {
                    if (console) {
                        console.log("Ongoing AJAX call aborted");
                    }
                } else if (onFailure != null) onFailure(response, errorDesc, errorThrown);
            },
            beforeSend: function() {
                $("#" + $.ft.opts.uniqueDiv + " ." + $.ft.opts.loadingClass).show();
            },
            complete: function(jqXHR, settings) {
                $("#" + $.ft.opts.uniqueDiv + " ." + $.ft.opts.loadingClass).hide();
                if (onComplete != null) onComplete(jqXHR, settings);
            },
            timeout: $.ft.opts.ajaxTimeout
        });
        return $.ft._folderListJSON;
    };
    /**
     * Function to populate the Folder Pane with tree structure
     *
     * @params
     * folderTreeJSON: The folder tree JavaScript Object
     *
     * u -  uniqueDiv
     * f -  json response data
     * p -  current parent ul node jquery element
     *
     * Abbreviations used
     * _fn - folder node
     * _fBuf - folder buffer
     *
     */
    $.ft.populateFolderUI = function(u, f, p) {
        $rch = null;
        var _fBuf = null;
        var _skelFN = $('<li><span class="folderNode"></span></li>');
        var bdge = $('<span class="badge asp">ASP</span>');
        /*if(f.folderContents.length == 0) {
            if(console != undefined) {
                console.log("No Folders received in Json response");
            }
        }*/
        if ($('#addUsersToFoldersContent3 #folderPane').length) $('#addUsersToFoldersContent3 #folderPane').css('height', 'auto').css('min-height', 'auto');
        $(f.folderContents).each(function(idx, v) {
            $.ft._folderHT.put(v.folderId, v);
            _fn = _skelFN.clone().addClass(v.folderId).addClass("folderlist").data({
                "folderId": v.folderId,
                "ftype": v.folderType
            }).attr("level", v.folderLevel - 1);
            if (!v.isLeaf && v.folderType != "ROOT") {
                $('span', _fn).eq(0).prepend($('<a></a>').addClass($.ft.opts.oc));
                _fn.removeClass('no_child');
            }
            if (v.isLeaf && v.folderType != "ROOT") {
                _fn.addClass('no_child');
            } //Add no_child only if it is not a ROOT folder
            //($.ft.opts.inputType == 'checkbox')?$('span', _fn).append('<input type=\"checkbox\">'):$('span', _fn).append('<input type=\"radio\" name=\"foldername\" >');
            if ($.ft.opts.inputType == 'checkbox') $('span', _fn).append('<input type=\"checkbox\">');
            if ($.ft.opts.wrapEllipseBtn) {
                $('span', _fn).append('<span class=\'folderTxt\'>' + v.folderName + '</span>');
            } else {
                $('span', _fn).append(v.folderName);
            }
            if (v.folderType == "ASP" || v.folderType == "VCE" || v.folderType == "CPL") {
                var titleattr = "";
                if ($.ft.opts.wrapEllipseBtn) {
                    $('span.folderNode', _fn).append(bdge.clone().html(v.folderType));
                } else {
                    $('span', _fn).append(bdge.clone().html(v.folderType));
                }
                if (v.folderType == "ASP") {
                    $('span', _fn).attr('title', ((typeof $staticTextforASP != "undefined") ? $staticTextforASP : ""));
                }
                if (v.folderType == "VCE") {
                    $('span', _fn).attr('title', ((typeof $staticTextforVCE != "undefined") ? $staticTextforVCE : ""));
                }
                if (v.folderType == "CPL") {
                    $('span', _fn).attr('title', ((typeof $staticTextforCPL != "undefined") ? $staticTextforCPL : ""));
                }
                if ($.ft.opts.inputType == 'checkbox') $('span', _fn).find('input:checkbox').addClass('special ' + v.folderType).data('folderType', v.folderType);
            }
            if (v.folderAccess == "NONE") {
                //removed disabled attribute to span - It is causing issue in adding events to span in IE
                $(_fn).children().addClass("disabled tooltip").attr('title', (v.folderType != "ROOT") ? $.ft.opts.folderDisabledText : $.ft.opts.homeDisabledText);
                $('input', _fn).attr('readonly', true);
            }
            if (v.folderType == 'ROOT' && v.folderAccess != "NONE") {
                IsLoggedInUserRootAccess = true;
            }
            $.ft.opts.cbOnFolderNodeCreate(_fn, v);
            if (v.folderType == "ROOT") {
                if (_fBuf == null) {
                    //_fBuf = $('<ul></ul>');
                    _fBuf = ($.ft.opts.inputType == 'checkbox') ? $('<ul class="checks"></ul>') : $('<ul class="noRadio"></ul>');
                }
                $('a', _fn).addClass($.ft.opts.op).data('hasdata', true);
                $rch = $("<ul class='top_border'></ul>");
                $(_fn).append($rch);
                _fBuf.append(_fn);
            } else if (v.folderLevel == 2 && _fBuf != null) {
                if (v.folderType != "FLEX") // BUG-00025556
                    $('ul', _fBuf).append(_fn);
            }
            if (p != undefined) { //When user drills down the folder tree
                if (_fBuf != null) {
                    _fBuf.append(_fn);
                } else { //_fBuf is null
                    _fBuf = $('<div></div>');
                    _fBuf.append(_fn);
                }
            }
        });
        if (p == undefined) {
            $('#' + u + ' .folderPane').append(_fBuf);
        } else {
            var _urFolder = p.siblings().filter('ul.urFolder'),
                checked = false;
            p.append(_fBuf.children());
            if (_urFolder.length > 0) {
                $(_urFolder.children()).each(function(ur_idx, ur_v) {
                    _ur_folderId = $(ur_v).data("folderId");
                    if ($.ft._folderHT.containsKey(_ur_folderId) && $.ft._folderHT.get(_ur_folderId).folderIdList == undefined) { //UR Folder is rendered in this child tree
                        if ($('input', ur_v).is(':checked')) {
                            checked = true;
                            $("." + _ur_folderId + " .fWrap", p).addClass("active").find('input').attr('checked', true);
                        } else {
                            $("." + _ur_folderId + " .fWrap", p).find('input').attr('checked', false);
                        }
                        $(ur_v).remove();
                        if (checked) $("." + _ur_folderId, p).find('input').attr('checked', true);
                        checked = false;
                    } else {
                        $.ft._selectedFolders.remove(_ur_folderId);
                        var _fObj = $.ft._folderHT.get(_ur_folderId);
                        $.ft._folderHT.remove(_ur_folderId);
                        if ($('input', ur_v).is(':checked')) {
                            $.ft.showURFolder(_ur_folderId, _fObj, false, true);
                        } else {
                            $.ft.showURFolder(_ur_folderId, _fObj, false, false);
                        }
                        $(ur_v).remove();
                    }
                });
            }
        }
        $.ft.opts.checkRootFolderAccess();
        $.ft.opts.loadComplete(); //After complete folder tree is loaded this method will be invoked
    };

    /**
     * Function to expand and preselect folder given 'folderId'
     *
     *@params
     *
     *folderId, scrollEnabled
     * folderId - folderId for the folder to be preselected
     * scrollEnabled <boolean> - If this option is set to true and there is a vertical scrollbar for folder pane then the user will be automatically be navigated to the selected folder with given folderId
     *
     */
    $.ft.expandAndSelectFolder = function(folderId, scrollEnabled, selectEnabled) {
        if ($.ft._folderHT.containsKey(folderId)) {
            // clear previous highlights if input type is radio
            if ($.ft.opts.inputType == 'radio' && selectEnabled) {
                $('#' + $.ft.opts.uniqueDiv + ' .folderPane').find('span.' + $.ft.opts.folderSelectedClass).removeClass($.ft.opts.folderSelectedClass);
                if ($.ft._prevCheckedRadio == null) {
                    $.ft._currCheckedRadio = $('#' + $.ft.opts.uniqueDiv + ' .' + folderId).children().filter('span').children().filter('input');
                    $.ft._prevCheckedRadio = $.ft._currCheckedRadio;
                    $.ft._currCheckedRadio.attr('checked', true);
                } else if ($.ft._prevCheckedRadio != null || $.ft._prevCheckedRadio != undefined) {
                    $.ft._prevCheckedRadio.attr('checked', false);
                    $.ft._currCheckedRadio = $('#' + $.ft.opts.uniqueDiv + ' .' + folderId).children().filter('span').children().filter('input');
                    $.ft._currCheckedRadio.attr('checked', true);
                    $.ft._prevCheckedRadio = $.ft._currCheckedRadio;
                }
                $.ft._selectedFolders.clear();
            } else if (selectEnabled) {
                $('#' + $.ft.opts.uniqueDiv + ' .' + folderId).children().filter('span').children().filter('input').attr('checked', true);
            }

            if (selectEnabled) {
                $('#' + $.ft.opts.uniqueDiv + ' .' + folderId).children().filter('span').addClass($.ft.opts.folderSelectedClass);
            }
            if (!($.ft._selectedFolders.containsKey(folderId)) && selectEnabled) { //If not already selected
                $.ft.opts.cbOnClickFunction(folderId, 'checked');
                $.ft._selectedFolders.put(folderId, true);
                $.ft.opts.cbOnClickSelFoldersFunction($.ft._selectedFolders.keys(), 'checked');
                $.ft.opts.cbOnClickSelFoldersEFunction($.ft._selectedFolders.keys(), folderId, 'checked');
            }
            //Expand all parents if not already expanded
            var _currFolder = $('#' + $.ft.opts.uniqueDiv + ' .' + folderId);
            var _parentsUl = _currFolder.parents('ul');
            $(_parentsUl).each(function(index, value) {
                if (!($(this).is(":visible"))) {
                    $(this).show();
                    $(this).siblings('ul').show();
                    //$(this).siblings().first().find('a').removeClass($.ft.opts.oc);
                    $(this).siblings().first().find('a').addClass($.ft.opts.op);
                    var _expandedFid = $(this).parent().data('folderId');
                    $.ft._expandedFolders.put(_expandedFid, true);
                }
            });

            if (scrollEnabled) {
                var _folderPaneJQElem = $('#' + $.ft.opts.uniqueDiv + ' .folderPane');
                if (_folderPaneJQElem.hasClass('scroll')) {
                    _folderPaneJQElem.scrollTo($('#' + $.ft.opts.uniqueDiv + ' .' + folderId), $.ft.opts.slideAnimSpeed, {
                        "axis": "y"
                    });
                } else {
                    _folderPaneJQElem.closest('.scroll').scrollTo($('#' + $.ft.opts.uniqueDiv + ' .' + folderId), $.ft.opts.slideAnimSpeed, {
                        "axis": "y"
                    });
                }
            }
            return _currFolder;
        } else {
            return null;
        }
    };


    /**
     * Function to display unrendered folders which are not in browser DOM
     */
    $.ft.showURFolder = function(fId, fObj, invCB, selFlag) {
        var _fFound = false,
            _curFolderLevel = 0;
        var _fPos = 0;
        for (var i = 0; i < fObj.folderIdList.length; i++) {
            if ($.ft._folderHT.containsKey(fObj.folderIdList[i].toString())) {
                _fFound = true;
                _fPos = i;
                break;
            }
        }
        if (_fFound) {
            var _currFolder = $.ft.expandAndSelectFolder(fObj.folderIdList[_fPos].toString(), false, false); //Expand upto the branch folder
            _curFolderLevel = parseInt(_currFolder.attr("level"), 10);
            if (_currFolder != null) {
                //Construct UR Folder
                if ($.ft.opts.inputType == 'checkbox') {
                    var _urSkel = $("<li class=\"folderlist\"><span class=\"fWrap folderNode\"><input type=\"checkbox\"><span unselectable=\"on\"></span></span></li>");
                } else {
                    var _urSkel = $("<li class=\"folderlist\"><span class=\"fWrap folderNode\"><span unselectable=\"on\"></span></span></li>");
                }
                _urSkel.addClass(fObj.folderId).data("folderId", fObj.folderId).attr("level", _curFolderLevel + 1);
                $('span', _urSkel).eq(0).prepend("...  ");
                $('span', _urSkel).eq(1).append(fObj.folderName);
                if (selFlag) {
                    $(_currFolder).parents('ul.noRadio').find('span.folderNode').removeClass('active');
                    $('input', _urSkel).attr('checked', true);
                    $('span', _urSkel).eq(0).addClass("active");
                }
                $.ft._folderHT.put(fObj.folderId, fObj);
                $.ft._selectedFolders.put(fObj.folderId, true);
                //Append UR Folder
                if ($('ul', _currFolder).length > 0) {
                    $('ul', _currFolder).append(_urSkel);
                } else {
                    var _ulWrap = $("<ul></ul>").addClass('urFolder');
                    $(_currFolder).append(_ulWrap);
                    $('ul', _currFolder).append(_urSkel);
                }
                if (invCB) {
                    $.ft.opts.cbOnClickSelFoldersFunction($.ft._selectedFolders.keys(), 'checked');
                    $.ft.opts.cbOnClickSelFoldersEFunction($.ft._selectedFolders.keys(), fObj.folderId, 'checked');
                    $.ft.opts.cbOnClickFunction(fObj.folderId, 'checked');
                }
            }
            $.ft.attachEvents();
        }
    }

    /**Function to attach events to the Folder Pane tree structure
     * @params
     */

    $.ft.attachEvents = function() {
        //To disable folder name selection in IE on double click
        $('#' + $.ft.opts.uniqueDiv + ' .folderPane li > span > span').each(function() {
            $(this).attr('unselectable', 'on');
            $(this).bind('selectstart', function() {
                return false;
            });
        });
        //Attach events for expand and collapse click
        $('#' + $.ft.opts.uniqueDiv + ' .folderPane a.' + $.ft.opts.oc).unbind('click').bind('click', function() {
            $t = $(this);
            $ul = $t.closest('li').children().filter('ul').filter(function(idx) {
                return !($(this).hasClass('urFolder'));
            });
            if ($t.hasClass($.ft.opts.op)) {
                if ($ul.length <= $.ft.opts.slideMax) {
                    $ul.slideUp($.ft.opts.slideAnimSpeed);
                    myvmware.common.setAutoScrollWidth('div.folderPane ul');
                } else {
                    $ul.css('display', 'none');
                    myvmware.common.setAutoScrollWidth('div.folderPane ul');
                }
                $t.removeClass($.ft.opts.op);
                //var _spanClass = $(this).parents('li').attr('class').split(' ');
                //$.ft._expandedFolders.remove(_spanClass[0]);
            } else {
                if ($t.data("hasdata")) {
                    if ($ul.length <= $.ft.opts.slideMax) {
                        $ul.slideDown($.ft.opts.slideAnimSpeed, function() {
                            myvmware.common.setAutoScrollWidth('div.folderPane ul');
                        });
                    } else {
                        $ul.css('display', '');
                        myvmware.common.setAutoScrollWidth('div.folderPane ul');
                    }
                } else {
                    $.ft.getChildData($t);
                    //console.log($(this).parent().addClass("no_border"));
                }
                $t.addClass($.ft.opts.op);
                //var _spanClass = $(this).parents('li').attr('class').split(' ');
                //$.ft._expandedFolders.put(_spanClass[0], true);
            }
            //$(this).parent().toggleClass("no_border");
            //$(this).parent().next().toggleClass("top_border"); 
            return false;
        });

        //Disable preselected select-all checkbox
        //$('#' + $.ft.opts.uniqueDiv + ' .select-all').attr('checked', false);/*Commented as part of CR-13272 */
        //Attach event for select all checkbox
        $('#' + $.ft.opts.uniqueDiv + ' .select-all').unbind('click').bind('click', function() {
            //On Select-All - Select all checkboxes except read-only and special folders(ASP, VCE, CPL)
            var allCheckboxes = $('#' + $.ft.opts.uniqueDiv + ' .folderPane').find('input[type=checkbox]:not([readonly])').not('.special'),
                folderId = '';
            if (!$(this).is(':checked')) { //If already checked then uncheck
                $(allCheckboxes).attr('checked', false);
                $.ft._selectedFolders.clear();
                $(allCheckboxes).each(function(index, value) {
                    folderId = $(this).closest('li').data('folderId');
                    //$.ft.opts.cbOnClickFunction(folderId, 'unchecked');
                    $(this).closest('span').removeClass("active");
                });
                $.ft.opts.cbOnClickSelFoldersEFunction($.ft._selectedFolders.keys(), folderId, 'unchecked');
            } else { //otherwise check all checkboxes
                $(allCheckboxes).attr('checked', true);
                $(allCheckboxes).each(function(index, value) {
                    folderId = $(this).closest('li').data('folderId');
                    if (!($.ft._selectedFolders.containsKey(folderId))) {
                        $.ft._selectedFolders.put(folderId, true);
                    }
                    //$.ft.opts.cbOnClickFunction(folderId, 'checked');
                    $(this).closest('span').addClass("active");
                });
                $.ft.opts.cbOnClickSelFoldersEFunction($.ft._selectedFolders.keys(), folderId, 'checked');
            }
        });
        //Binds npMsgFunction as callback when readonly checkbox is clicked
        $('.folderPane input[readonly]').unbind('mousedown click').bind('mousedown click', function(e) {
            //$(this).attr('checked', false);
            e.preventDefault();
            $(this).removeAttr("checked");
            //$.ft.opts.npMsgFunction($.ft.opts.npMsgContent);
        });

        //Binds each non-readonly checkbox with the provided callback function
        /*$('#' + $.ft.opts.uniqueDiv + ' .folderPane').find('input[type=checkbox]:not([readonly])').unbind('click').click(function () {
			var _spanClass = $(this).parents('li').attr('class').split(' ');
			var _checkBoxLength = $('#' + $.ft.opts.uniqueDiv + ' .folderPane').find('input[type=checkbox]:not([readonly])').length;
			var _checkedLength = $('#' + $.ft.opts.uniqueDiv + ' .folderPane').find('input[type=checkbox]:not([readonly]):checked').length;
			if ($(this).attr('checked') != true) { //If unchecked
				$('#' + $.ft.opts.uniqueDiv + ' .select-all').attr('checked',false);
				$.ft._selectedFolders.remove(_spanClass[0]);
				$.ft.opts.cbOnClickSelFoldersFunction($.ft._selectedFolders.keys(), 'unchecked');
                $.ft.opts.cbOnClickSelFoldersEFunction($.ft._selectedFolders.keys(), _spanClass[0], 'unchecked');
				$.ft.opts.cbOnClickFunction(_spanClass[0], 'unchecked');
				$(this).parent().removeClass($.ft.opts.folderSelectedClass);
			} 
			else { //If checked
				if(_checkBoxLength==_checkedLength){
					$('#' + $.ft.opts.uniqueDiv + ' .select-all').attr('checked',true);
				}
				$.ft._selectedFolders.put(_spanClass[0], true);
				$.ft.opts.cbOnClickSelFoldersFunction($.ft._selectedFolders.keys(), 'checked');
                $.ft.opts.cbOnClickSelFoldersEFunction($.ft._selectedFolders.keys(), _spanClass[0], 'checked');
				$.ft.opts.cbOnClickFunction(_spanClass[0], 'checked');
				$(this).parent().addClass($.ft.opts.folderSelectedClass);
			}
		});*/
        var spanEle, cnt, $folderPane = $('#' + $.ft.opts.uniqueDiv + ' .folderPane ul.checks'),
            folderId = null;
        $folderPane.find('li span.folderNode:not(".disabled")').unbind('click mouseover mouseout').bind('click mouseover mouseout', function(e) {
            //e.stopPropagation();
            //e.preventDefault();
            if ($(this).hasClass("disabled")) return;
            if (e.type == "mouseover") {
                $(this).addClass('hover'); // Mouseover Background color
            } else if (e.type == "mouseout") {
                $(this).removeClass('hover'); // Remove Mouseover Background color
            } else {
                target = $(e.target), cnt = true;
                if (target.is("a.openClose")) {
                    return;
                } else if (target.is("input[type=checkbox]:not([readonly])")) {
                    spanEle = target.closest("span.folderNode"), $check = $(target);
                    checked = target.is(':checked');
                } else {
                    spanEle = $(this), $check = $(this).find("input[type=checkbox]:not([readonly])");
                    checked = !spanEle.hasClass('active');
                }
                if (checked) {
                    spanEle.addClass("active");
                    //If it is a special folder - Unselect and disable all chcekboxes except same folderType
                    if ($check.hasClass('special')) {
                        $check.closest("ul.checks").find('input:checkbox').removeClass("unselect");
                        $check.closest("ul.checks").find('input[type=checkbox]:not([readonly]):not(.' + $check.data("folderType") + ')').each(function() {
                            $(this).removeAttr('checked').attr('disabled', 'disabled').addClass("unselect").parent('span').removeClass('active');
                            $('#' + $.ft.opts.uniqueDiv + ' .select-all').removeAttr("checked").attr('disabled', 'disabled').addClass('unselect');
                            $.ft._selectedFolders.remove($(this).closest('li').data('folderId'));
                        });
                    }
                    $check.attr("checked", "checked");
                    folderId = spanEle.closest('li').data("folderId");
                    $('input:checkbox:not(".special"):enabled', $folderPane).each(function() {
                        if (!$(this).attr("checked")) cnt = false;
                    });
                    if (cnt && $('input:checkbox:not(".special"):enabled', $folderPane).length) {
                        $('#' + $.ft.opts.uniqueDiv + ' .select-all').attr("checked", "checked");
                    }
                    $.ft._selectedFolders.put(folderId, true); //Selected Folders
                    $.ft.opts.cbOnClickSelFoldersFunction($.ft._selectedFolders.keys(), 'checked');
                    $.ft.opts.cbOnClickSelFoldersEFunction($.ft._selectedFolders.keys(), folderId, 'checked');
                } else {
                    if ($check.hasClass('special') && !$('#folderPane input:checkbox:(".special"):checked').length) {
                        $check.closest("ul.checks").find('input[type=checkbox]:not([readonly])')
                            .removeAttr('disabled').removeClass("unselect");
                        $('#' + $.ft.opts.uniqueDiv + ' .select-all').removeAttr("disabled").removeClass('unselect');
                    }
                    spanEle.removeClass("active");
                    $check.removeAttr("checked");
                    folderId = spanEle.closest('li').data("folderId");
                    $.ft._selectedFolders.remove(folderId);
                    $('#' + $.ft.opts.uniqueDiv + ' .select-all').removeAttr("checked");
                    $.ft.opts.cbOnClickSelFoldersFunction($.ft._selectedFolders.keys(), 'unchecked');
                    $.ft.opts.cbOnClickSelFoldersEFunction($.ft._selectedFolders.keys(), folderId, 'unchecked');
                }
            }
        });

        //Binds each non-readonly radio button with the provided callback function
        $('#' + $.ft.opts.uniqueDiv + ' .folderPane ul.noRadio li.folderlist span.folderNode:not(".disabled")').live('click mouseover mouseout', function(e) {
            //e.preventDefault();
            if (e.type == "mouseover") {
                $(this).addClass('hover');
            } else if (e.type == "mouseout") {
                $(this).removeClass('hover');
            } else {
                if ($(this).hasClass('active')) {
                    return;
                }
                $(this).closest('section').find('span.folderNode').removeClass('active');
                $(this).addClass('active');
                $.ft.opts.cbOnClickFunction($(this).closest('li').data("folderId"), 'checked');
                // clear previous highlights
                /*$('#' + $.ft.opts.uniqueDiv + ' .folderPane').find('span.' + $.ft.opts.folderSelectedClass).removeClass($.ft.opts.folderSelectedClass);
				// highlight current node
				//$(this).parent().addClass($.ft.opts.folderSelectedClass);*/
            }
        });
        var l = 0;
        $(".folderPane ul.checks li span.folderNode").each(function() {
            l = parseInt($(this).closest("li").attr("level"), 10);
            $(this).css("padding-left", 15 + ((l - 1) * 18) + "px");
        });
        $(".folderPane ul.noRadio li span.folderNode").each(function() {
            l = $(this).closest("li").attr("level");
            if (l == 0) {
                $(this).css("padding-left", 15 + "px");
            } else if ($(this).find("a.openClose").length) {
                $(this).css("padding-left", 15 + (l - 1) * 18 + "px");
            } else {
                $(this).css("padding-left", 15 + l * 18 + "px");
            }
        });
        myvmware.hoverContent.bindEvents($('.folderPane .tooltip'), 'default');
    };
    $.ft.getChildData = function(obj) {
        pLi = obj.closest('li'); // parent li
        var emsSelectFolderFromTreeURL = $.ft.opts.url;
        if ($.ft.opts.requestParams == null) {
            var _postData = new Object();
        } else {
            var _postData = $.ft.opts.requestParams;
        }
        _postData['navigatingFolderId'] = pLi.data('folderId');
        if ($.ft.opts.managePermViewFlag) {
            _postData['managePermView'] = true;
        }
        $.ajax({
            type: 'POST',
            url: emsSelectFolderFromTreeURL,
            async: true,
            dataType: "json",
            data: _postData,
            success: function(jsonResponse) {
                $.ft._folderListJSON = jsonResponse;
                //Making sure to disable loading
                $("#" + $.ft.opts.uniqueDiv + " ." + $.ft.opts.loadingClass).hide();
                //Do validation
                var validationResult = $.ft.opts.validateJSONFunction(jsonResponse);
                if (validationResult != undefined && !validationResult) return false; //foldertree wont be constructed
                obj.data('hasdata', true);
                pObj = $('<ul></ul>');
                pLi.append(pObj);
                $.ft.populateFolderUI($.ft.opts.uniqueDiv, jsonResponse, pObj);
                myvmware.common.setAutoScrollWidth('div.folderPane ul');
                if ($(".folderPane input:checkbox.special:checked").length) pLi.find("ul input:checkbox, ul span.folderNode")
                    .filter('input:checkbox').attr("disabled", "disabled").end()
                    .filter('span').addClass('disabled');
                $.ft.attachEvents();
            },
            error: function(response, errorDesc, errorThrown) {
                if (errorDesc == "abort") {
                    /*if(console) {
                        console.log("Ongoing AJAX call aborted");
                    }*/
                } else {
                    $.ft.opts.errorFunction(response, errorDesc, errorThrown);
                    //console.log("In error: " + errorThrown);
                }
            },
            beforeSend: function() {
                $("#" + $.ft.opts.uniqueDiv + " ." + $.ft.opts.loadingClass).show();
            },
            complete: function(jqXHR, settings) {
                $("#" + $.ft.opts.uniqueDiv + " ." + $.ft.opts.loadingClass).hide();
                //if(onComplete != null) onComplete(jqXHR, settings);
                /*CR-13272 Code Changes Start*/
                var chkAll = $('#' + $.ft.opts.uniqueDiv + ' .select-all');
                if (chkAll.length) {
                    if (chkAll.is(':checked')) {
                        pLi.find("ul input:checkbox").attr('checked', true);
                        pLi.find('span.folderNode').addClass('active');
                    } else {
                        pLi.find("ul input:checkbox").removeAttr('checked');
                        pLi.find('span.folderNode').removeClass('active');
                    }
                }
                /*CR-13272 Code Changes End*/
            },
            timeout: $.ft.opts.ajaxTimeout
        });
    };
    $.ft.renderFolderPane = function(folderListJSON) {
        if (folderListJSON.emptyTree) {
            if ($("button#exportAllToCsvButton") != null && $("button#exportAllToCsvButton") != 'undefined') { //BUG-00047200
                $("button#exportAllToCsvButton").hide();
                if ($("button#showAllUpgradeOptionsButton") != 'undefined'){
                    $("button#showAllUpgradeOptionsButton").hide();
                }
            }

            $('#' + $.ft.opts.uniqueDiv + ' .folderPane').append("<div class=\"emptyTree\">" + $.ft.opts.emptyTreemsg + "</div>");
            if ($('#selectFolderInfoDiv ul li').length > 0) {
                $('#selectFolderInfoDiv ul li.initmsg').hide();
            } //BUG-00033285
            return;
        } else { //BUG-00047200
            if ($("button#exportAllToCsvButton") != null && $("button#exportAllToCsvButton") != 'undefined') {
                $("button#exportAllToCsvButton").show();
                if ($("button#showAllUpgradeOptionsButton") != 'undefined'){
                    $("button#showAllUpgradeOptionsButton").show();
                }
            }
        }
        $.ft.populateFolderUI($.ft.opts.uniqueDiv, folderListJSON);
        myvmware.common.setAutoScrollWidth('div.folderPane ul');
        IsLoggedInUserSUorOU = folderListJSON.superuser;
        $.ft.opts.checkRootFolderPermisssion(folderListJSON);
        if ($('#selectFolderInfoDiv ul li').length > 0) {
            $('#selectFolderInfoDiv ul li.initmsg').show();
        } //BUG-00033285
        $.ft.attachEvents();
    };

    /**
     * Function to find folders from folder tree based upon search term
     *
     * @params
     * searchTerm : search string as an input to the function
     *
     * @return
     * Returns array of folder ids matching the given search term for folder name
     *
     */

    $.ft.findFolder = function(searchTerm) {
        searchTerm = searchTerm.toLowerCase();
        $.ft._findFolderIds = [];
        var _fldCnt = 0;
        $($.ft._folderListJSON.folderContents).each(function(index, value) {
            if (value.folderName.toLowerCase().indexOf(searchTerm) != -1) {
                $.ft._findFolderIds[_fldCnt] = value.folderId;
                _fldCnt = _fldCnt + 1;
            }
        });
        return ($.ft._findFolderIds);
    };

    /**
     * Function to store the permission value in folder tree Hash table
     *
     * @params
     *
     *  - folderId
     *
     * permission object:
     *  contains:
     *  - viewP
     *  - manageP
     *  - divCombP
     *  - upgDwgP
     *
     */
    $.ft.storePermission = function(folderId, permissionObj) {
        var _currFolderObj = $.ft._folderHT.get(folderId);
        if (permissionObj != undefined) {
            if (permissionObj.manage) {
                _currFolderObj.folderAccess = "MANAGE";
            } else if (permissionObj.view) {
                _currFolderObj.folderAccess = "VIEW";
            } else if (!(permissionObj.view)) {
                _currFolderObj.folderAccess = "NONE";
            }
            _currFolderObj.permission = permissionObj;
            $.ft._folderHT.put(folderId, _currFolderObj);
        }
        /*else {
            if(console != undefined) {
                console.error("permissionObj for function storePerm cannot be undefined");
            }
        }*/
    }

    /**
     * Function to validate the folders from folder tree based upon create and rename
     *
     * @params
     * curFolderId : curFolderId string as an input to the function
     * curFolderName : foldername string as an input to the function
     *
     * @return
     * Returns true/false, if it is true then the foldername is duplicate
     *
     */
    $.ft.duplicateFolder = function(curFolderId, curFolderName) {
        /*curFolderName = curFolderName.toLowerCase();
		$.ft._duplicateFolder = false;                
		$($.ft._folderListJSON.folderContents).each(function (index, value) {
                    if(value.parentFolderId == curFolderId && value.folderName.toLowerCase() == curFolderName) { // 111==111 && test == test; return true
                           $.ft._duplicateFolder = true;                                
                    }
		});
		return($.ft._duplicateFolder);*/
    };

    /** $ is an alias to jQuery object */
    $.ft.foldertree = function(options) {
        $.ft.opts = jQuery.extend({
            url: '',
            requestParams: null,
            defaultState: 'onelevelexpand', //Can take 'collapseall', 'expandall' and 'onelevelexpand'
            inputType: 'checkbox', //Can take 'checkbox' and 'radio'
            uniqueDiv: 'folderDiv',
            collapsible: 'collapsible',
            expandable: 'expandable',
            oc: 'openClose',
            op: 'open',
            clickable: 'clickable',
            nonclickable: 'nonclickable',
            folderList: 'folderlist',
            ajaxTimeout: 20000,
            folderSelectedClass: 'active',
            filterClass: 'columnFilter',
            loadingClass: 'ajaxLoading',
            expandSelect: true,
            wrapEllipseBtn: false,
            slideMax: 30,
            slideAnimSpeed: 250, //Change the sliding (Up/Down) animation speed when folders are expanded and collapsed : lower values means higher speed and vice-versa
            managePermViewFlag: false,
            emptyTreemsg: (typeof emptyTreemsg != "undefined") ? emptyTreemsg : "",
            homeDisabledText: 'See Help for reasons why you cannot view the contents of this folder.',
            folderDisabledText: 'Expand to see folders you can access.',
            npMsgFunction: function(msgTxt) {}, //No permission Message callback Function
            npMsgContent: '', //No permission Message Content
            cbOnFolderNodeCreate: function(folderElem, folderValue) {}, //Callback gets executed when foldertree creates a node before adding it to browser's DOM
            //Argument 1: folder Node's DOM element, Argument 2: folder Node's value which is the equivalent of each entry on folderContents
            // !! Warning please use the above callback cautiously, any intensive operation should be avoided as it may cause severe delay in the foldertree construction !!
            cbOnClickFunction: function(folderID, cbState) {}, //Non readonly checkbox on Click callback function
            cbOnClickSelFoldersFunction: function(selectedFolders, cbState) {}, //Non readonly selected folders on Click callback function, valid only for checkboxes and not radio buttons
            cbOnClickSelFoldersEFunction: function(selectedFolders, folderId, cbState) {}, //Non readonly selected folders on Click callback function, valid only for checkboxes and not radio buttons
            validateJSONFunction: function(folderJSON) {}, //For validating the received JSON response
            errorFunction: function(response, errorDesc, errorThrown) {}, //For handling the error thrown in JSON response
            cbFolderNodeFunction: function() {},
            checkRootFolderPermisssion: function(response) {},
            checkRootFolderAccess: function(response) {},
            loadComplete: function(response) {} //For invoking context menu after folder tree is loaded
        }, options);

        $.ft._folderHT = new vmf.data.Hashtable(); //Create a Hashtable to store folder associated with each folderId
        $.ft._selectedFolders = new vmf.data.Hashtable(); //Store selected folders
        $.ft._expandedFolders = new vmf.data.Hashtable(); //Store expanded folders
        $.ft._folderListJSON = null; //Store Folder List JSON
        $.ft._prevCheckedRadio = null;
        $.ft._currCheckedRadio = null;
        $.ft._findFolderIds = new Array(); //Array of found folder ids
        if ($.ft._fjqXHR == undefined) {
            $.ft._fjqXHR = null; //jqXHR object
        }
    };
})(jQuery);

vmf.foldertreeAnother = function($) {
    return {
        build: function(url, config) {
            config = config || {};
            //Comment the following
            //url = '/sample/ft_json10_new.json';
            if (url != undefined || url != "undefined") {
                config.url = url;
            }

            //Pass the config settings
            $.ft.foldertree(config);
            //Clear the Division for folder tree if a previous tree is populated already
            $('#' + config.uniqueDiv + ' .folderPane > ul').remove();
            $('#' + config.uniqueDiv + ' .folderPane > .emptyTree').remove();
            //request for JSON and render the tree
            $.ft.getFolderJSONPost(url, $.ft.opts.requestParams, $.ft.renderFolderPane, $.ft.opts.errorFunction, null);
        },
        reload: function(requestParams) {
            //Empty the existing tree and construct a new tree
            $('#' + $.ft.opts.uniqueDiv + ' .folderPane > ul').remove();
            $.ft.getFolderJSONPost($.ft.opts.url, requestParams, $.ft.renderFolderPane, $.ft.opts.errorFunction, null);
        },
        populate: function(uniqueDiv, folderListJSON) {
            $.ft.populateFolderUI(uniqueDiv, folderListJSON);
            myvmware.common.setAutoScrollWidth('div.folderPane ul');
            $.ft.attachEvents();
        },
        getFolderJSON: function() {
            if ($.ft._folderListJSON != undefined) return $.ft._folderListJSON;
        },
        getFolderHashtable: function() {
            if ($.ft._folderHT != undefined && !($.ft._folderHT.isEmpty())) return $.ft._folderHT;
        },
        getExpandedFolders: function() {
            return $.ft._expandedFolders;
        },
        getSelectedFolders: function() {
            return $.ft._selectedFolders;
        },
        findFolder: function(searchTerm) {
            return $.ft.findFolder(searchTerm);
        },
        preSelectFolder: function(folderId, scrollEnabled, selectEnabled) {
            return $.ft.expandAndSelectFolder(folderId, scrollEnabled, selectEnabled);
        },
        storePermission: function(folderId, permissionObj) {
            return $.ft.storePermission(folderId, permissionObj);
        },
        duplicateFolder: function(curParentFolderId, curFolderName) {
            return $.ft.duplicateFolder(curParentFolderId, curFolderName);
        },
        showURFolder: function(fId, fObj, invCB, selFlag) {
            return $.ft.showURFolder(fId, fObj, invCB, selFlag);
        }
    };
}(jQuery);
