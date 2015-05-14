if (typeof myvmware == "undefined") myvmware = {};
if (typeof myvmware.temp == "undefined") myvmware.temp = {};
myvmware.temp.reports = {};
myvmware.temp.reports.th = {};  
myvmware.reports =  {
	srtbl:null,
	activeEaTr:null,
	seperator:null,
	aRepTr:null,
	filters:{},
	selectRep:null,
	dateMust:false,
	showProcess:null,
	cmnErr:null,
	dateCheck:false,
	isCancel:false,
    init: function() {
		myvmware.temp.reports.th = myvmware.reports;
		myvmware.temp.reports.th.srtbl = $('#savedReportsTbl');
		myvmware.temp.reports.th.selectRep = $('#selectReport');
		myvmware.temp.reports.th.cmnErr = $('#cmnErroMsg');
		myvmware.temp.reports.th.showProcess='<div class="fLeft mProcess"><div class="loading_small">'+reports.globalVar.loadingLabel+'</div></div>';
		myvmware.temp.reports.th.seperator = '-';
		myvmware.temp.reports.th.getReports();
		myvmware.temp.reports.th.buildCmnEvents();
		myvmware.temp.reports.th.regex =  /^[a-zA-Z0-9\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF!@%&_=\.\+\-\(\)\/\^\#\$\s]*$/;    /*!@#$%^&()-=+. {space}  are allowed*/
		 myvmware.temp.reports.th.parseDate = function(dateArg) {// need this method, since new Date() is not working on IE
			var dateValues = dateArg.split('-');
			var date = new Date(dateValues[0],parseInt(dateValues[1])-1,dateValues[2]);
			return date ;//.format("yyyy-mm-dd");
		};
		myvmware.temp.reports.th.prevNote=null;
		myvmware.temp.reports.th.processBeak();
	},//end of init
	buildCmnEvents:function(){//binding all commont events
		myvmware.temp.reports.th.toggleButton($('#confirmRenameBtn,#confirmNoteBtn,#refreshTbl'),false);
		$("textarea#notes, textarea#noteInput, input#newName").unbind('keypress keydown').bind('keypress keydown',function(e){
			var val = $(this).val();
			var limit = $(this).attr('maxlength');
			var key = e.keyCode || e.charCode;
			if ((key != 8 && key != 46 ) &&  val.length > limit ){
				e.preventDefault();
			}
		});
		$('#cancelRepBtn').click(function(){
			$('div.eaInputWrapper input.optionsHolder').val(reports.globalVar.availableReports);
			myvmware.temp.reports.th.changeReport();
		});
		$('input.selectRow',$('#eaListTbl')).live('click',function(e){
			$(this).closest('li').trigger('click');
			$(this).closest('li').find('a.filterLink').text(reports.globalVar.filter);
			e.stopPropagation();
		});
		$('input.selFolder,label',$('#eaListTbl')).live('click',function(e){
			var fLink = $(this).closest('li').find('a.filterLink');
			if($(this).is(':checked')){
				fLink.text(reports.globalVar.filter);
				$(this).closest('li').data('filt',false);
				myvmware.temp.reports.th.filters[$(this).closest('li').data('ea')]=[];
			}else{
				$(this).closest('li').find('a.filterLink').trigger('click');
				if(!$(this).closest('li').data('filt')) fLink.text(reports.globalVar.filter);
			}
			e.stopPropagation();
		});
		$('a.filterLink',$('#eaListTbl')).live('click',function(e){
			myvmware.temp.reports.th.activeEaTr = $(this).closest('li');
			e.stopPropagation();
			vmf.modal.show('accountFolders');
			myvmware.temp.reports.th.getFolders(myvmware.temp.reports.th.activeEaTr);
			return false;
		});
		//apply filter after selecting folders
		$('#applyFilterBtn').click(function(){
			myvmware.temp.reports.th.activeEaTr.data('filt',true);
			var fList = [], chks = $('#mainList input:checked');
			$.each(chks,function(c,v){
				fList.push($(v).attr('id'));
			})
			myvmware.temp.reports.th.filters[myvmware.temp.reports.th.activeEaTr.data('ea')] = fList;
			vmf.modal.hide('accountFolders');
			$('a.filterLink',myvmware.temp.reports.th.activeEaTr).text(reports.globalVar.edit).closest('li').find('input.selFolder').attr('checked',false);
		});
		$('#checkAllAc').click(function(){
			if($(this).is(':checked')) myvmware.temp.reports.th.filters={};
			if ($(this).is(':checked'))
				$('#eaListTbl .selCol input:checkbox').attr('checked',true).closest('li').not('.active').trigger('click');
			else	
				$('#eaListTbl .selCol input:checkbox').attr('checked',false).closest('li').trigger('click');
		})
		$('#accountFolders li input').live('click',function(){
			var chks = $('#accountFolders li').find('input:checked');
			(chks.length)?$('#applyFilterBtn').attr('disabled',false).removeClass('disabled'):$('#applyFilterBtn').attr('disabled',true).addClass('disabled');
		});
		myvmware.temp.reports.th.srtbl.find('.reportLink').live('click',function(){
			myvmware.temp.reports.th.aRepTr = $(this).closest('tr');
			vmf.modal.show('reportSummary');
			var sObj = $('#summaryTbl'), times = $('#timeFrame');
			$('#repName').text($(this).text());
			sObj.before('<div class="process"><div class="loading_small">'+reports.globalVar.loadingLabel+'</div></div>')
			vmf.ajax.post(reports.globalVar.reportSummaryUrl,{'reportId':myvmware.temp.reports.th.aRepTr.data('rId')},function(jData){
				if(jData != null){
					var data = vmf.json.txtToObj(jData);
					var sEa = data.summaryEA,
					    sDt = data.dates[0],
					    oList = [];
					$.each(sEa,function(c,v){
						oList.push('<tr><td>' + v.eaId + ' - ' + v.eaName + '</td><td>' + ((v.folderCount == 'all')?reports.globalVar.allFolders:v.folderCount)  + '</td></tr>')
					});
					sObj.prev('.process').remove();
					sObj.find('tbody').empty().append(oList.join(''));
					if(sDt.startDate.length || sDt.endDate.length) {
						times.show().find('#fDt').text((sDt.startDate.length)?sDt.startDate:' - ').end().find('#tDt').text((sDt.endDate.length)?sDt.endDate:' - ');
					}
					if($.trim(myvmware.temp.reports.th.aRepTr.data('dLink')).length){
						$('#summaryDwnLink').show().unbind('click').bind('click',function(){
							myvmware.temp.reports.th.downloadRep(myvmware.temp.reports.th.aRepTr);
							return false;
						});
					}
					else $('#summaryDwnLink').hide();
				}
			},myvmware.temp.reports.th.genericError);
			return false;
		});
		myvmware.temp.reports.th.srtbl.find('.downloadLink').live('click',function(){
			myvmware.temp.reports.th.aRepTr = $(this).closest('tr');
			myvmware.temp.reports.th.downloadRep(myvmware.temp.reports.th.aRepTr);
			return false;
		});
		myvmware.temp.reports.th.srtbl.find('button.cancelRep').live('click',function(){
			myvmware.temp.reports.th.aRepTr = $(this).closest('tr');
			myvmware.temp.reports.th.deleteRep(myvmware.temp.reports.th.aRepTr,true);
		});
		$('#refreshTbl').click(function(){
			myvmware.temp.reports.th.toggleButton($('#refreshTbl'),false);
			myvmware.temp.reports.th.getSavedReports();
		});
		//submiting create report form
		$('#createRepBtn').click(function(){
			var eas = $('#eaListTbl').find('li.active'), eaErr = $('#eaListTbl').parent().next('.errorMsg');
			(!eas.length)?eaErr.show():eaErr.hide();
			if(myvmware.temp.reports.th.validateReportForm()){
				$('#dateSection').find('.errorMsg').hide();
				eaErr.hide();
				myvmware.temp.reports.th.createReport();
			}
		});
		$('#okSuccessBtn').click(function(){
			vmf.modal.hide();
			myvmware.temp.reports.th._dt.fnSort([[5, 'desc']]);
			var nRow = myvmware.temp.reports.th.srtbl.find('tr:first-child');
			myvmware.temp.reports.th.showGreenBg(nRow);
		});
		$('#confirmDeleteBtn').click(function(){
			myvmware.temp.reports.th.toggleButton($(this),false);
			$(this).parent().before(myvmware.temp.reports.th.showProcess);
			vmf.ajax.post(reports.globalVar.deleteReportUrl,{'reportId':myvmware.temp.reports.th.aRepTr.data('rId'),'isCancelReport':myvmware.temp.reports.th.isCancel},function(jData){
				vmf.modal.hide();
				if(jData != null){
					var data = vmf.json.txtToObj(jData);
					$(this).parent().prev('.mProcess').remove();
					if(data.STATUS=='success'){
						//myvmware.temp.reports.th.getSavedReports();
						myvmware.temp.reports.th._dt.fnDeleteRow(myvmware.temp.reports.th._dt.fnGetPosition(myvmware.temp.reports.th.aRepTr[0]));
						myvmware.temp.reports.th.cmnErr.hide();
					} else {
						myvmware.temp.reports.th.genericError(data);
					}
				}
			},myvmware.temp.reports.th.genericError);
		});
		$('#confirmNoteBtn').click(function(){
			var noteInput = $('#noteInput').val();
			myvmware.temp.reports.th.toggleButton($(this),false);
			$(this).parent().before(myvmware.temp.reports.th.showProcess);
			vmf.ajax.post(reports.globalVar.editAddNotesUrl,{'reportId':myvmware.temp.reports.th.aRepTr.data('rId'),'notes':noteInput},function(jData){
				vmf.modal.hide();
				if(jData != null){
					var data = vmf.json.txtToObj(jData);
					$(this).parent().prev('.mProcess').remove();
					if(data.STATUS == 'success'){
						myvmware.temp.reports.th.aRepTr.data('rNote',noteInput);
						myvmware.temp.reports.th._dt.fnGetData(myvmware.temp.reports.th.aRepTr[0])[2]=noteInput;
						noteInput = vmf.wordwrap(noteInput,2);
						if(myvmware.temp.reports.th.aRepTr.find('.repNote').length) 
							myvmware.temp.reports.th.aRepTr.find('.repNote').html(noteInput);
						else 
							myvmware.temp.reports.th.aRepTr.find('.reportLink').after('<br><span class="repNote">'+noteInput+'</span>');
						myvmware.temp.reports.th.cmnErr.hide();
						myvmware.temp.reports.th.aRepTr.data('new',false).find('.new').remove();
						myvmware.temp.reports.th.showDots(myvmware.temp.reports.th.aRepTr);
					} else {
						myvmware.temp.reports.th.genericError(data);
					}
				}
			},myvmware.temp.reports.th.genericError);
		});
		$('#confirmRenameBtn').click(function(){
			var newName = $('#newName').val();
			myvmware.temp.reports.th.toggleButton($(this),false);
			$(this).parent().before(myvmware.temp.reports.th.showProcess);
			vmf.ajax.post(reports.globalVar.renameReportUrl,{'reportId':myvmware.temp.reports.th.aRepTr.data('rId'),'reportName':newName},function(jData){
				vmf.modal.hide();
				if(jData != null){
					var data = vmf.json.txtToObj(jData);
					$(this).parent().prev('.mProcess').remove();
					if(data.STATUS == 'success'){
						myvmware.temp.reports.th._dt.fnGetData(myvmware.temp.reports.th.aRepTr[0])[1]=myvmware.temp.reports.th.aRepTr.data('rNote');
						newName = vmf.wordwrap(newName,2);
						myvmware.temp.reports.th.aRepTr.find('.reportLink').html(newName);
						myvmware.temp.reports.th.cmnErr.hide();
						myvmware.temp.reports.th.aRepTr.data('new',false).find('.new').remove();
					} else {
						myvmware.temp.reports.th.genericError(data);
					}
				}
			},myvmware.temp.reports.th.genericError);
		});
		//common event to hide modals.
		$('.fn_cancel',$('#simplemodal-container')).live('click',function(){
			vmf.modal.hide();
		});
		$('textarea.addNote').focusout(function (event) {
			var val = $.trim($(this).val());
			if(val.length > 0 && !myvmware.temp.reports.th.regex.test(val)) {
				$(this).next('.errorMsg').show();
			}else{
				$(this).next('.errorMsg').hide();
				$(this).removeAttr('style');
			}
			myvmware.temp.reports.th.validateReportForm();
		});
		$('input.reportName').focusout(function (event) {
			var val = $.trim($(this).val());
			var selText = $('#selectReport option:selected').text();
			if(!myvmware.temp.reports.th.regex.test(val)) {
				$(this).next('.errorMsg').show();
			}else{
				$(this).next('.errorMsg').hide();
				$(this).removeAttr('style');
			}
			myvmware.temp.reports.th.validateReportForm();
		});
		$('.repModalInput, textarea#noteInput, #reportNameInput'). click(function(){
			$(this).removeAttr('style');
		});
		$('.repModalInput').keyup(function(event){ // Input box on rename modalpopup
			var val = $.trim($(this).val())
			var repName = myvmware.temp.reports.th.aRepTr.find('.reportLink').text();
			if(repName != val && val.length >0){
				$(this).removeAttr('style');
				myvmware.temp.reports.th.toggleButton($(this).closest('.modalContent').find('button').not('.fn_cancel'),true);
				if((myvmware.temp.reports.th.regex.test(val)==true)  &&  (val.length >0)) {
					$(this).removeAttr('style').next('.errorMsg').hide();
			}else {
				$(this).next('.errorMsg').show();
				myvmware.temp.reports.th.toggleButton($(this).closest('.modalContent').find('button').not('.fn_cancel'),false);
			}
			}
			else{
				myvmware.temp.reports.th.toggleButton($(this).closest('.modalContent').find('button').not('.fn_cancel'),false);
				//$(this).css('color','#c0c0c0').next('.errorMsg').hide();
			}
		});
		$('textarea#noteInput').keyup(function(event){ // textarea box on add/edit modalpopup
			var  limit = $(this).attr('maxlength');
			var val = $.trim($(this).val())
			var btn = $(this).closest('.modalContent').find('button').not('.fn_cancel');
			if(val.length>limit){
				var sVal = val.substring(0,limit)
				$(this).val(sVal);
			};
			var notes = myvmware.temp.reports.th.aRepTr.find('.repNote').text();
			if(notes != val && val.length >0){
				$(this).removeAttr('style');
				myvmware.temp.reports.th.toggleButton($(this).closest('.modalContent').find('button').not('.fn_cancel'),true);
				/*if((myvmware.temp.reports.th.regex.test(val)==true)  &&  (val.length >0)) {
					$(this).removeAttr('style').next('.errorMsg').hide();
				}else {
					$(this).next('.errorMsg').show();
					myvmware.temp.reports.th.toggleButton(btn,false);
				}*/
			}
			else{
				myvmware.temp.reports.th.toggleButton(btn,false);
				$(this).next('.errorMsg').hide();
			}
		}).focusout(function(){
			var val = $.trim($(this).val());
			var flag = (val.length && val != myvmware.temp.reports.th.aRepTr.find('.repNote').text());
			myvmware.temp.reports.th.toggleButton($(this).closest('.modalContent').find('button').not('.fn_cancel'),flag);
		});
		$('#eaListTbl').find(">li:not('.dynamicRow, .disabled')").die('click').live('click',function(e){// EA accounts li click
			var eaErr = $('#eaListTbl').parent().next('.errorMsg');
			myvmware.temp.reports.th.filters[$(this).data('ea')] = [];
			if($(this).hasClass('active')) {
				
				if(myvmware.temp.reports.th.selectRep.val() != 'RT02' && 
				   myvmware.temp.reports.th.selectRep.val() != 'RT05' &&
				   myvmware.temp.reports.th.selectRep.val() != 'RT09') {
				
					$(this).removeClass('active').find('input').attr('checked',false).end().closest('li').find('.folderSelector').addClass('hidden').find('.filterLink').text(reports.globalVar.filter).end().data('filt',false);
					if(!$('#eaListTbl li.active').length) $('#reportFoldersText').addClass('hidden');
				}else $(this).removeClass('active').find('input').attr('checked',false);
			}
			else {
				
				if(myvmware.temp.reports.th.selectRep.val() != 'RT02' && 
				   myvmware.temp.reports.th.selectRep.val() != 'RT05' &&
				   myvmware.temp.reports.th.selectRep.val() != 'RT09'){

					$('#reportFoldersText').removeClass('hidden');
					$(this).addClass('active').find('input').attr('checked',true).end().closest('li').find('.folderSelector').removeClass('hidden').find('.filterLink').text(reports.globalVar.filter);
				}
				else $(this).addClass('active').find('input').attr('checked',true);
			}
			(!$('#eaListTbl').find('li.active').length)?eaErr.show():eaErr.hide();
			myvmware.temp.reports.th.validateReportForm();
		});
		$('#eaListTbl').find(">li:not('.dynamicRow, .disabled')").die('mouseover mouseout').live('mouseover mouseout',function(e){//EA accounts li mouseover/out
			if($(this).is(".dynamicRow, .disabled, .inactive")) return;
			if(e.type=="mouseover"){$(this).addClass("hover");} 
			else if (e.type=="mouseout"){$(this).removeClass("hover");} 
		});
		$('span.dots').live('click',function(){// Expand Notes onclick of dots...
			myvmware.temp.reports.th.showHideNotes($(this));
		});
		$('span.repNote').live('click',function(){// Expand Notes onclick of dots...
			if($(this).hasClass('open')){
				$(this).addClass('close').removeClass('open').next('.dots').css('display','inline');
				myvmware.temp.reports.th.prevNote=null;
			}else if($(this).hasClass('close')){
				$(this).addClass('open').removeClass('close').next('.dots').css('display','none');
				myvmware.temp.reports.th.prevNote=$(this);
			}
		});
	},//End of bind events
	processBeak:function(){
		setTimeout(function(){
			myvmware.common.showMessageComponent('REPORTS');
			myvmware.common.setBeakPosition({
				beakId:myvmware.common.beaksObj["Q1_BEAK_REPORTS_FOR_REPORTS_PAGE_LOV"],
				beakName:'Q1_BEAK_REPORTS_FOR_REPORTS_PAGE_LOV',
				beakHeading:reports.globalVar.beakHeader,
				beakContent:reports.globalVar.beakContent,
				target:$('.eaInputWrapper'),
				beakLink:'#row1'
			});
		}, 3000);
	},
	createReport:function(){
		var totalItems =  $('#eaListTbl li'), activeTrs = $('#eaListTbl li.active'), fldArr = [], allEas = false;
		$.each(activeTrs,function(c,v){
			if(!myvmware.temp.reports.th.filters[$(v).data('ea')].length && $(v).find('input.selFolder').is(':checked')) myvmware.temp.reports.th.filters[$(v).data('ea')] = ['all'];
			if($(v).find('input.selFolder').is(':checked'))fldArr.push(1);
		});
		allEas = (activeTrs.length == fldArr.length);
		var repName = ($('#reportNameInput').val()=='') ?reports.globalVar[ '' + $("#selectReport option:selected").val()]: $('#reportNameInput').val();
		var stDt = ($.trim($('#fromDt').val()).length && $('#fromDt').val() != 'YYYY-MM-DD')?$('#fromDt').val():'';
		var toDt = ($.trim($('#toDt').val()).length && $('#toDt').val() != 'YYYY-MM-DD')?$('#toDt').val():'';
		var paramList = {
			"selectReport":myvmware.temp.reports.th.selectRep.val(), 
			"ea_folder_list":vmf.json.objToTxt(myvmware.temp.reports.th.filters), 
			"fromDate":stDt, 
			"toDate":toDt, 
			"reportName": repName, 
			"notes":$('#notes').val(), 
			"emailNotice":$('#sendMailCheck').attr('checked'),
			"allEasAllFolders":allEas
		};
		vmf.loading.show({msg:reports.globalVar.loadingLabel, 'overlay':true});
		vmf.ajax.post(reports.globalVar.saveReportUrl,paramList,function(jData){
			vmf.loading.hide()
			if(jData != null){
				var data = vmf.json.txtToObj(jData);
				if(data.STATUS == 'success'){
					myvmware.temp.reports.th.filters = {};
					$('div.eaInputWrapper input.optionsHolder').val(reports.globalVar.availableReports);
					myvmware.temp.reports.th.changeReport();
					vmf.modal.show('successMsg');
					myvmware.temp.reports.th.cmnErr.hide();
					if(typeof riaLinkmy != "undefined") riaLinkmy('custom-reports : create-report : ' + myvmware.temp.reports.th.selectRep.find('option:selected').text());
				} else {
					myvmware.temp.reports.th.genericError(data);
				}
			}
		},myvmware.temp.reports.th.genericError);
	},
	showHideNotes:function($spanObj){// show hide note click on dots
		if(myvmware.temp.reports.th.prevNote!=null){	
			myvmware.temp.reports.th.prevNote.addClass('close').removeClass('open');
			myvmware.temp.reports.th.prevNote.next('.dots').css('display','inline');
		}
		$spanObj.hide().prev('.repNote').addClass('open').removeClass('close');
		myvmware.temp.reports.th.prevNote = $spanObj.prev('.repNote');
	},
	showDots:function(obj){
		$(obj).find('td .repNote').each(function(){
			var tLen = $(this).text().length;
			var sWd = $(this).width();
			var txtWd = tLen*5;
			if(txtWd > sWd){$(this).addClass('close').css('cursor','pointer').after('<span class="dots">...</span>')}
			else{ $(this).next('.dots').hide();}
			if(myvmware.temp.reports.th.prevNote!=null && myvmware.temp.reports.th.prevNote.attr('id') == $(this).attr('id') ){
				$(this).addClass('open').removeClass('close').next('.dots').hide();	
				//myvmware.temp.reports.th.prevNote = $(this);
			}
		});
	},
	manipForm: function(sel){
		myvmware.temp.reports.th.cmnErr.hide();
		$('#eaListTbl').empty();
		$('#createRep .errorMsg,#dateNote,#sampleLink').hide();
		$('#notes').val('');
		$('#eaListTbl').empty();
		$('#checkAllAc,#sendMailCheck').attr('checked',false);
		if(myvmware.temp.reports.th.selectRep.val() == 'RT02'){
			myvmware.temp.reports.th.dateMust = true; 
			$('#dateSection').show().find('.req').text(reports.globalVar.required).end().find('.star').show();
			$('#dateNote').show();
			myvmware.temp.reports.th.getCalendar($('#fromDt'),$('#toDt'),true);
			myvmware.temp.reports.th.handlePlaceholder();
		} else if(myvmware.temp.reports.th.selectRep.val() == 'RT03' || myvmware.temp.reports.th.selectRep.val() == 'RT07'){
			myvmware.temp.reports.th.dateMust = false; 
			$('#dateSection').show().find('.req').text('Optional').end().find('.star').hide();
			myvmware.temp.reports.th.getCalendar($('#fromDt'),$('#toDt'));
			myvmware.temp.reports.th.handlePlaceholder();
		} else { $('#dateSection').hide(); myvmware.temp.reports.th.dateMust = false; $('#fromDt').val(''); $('#toDt').val(''); }

		if(myvmware.temp.reports.th.selectRep.val() == 'RT09'){
			$('#createRep p.legalDisc').hide();
		} else {
			$('#createRep p.legalDisc').show();
		}

	},
	handlePlaceholder:function(){
		if ( $.browser.msie ) {
			myvmware.common.putplaceHolder($('#fromDt,#toDt'));
			if($('#fromDt,#toDt').val().length && $('#fromDt,#toDt').val() != 'YYYY-MM-DD') $('#fromDt,#toDt').trigger('change');
		}
	},
	getDiffDt:function(fromDt, toDt){
		var d = new Date();
		var prevYr =d.getFullYear()-1;
		var diff =  Math.abs(fromDt - toDt);
		var byDays = Math.floor(diff/86400000),
			calErr = $('#toDt').closest('.crSubContent').find('.errorMsg');
		if (byDays) {
		(myvmware.temp.reports.th.isLeap(prevYr))?compareDays = 366:compareDays = 365 ;					
			if(byDays <= compareDays)calErr.hide();else calErr.show();
	        return byDays;
	    }
	},
	
	isLeap:function(leapOrNot)
	{	 
	 var  isLeapYear;       
        isLeapYear = (leapOrNot % 4 == 0);        
        isLeapYear = isLeapYear && (leapOrNot % 100 != 0);        
        isLeapYear = isLeapYear || (leapOrNot % 400 == 0);
	 
	 return isLeapYear;
	},
	validateReportForm:function(){
		var fromDt =  myvmware.temp.reports.th.parseDate($('#fromDt').val()), 
			toDt = myvmware.temp.reports.th.parseDate($('#toDt').val()), 
			eas = $('#eaListTbl').find('li.active');
		if(myvmware.temp.reports.th.dateMust){
			//(myvmware.temp.reports.th.getDiffDt(fromDt, toDt) <= compareDays && eas.length && !$('.errorMsg:visible').length)?myvmware.temp.reports.th.toggleButton($('#createRepBtn'),true):myvmware.temp.reports.th.toggleButton($('#createRepBtn'),false);
			myvmware.temp.reports.th.dateCheck = (myvmware.temp.reports.th.getDiffDt(fromDt, toDt) <= compareDays && eas.length && !$('.errorMsg:visible').length);
		}
		else{
			myvmware.temp.reports.th.dateCheck = true;
			//eas.length?:$('#eaListTbl').parent().next('.errorMsg').show():$('#eaListTbl').parent().next('.errorMsg').hide();
			//(eas.length  && !$('.errorMsg:visible').length )?myvmware.temp.reports.th.toggleButton($('#createRepBtn'),true):myvmware.temp.reports.th.toggleButton($('#createRepBtn'),false);
		}	
		($('#eaListTbl li').length == eas.length )?$('#checkAllAc').attr('checked',true):$('#checkAllAc').attr('checked',false);
		return (myvmware.temp.reports.th.dateCheck && eas.length);
	},
	getReports: function(){
		vmf.ajax.post(reports.globalVar.reportsUrl,null,function(jData){
			if(jData != null){
				var data = vmf.json.txtToObj(jData), oList = [];
				var dt = data.reportsList.options;
				$.each(dt,function(c,v){oList.push('<option label="'+v.label+'" value="' + v.v + '">' + v.t + '</option>');})
				$('#selectReport').empty().append(oList.join('')).val('');
				$('#selectReport option:first-child').attr("selected", "selected");
				vmf.dropdown.build($('#selectReport'), {
					optionsDisplayNum:20,
					ellipsisSelectText:false,
					ellipsisText:'',
					optionMaxLength:150,
					position:"right",
					optionGroup:true,
					optionsId:"eaDropDownOpts",
					optionsClass:"dropdownOpts",
					shadowClass:"eaBoxShadow",
					allowEmptySelect:false, 
						"onSelect":myvmware.reports.changeReport,inputWrapperClass:"eaInputWrapper",spanpadding:true,spanClass:"corner-img-left"
				});
				$('div.eaInputWrapper input.optionsHolder').val(reports.globalVar.availableReports);
				$('#eaDropDownOpts').css('padding-bottom','15px');
				myvmware.temp.reports.th.changeReport();
			}
		},myvmware.temp.reports.th.genericError);
	},
	changeReport: function(){
		var cSel = $('div.eaInputWrapper input.optionsHolder');
		 var selText = reports.globalVar[ '' + $('#selectReport option:selected').val()];
		if($.trim(cSel.val()) != reports.globalVar.availableReports){
			$('#createRep').slideDown(500,function(){
				myvmware.temp.reports.th.getFields(myvmware.temp.reports.th.selectRep.val());
				myvmware.temp.reports.th.getEaList(myvmware.temp.reports.th.selectRep.val());
			});
			myvmware.temp.reports.th.manipForm(cSel);			
		}else{
			$('#createRep').slideUp();
			myvmware.temp.reports.th.getSavedReports();
		}
		$('#reportNameInput').val(selText).css('color','#c0c0c0');
		$('#repTitle').text(selText);	
		
		if (!$('#reportFoldersText').hasClass('hidden')) $('#reportFoldersText').addClass('hidden');
	},
	getCalendar:function(frDt,toDt,timeFrame){
        var d = new Date();
        var currentDate = d.getFullYear() + myvmware.temp.reports.th.seperator + myvmware.temp.reports.th.getTwoDigits(d.getMonth()+1) + myvmware.temp.reports.th.seperator + myvmware.temp.reports.th.getTwoDigits(d.getDate());
        var endDate = (d.getFullYear()-1) + myvmware.temp.reports.th.seperator + myvmware.temp.reports.th.getTwoDigits(d.getMonth()+1) + myvmware.temp.reports.th.seperator + myvmware.temp.reports.th.getTwoDigits(d.getDate()) ;
        if(timeFrame){
	        $(frDt).val(endDate);
	        $(toDt).val(currentDate);
        }else{
	        $(frDt).val('');
	        $(toDt).val('');
        }
        vmf.calendar.resetCalenders(vmf.dom.get(".datepicker"));
        vmf.calendar.build(vmf.dom.get(".datepicker"), {
            dateFormat: 'yyyy-mm-dd',
            startDate: '1980-01-01',
            endDate: '2020-02-31',
			startDate_id: frDt,
			endDate_id: toDt,
			error_msg_f: reports.globalVar.error_from,
			error_msg_t: reports.globalVar.error_to
        });
        // Bind event handler to the startDate calendar
        vmf.dom.addHandler(frDt, "dpClosed", function(e, selectedDate){
            var d = selectedDate[0];
            if(d){d = new Date(d); vmf.calendar.setStartDate(toDt, d.addDays(1).asString());}
            myvmware.temp.reports.th.validateReportForm();
        });
        // Bind event handler to the endDate calendar
        vmf.dom.addHandler(toDt, "dpClosed", function(e, selectedDate){
            var d = selectedDate[0];
            if(d){ d = new Date(d); vmf.calendar.setEndDate(frDt, d.addDays(-1).asString());}
            myvmware.temp.reports.th.validateReportForm();
        });
	},
	getTwoDigits:function(number){return (number<10)?'0'+number: number; },
	getSavedReports:function(){
		if(!(myvmware.temp.reports.th.srtbl.find('tbody tr').length)) {
            vmf.datatable.build(myvmware.temp.reports.th.srtbl,{
                "aoColumns": [
                    {"sTitle": "","bVisible":false},
                    {"sTitle": "<span class='descending'>" + reports.globalVar.reportName + "</span>","sClass":"","sWidth":"220px","bSortable":true},
                    {"sTitle": "<span class='descending'>" + reports.globalVar.downloadLbl + "</span>","sClass":"","sWidth":"75px","bSortable":true},
                    {"sTitle": "","bVisible":false},
                    {"sTitle": "","bVisible":false},
                    {"sTitle": "<span class='descending'>" + reports.globalVar.dateCreated + "</span>","sClass":"","sWidth":"90px","bSortable":true},
                    {"sTitle": "<span class='descending'>" + reports.globalVar.dateExpires + "</span>","sClass":"","sWidth":"90px","bSortable":true},
                    {"sTitle": reports.globalVar.actions,"sWidth":"95px","bSortable":false},
					{"sTitle": "","bVisible":false}
                ],
                "oLanguage": {
                    "sEmptyTable":'<div id="loadingerrormsg"><div id="innerMsg" class="error_innermsg"><p>'+reports.globalVar.noData+'</p></div></div>',
                    "sProcessing":reports.globalVar.loadingLabel,
                    "sLoadingRecords":"",
                    "sInfo": reports.globalVar.DtableSInfo,
                    "sInfoEmpty": reports.globalVar.recordsEmpty,
                    "sZeroRecords": reports.globalVar.DtablesZeroRecords,
		    "sLengthMenu": reports.globalVar.DtablesLengthMenu, 
		    "oPaginate": {
		    	"sPrevious": reports.globalVar.DtablesPrevious,
		    	"sNext": reports.globalVar.DtablesNext, 
		    	"sLast": reports.globalVar.DtablesLast, 
		    	"sFirst": reports.globalVar.DtablesFirst
			      }
                },
                "sAjaxSource":reports.globalVar.savedReportsUrl,
				"fnServerParams": function ( aoData ) {aoData.push( {} );},
                "bInfo":true,
				"iDisplayLength": 10,
				"bAutoWidth" : false,
                "bProcessing": true,
                "bServerSide": false,
                "bFilter":false,
                "bPaginate": false,
				"aaSorting": [[ 5, "desc" ]],
				"sDom": 'zrt<"bottom"lpi<"clear">>',
				"bPaginate": true,
				"sPaginationType": "full_numbers",
                "fnRowCallback": function(nRow,aData,iDisplayIndex){ 
                    var $nRow=$(nRow);
                    $nRow.data({'rId':aData[0],'rName':aData[1],'rNote':aData[2],'new':false, 'dLink':aData[6], 'per':aData[7], 'rType':aData[8]});
                   	var repName = vmf.wordwrap(aData[1],2);
					$nRow.find('td:eq(0)').html('<div class="repNameDet fLeft"><span class="reportTitle"><a href="#" class="reportLink">'+repName+'</a></span></div>');
					$nRow.find('td:eq(1)').html('<a href="'+ aData[6] +'" class="downloadLink" title="'+reports.globalVar.downloadLbl+'"></a>');
					$nRow.find('td:eq(2)').html(aData[4]);
					$nRow.find('td:eq(3)').html(aData[5]);
					if($.trim(aData[3]).length && aData[3] == "NEW" ){ // New report
						$nRow.find('td:eq(1)').append('<span class="badge new" title="New">' + reports.globalVar.badgeNew + '</span>');
						$nRow.data('new',true);
					}
					else if($.trim(aData[3]).length && aData[3] == "FAILED" ){ //in failed case
						$nRow.find('td:eq(1)').append('<span class="badge expired" title="Failed">' + reports.globalVar.badgeFailed + '</span>').find('.downloadLink').remove();
					}
					if(aData[2].length) {// Notes sections
						$nRow.find('td:eq(0)').find('.reportTitle').append('<br/><span id="notes'+iDisplayIndex+'"  class="repNote close">' +vmf.wordwrap( aData[2],2) + '</span>');
					}	
					$nRow.find('td:eq(4)').html('<span class="dd"></span>');
					if(aData[3] == "PROCESSING"){
						$nRow.find('td:eq(0)').html(vmf.wordwrap(aData[1],2));
						$nRow.find('td:eq(1)').html('');
						$nRow.find('td:eq(2)').html('<i>'+reports.globalVar.processingLabel+'</i>');
						$nRow.find('td:eq(3)').html('');
						$nRow.find('td:eq(4)').html('<button class="cancelRep secondary">' + reports.globalVar.cancel + '</button>');
					}					
                    return nRow;
                },
                "fnDrawCallback": function(){
					myvmware.temp.reports.th._dt = this;
                	if($('#fnActions').length) $('#fnActions').hide();
                	myvmware.temp.reports.th.setDropDownMenu();
					myvmware.temp.reports.th.showDots(myvmware.temp.reports.th._dt);
                },
				"fnInitComplete": function (aoData) {	
					myvmware.temp.reports.th._dt = this;
					myvmware.temp.reports.th.toggleButton($('#refreshTbl'),true);
				}
            });
        } else { // reloading the table
			vmf.datatable.reload(myvmware.temp.reports.th.srtbl, reports.globalVar.savedReportsUrl, myvmware.temp.reports.th.setDropDownMenu, null,myvmware.temp.reports.th.reloadError);
		}
	},
	showGreenBg:function(row){
		row.addClass('greenBg');
		setTimeout(function(){row.removeClass('greenBg')}, 10000);
	},
	setDropDownMenu:function(){
		var map = [
			{id: 'dwdrep',text: reports.globalVar.downloadLbl,liCls: 'inactive',callBk: myvmware.temp.reports.th.downloadRep}, 
			{id: 'renrep',text: reports.globalVar.renameLbl,liCls: 'inactive',callBk: myvmware.temp.reports.th.renameRep}, 
			{id: 'addrep',text: reports.globalVar.addEditNotesLbl,liCls: 'inactive',callBk: myvmware.temp.reports.th.addNotes},
			{id: 'delrep',text: reports.globalVar.deleteLbl,liCls: 'inactive',callBk: myvmware.temp.reports.th.deleteRep}
		];
		vmf.cmenu.show({
			data: map,
			targetElem: 'savedReportsTbl',
			contextMenuFlag: false,
			cClass:'repDropDown eaBoxShadow',
			actionBtnFlg: true,
			funcName: 'cursorPosition',
			cmenuId: 'fnActions',
			actionBtnClass:'dropDown',
			showBtn:true,
			getTargetDetails:function(target){
				myvmware.temp.reports.th.aRepTr = $(target).closest('tr');
				return $(target).closest('tr');
			},
			getTargetNode: function (targetElem) {
				return $('#' + targetElem).find('span.dd');
			},
			menuChgState: function (target, cmenuId, disableMnu) {
				var cmenu = $('#' + cmenuId), tr = $(target).closest('tr'), links = $(target).closest('tr').data('per');
				cmenu.find('a').addClass(disableMnu).parent('li').addClass('inactive');
				for (var i in links){
					if(links[i])cmenu.find('#'+i).removeClass(disableMnu).parent('li').removeClass('inactive');
				}
			}
		});
		$('#tcr').closest('li').addClass('btmBorder');
	},
	downloadRep:function(tr){
		myvmware.temp.reports.th.cmnErr.hide();
		if(tr.data('new')) {
			vmf.loading.show({msg:reports.globalVar.loadingLabel, 'overlay':true});
			tr.data('new',false).find('.new').remove();
			vmf.ajax.post(reports.globalVar.downloadReportUrl,{'reportId':myvmware.temp.reports.th.aRepTr.data('rId')},function(jData){
				if(jData != null){
					var data = vmf.json.txtToObj(jData);
					if(data.STATUS == 'success'){
						//myvmware.temp.reports.th.getSavedReports();
					}
				}
			},myvmware.temp.reports.th.genericError,null,null,null,false);
			vmf.loading.hide();
		}
		
		$("#downloadForm").attr("action", tr.data('dLink')).submit();
		if(typeof riaLinkmy != "undefined") riaLinkmy('custom-reports : download : ' + tr.data('rType'));
	},
	renameRep:function(tr){
		myvmware.temp.reports.th.aRepTr = tr;
		vmf.modal.show('renameReport');
		$('#newName').val(myvmware.temp.reports.th.aRepTr.find('.reportLink').text()).css('color','#c0c0c0');
	},
	addNotes:function(tr){
		myvmware.temp.reports.th.aRepTr = tr;
		vmf.modal.show('editAddNote');
		$('#noteInput').val(myvmware.temp.reports.th.aRepTr.data('rNote')).css('color','#c0c0c0');
		
	},
	deleteRep:function(tr,cancel){
		myvmware.temp.reports.th.aRepTr = tr;
		vmf.modal.show('deleteReport');
		if(cancel) {
			myvmware.temp.reports.th.isCancel = true;
			$('#deleteReport').find('.headerTitle').text(reports.globalVar.cancelReport).closest('.modalContent').find('.warning p').text(reports.globalVar.cancelReportMsg);
		} else {
			myvmware.temp.reports.th.isCancel = false;
		}
		
	},
	getFields:function(val){//getting fields detail
		$('#feildDetail').html('<li><div class="loading_small">' + reports.globalVar.loadingLabel + '</div></li>');
		vmf.ajax.post(reports.globalVar.fieldsListUrl,{'selectReport':val},function(jData){
			if(jData != null){
				var data = vmf.json.txtToObj(jData);
				var dt = data.fieldsList.fields, url = data.fieldsList.sampleSheetUrl, oList = [], ul = $('#feildDetail');
				$('#sampleLink').show().attr('href',url);
				$.each(dt,function(k,v){
					oList.push('<li>' + v + '</li>')
				});
				ul.empty().append(oList.join(''));
			}
		},myvmware.temp.reports.th.genericError);
	},
	getEaList:function(val){//getting EA list
		//$('#eaListTbl').html('<li colspan="3"><div class="loading_small">' + reports.globalVar.loadingLabel + '</div></li>');
		if(!$('#eaListTbl').prev('.process').length) $('#eaListTbl').before('<div class="process" style="padding-top: 50px; text-align: center;"><div class="loading_small" style="width: 120px;margin: 0 auto;">'+reports.globalVar.loadingLabel+'</div></div>');
		myvmware.temp.reports.th.toggleButton($('#createRepBtn'),false);
		vmf.ajax.post(reports.globalVar.eaListUrl,{'reportType':val},function(jData){
			if(jData != null){
				var data = vmf.json.txtToObj(jData), sObj = $('#eaListTbl');
				if(data.error != null && data.error != 'undefined'){
					sObj.prev('.process').remove();
					myvmware.temp.reports.th.genericError(data);
				} else {
					myvmware.temp.reports.th.toggleButton($('#createRepBtn'),true);
					var data = vmf.json.txtToObj(jData);
					var dt = data.eaList.options, oList = [], folderOpt = '<span class="folderSelector hidden"><input type="checkbox" class="selFolder" name="selFolder" /><label for="selFolder">'+reports.globalVar.allFolders+'</label><a href="#" class="filterLink">'+ reports.globalVar.filter +'</a></span>';
					$.each(dt,function(k,v){
						oList.push('<li><span class="selCol"><input class="selectRow" type="checkbox" name="' + v.eaName + '" id="' + v.ea + '" ></span><span class="eaCol">' +v.ea +' - ' + v.eaName + '</span><span class="filterCol fRight"><span class="folderSelector hidden"><input type="checkbox" class="selFolder" id="selFolder_' + k +'" /><label for="selFolder_' + k +'">'+reports.globalVar.allFolders+'</label><a href="#" class="filterLink">'+reports.globalVar.filter+'</a></span></span></li>')
					});
					sObj.prev('.process').remove();
					sObj.empty().append(oList.join(''));
					$.each(sObj.find('li'),function(c,v){
						$(v).data('ea',$(v).find('input.selectRow').attr('id'));
						$(v).data('eaName',$(v).find('input.selectRow').attr('name'));
						$(v).data('filt',false);
					});
					//myvmware.temp.reports.th.bindHoverEffects(sObj,'multi');
					if(oList.length == 1) sObj.find('li:eq(0)').trigger('click');
				}
			}
		},myvmware.temp.reports.th.genericError);
	},
	getFolders:function(tr){//getting all the folders list
		$('#foldersEAName').text(tr.data('ea') + ' - ' + tr.data('eaName'));
		var list = $('#mainList');
		list.hide().before('<div class="process" style="padding-top: 50px; text-align: center;"><div class="loading_small" style="width: 120px;margin: 0 auto;">' + reports.globalVar.loadingLabel + '</div></div>');
		vmf.ajax.post(reports.globalVar.folderListUrl,{"eaNumber":tr.data('ea')},function(jData){
			if(jData != null){
				var data = vmf.json.txtToObj(jData);
				if(data.error != null && data.error != 'undefined'){
					myvmware.temp.reports.th.genericError(data);
				} else {
					var oList = [];
					if (data.foldersList.level0 != null && data.foldersList.level0 != 'undefined'){
						var l0 = data.foldersList.level0[0];
						//list.empty().html('<input id="'+l0.fid+'" name="'+l0.fName+'" type="checkbox" /><label for="'+l0.fid+'">'+l0.fName+'</label><ul class="fldlist nopadding"></ul>');
						list.empty().html('<input id="'+l0.fid+'" name="'+l0.fName+'" type="checkbox" /><label for="'+l0.fid+'">'+l0.fName+'</label>');
					}
					if(data.foldersList.level1 != null && data.foldersList.level1 != 'undefined'){
						var l1 =  data.foldersList.level1;
						list.append('<ul class="fldlist nopadding"></ul>');
					}
					$.each(l1,function(k,v){
						if(v.sfCount.length) 
							oList.push('<li><span class="subFld greyBg tooltipSf" title="'+reports.globalVar.numberOfSubfolders+'">'+ v.sfCount +'</span><input id="'+ v.fid +'" type="checkbox" name="group1"><label for="'+ v.fid +'">' + v.fName + '</label></li>')
						else 
							oList.push('<li><span class="subFld"></span><input id="'+ v.fid +'" type="checkbox" name="group1"><label for="'+ v.fid +'">' + v.fName + '</label></li>')
					});
					list.prev('.process').remove();
					list.show().find('ul.fldlist').empty().append(oList.join(''));
					if(myvmware.temp.reports.th.filters[myvmware.temp.reports.th.activeEaTr.data('ea')] && myvmware.temp.reports.th.filters[myvmware.temp.reports.th.activeEaTr.data('ea')].length){
						$.each(myvmware.temp.reports.th.filters[myvmware.temp.reports.th.activeEaTr.data('ea')],function(c,e){
							list.find('input#'+e).attr('checked',true);
							if(myvmware.temp.reports.th.filters[myvmware.temp.reports.th.activeEaTr.data('ea')].length == list.find('input:checkbox').length) $('#homeChk').attr('checked',true);
						});
						$('#applyFilterBtn').attr('disabled',false).removeClass('disabled');
					}
					//$('#accountFolders a[rel="home_open"]').trigger('click');
					myvmware.hoverContent.bindEvents($('.tooltipSf'), 'funcleft');
				}
			}
		},myvmware.temp.reports.th.genericError);
	},
	toggleButton: function($this, flag){
		if (flag) $this.removeClass("disabled").removeAttr("disabled");
		else $this.addClass("disabled").attr("disabled",true);
	},
	genericError:function(error){//generic error message
		//vmf.modal.show('genericError');
		vmf.modal.hide();
		myvmware.temp.reports.th.cmnErr.show().html(error.error);
	}
};//End of fund details
