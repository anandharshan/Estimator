if (typeof(FSR) == "undefined")  
			{
				FSR = {};
				
			}

FSR.surveydefs = [{
    name: 'browse2',
    invite: {
        when: 'onentry'
    },
    pop: {
        when: 'later'
    },
    criteria: {
        sp: [0, 100],
        lf: 1,
        locales: [{
            locale: 'jp',
            sp: [0, 100],
            lf: 1
        }, {
            locale: 'fr',
            sp: [0, 100],
            lf: 1
        }, {
            locale: 'de',
            sp: [0, 100],
            lf: 1
        }, {
            locale: 'cn',
            sp: [0, 100],
            lf: 1
        }]
    },
    
    include: {
        urls: ['/group/vmware']
    }
}];
FSR.properties = {
    repeatdays: 90,
    
    repeatoverride: false,
    
    altcookie: {},
    
    language: {
        locale: 'en',
        src: 'location',
        locales: [{
            match: '/jp/',
            locale: 'jp'
        }, {
            match: '/fr/',
            locale: 'fr'
        }, {
            match: '/de/',
            locale: 'de'
        }, {
            match: '/cn/',
            locale: 'cn'
        }]
    },
    
    exclude: {},
    
    zIndexPopup: 10000,
    
    ignoreWindowTopCheck: false,
    
    ipexclude: 'fsr$ip',
    
    mobileHeartbeat: {
        delay: 60, /*mobile on exit heartbeat delay seconds*/
        max: 3600 /*mobile on exit heartbeat max run time seconds*/
    },
    
    invite: {
    
        // For no site logo, comment this line:
        siteLogo: "sitelogo.gif",
        
        //alt text fore site logo img
        siteLogoAlt: "",
        
        /* Desktop */
        dialogs: [[{
            reverseButtons: false,
            headline: "We'd welcome your feedback!",
            blurb: "Thank you for visiting our website. You have been selected to participate in a brief customer satisfaction survey to let us know how we can improve your experience.",
            noticeAboutSurvey: "The survey is designed to measure your entire experience, please look for it at the <u>conclusion</u> of your visit.",
            attribution: "This survey is conducted by an independent company ForeSee, on behalf of the site you are visiting.",
            closeInviteButtonText: "Click to close.",
            declineButton: "No, thanks",
            acceptButton: "Yes, I'll give feedback",
            error: "Error",
            warnLaunch: "this will launch a new window",
            locales: {
                "jp": {
                    headline: "ご意見、ご要望をお寄せください",
                    blurb: "My VMware をご利用いただき、誠にありがとうございます。 ご利用いただいたお客様に、アンケート調査へのご協力をお願いしております。",
                    noticeAboutSurvey: "本アンケート調査では、お客様の操作環境全体についてご回答いただきます。My VMware を<u>ご利用になった後</u> でアンケートへのご協力をお願いいたします。",
                    attribution: "本調査は VMware に代わって、独立系調査会社の ForeSee 社が実施いたします。",
                    closeInviteButtonText: "クリックして閉じてください。",
                    declineButton: "アンケートに回答しない",
                    acceptButton: "アンケートに回答する"
                },
                "fr": {
                    headline: "Vos commentaires sont les bienvenus",
                    blurb: "Merci de votre visite sur notre site Web. Vous avez été sélectionné pour participer à une brève enquête de satisfaction destinée à nous fournir des indications pour améliorer votre expérience en ligne。",
                    noticeAboutSurvey: "Cette enquête est conçue pour mesurer votre degré de satisfaction par rapport à tous les aspects de votre expérience en ligne, comme vous pourrez vous en rendre compte lors de la <u>conclusion</u> de votre visite。",
                    attribution: "Cette enquête est menée par une société indépendante - ForeSee - pour le compte du site Web que vous visitez actuellement。",
                    closeInviteButtonText: "Cliquez pour fermer。",
                    declineButton: "Non merci",
                    acceptButton: "Oui, j’ai des commentaires à faire"
                },
                "de": {
                    headline: "Wir freuen uns auf Ihr Feedback",
                    blurb: "Vielen Dank für den Besuch unserer Website. Sie wurden dazu ausgewählt, an einer kurzen Umfrage zur Kundenzufriedenheit teilzunehmen. So können Sie uns mitteilen, wie wir unsere Website verbessern können。",
                    noticeAboutSurvey: "Im Rahmen der Umfrage soll Ihre gesamte Erfahrung mit dieser Website bewertet werden. Bitte sehen Sie sich die Umfrage am <u>Ende</u> Ihres Besuchs an。",
                    attribution: "Die Umfrage wird von ForeSee, einem unabhängigen Unternehmen, im Auftrag der Website, die Sie gerade besuchen, durchgeführt。",
                    closeInviteButtonText: "Klicken Sie hier zum Schließen der Umfrage。",
                    declineButton: "Nein danke",
                    acceptButton: "Ja, ich möchte teilnehmen"
                },
                "cn": {
                    headline: "欢迎提出反馈意见！",
                    blurb: "感谢您访问我们的网站。 您已被选中来参加一项简短的客户满意度调查，让我们了解我们应如何改善您的体验。",
                    noticeAboutSurvey: "本调查旨在衡量您的整体体验，您可在本次访问<u>结束</u>时查看统计结果。",
                    attribution: "本次调查由独立公司 ForeSee 代表您正在访问的网站执行。",
                    closeInviteButtonText: "单击以关闭。",
                    declineButton: "不，谢谢",
                    acceptButton: "是，我将提供反馈"
                }
            }
        
        }]],
        
        exclude: {
            urls: ['/login', '/web'],
            referrers: [],
            userAgents: [],
            browsers: [],
            cookies: [],
            variables: []
        },
        include: {
            local: ['.']
        },
        
        delay: 0,
        timeout: 0,
        
        hideOnClick: false,
        
        hideCloseButton: false,
        
        css: 'foresee-dhtml.css',
        
        hide: [],
        
        hideFlash: false,
        
        type: 'dhtml',
        /* desktop */
        // url: 'invite.html'
        /* mobile */
        url: 'invite-mobile.html',
        back: 'url'
    
        //SurveyMutex: 'SurveyMutex'
    },
    
    tracker: {
        width: '690',
        height: '415',
        timeout: 3,
        adjust: true,
        alert: {
            enabled: true,
            message: 'The survey is now available.',
            locales: [{
                locale: 'jp',
                message: 'アンケート調査を開始していただけます。'
            }, {
                locale: 'fr',
                message: 'L’enquête est maintenant disponible。'
            }, {
                locale: 'de',
                message: 'Die Umfrage ist jetzt verfügbar。'
            }, {
                locale: 'cn',
                message: '调查现已推出。'
            }]
        },
        url: 'tracker.html',
        locales: [{
            locale: 'jp',
            url: 'tracker_jp.html'
        }, {
            locale: 'fr',
            url: 'tracker_fr.html'
        }, {
            locale: 'de',
            url: 'tracker_de.html'
        }, {
            locale: 'cn',
            url: 'tracker_cn.html'
        }]
    },
    
    survey: {
        width: 690,
        height: 600
    },
    
    qualifier: {
        footer: '<div id=\"fsrcontainer\"><div style=\"float:left;width:80%;font-size:8pt;text-align:left;line-height:12px;\">This survey is conducted by an independent company ForeSee,<br>on behalf of the site you are visiting.</div><div style=\"float:right;font-size:8pt;\"><a target="_blank" title="Validate TRUSTe privacy certification" href="//privacy-policy.truste.com/click-with-confidence/ctv/en/www.foreseeresults.com/seal_m"><img border=\"0\" src=\"{%baseHref%}truste.png\" alt=\"Validate TRUSTe Privacy Certification\"></a></div></div>',
        width: '690',
        height: '500',
        bgcolor: '#333',
        opacity: 0.7,
        x: 'center',
        y: 'center',
        delay: 0,
        buttons: {
            accept: 'Continue'
        },
        hideOnClick: false,
        css: 'foresee-dhtml.css',
        url: 'qualifying.html'
    },
    
    cancel: {
        url: 'cancel.html',
        width: '690',
        height: '400'
    },
    
    pop: {
        what: 'survey',
        after: 'leaving-site',
        pu: false,
        tracker: true
    },
    
    meta: {
        referrer: true,
        terms: true,
        ref_url: true,
        url: true,
        url_params: false,
        user_agent: false,
        entry: false,
        entry_params: false
    },
    
    events: {
        enabled: true,
        id: true,
        codes: {
            purchase: 800,
            items: 801,
            dollars: 802,
            followup: 803,
            information: 804,
            content: 805
        },
        pd: 7,
        custom: {}
    },
    
    previous: false,
    
    analytics: {
        google_local: false,
        google_remote: false
    },
    
    cpps: {},
    
    mode: 'first-party'
};
