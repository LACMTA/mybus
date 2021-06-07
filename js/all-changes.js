const QUERYSTRING = window.location.search;
const URLPARAMS = new URLSearchParams(QUERYSTRING);
const LANG = URLPARAMS.get('lang');
const DATA_PATH = 'data/takeones/';

if (LANG == null || LANG == 'undefined' || LANG == '' || LANG == 'en') {
    $.getJSON(DATA_PATH + 'takeone-en.json', loadContent);

} else {
    $.getJSON(DATA_PATH + 'takeone-' + LANG + '.json', loadContent);
}

const SCHEDULE_LINK_TRANLSATED = {
    'en': 'Download new schedule for Line ' ,
    'es': '',
    'zh-TW': '',
    'ko': '',
    'vi': '',
    'ja': '',
    'ru': '',
    'hy': ''
};

const TRANSLATED_FILES = [['English', 'files/NextGen_Changes_English.pdf'],
    ['Español (Spanish)', 'files/NextGen_Changes_Spanish.pdf'],
    ['中文 (Chinese Traditional)', 'files/NextGen_Changes_Chinese.pdf'],
    ['한국어 (Korean)', 'files/NextGen_Changes_Korean.pdf'],
    ['Tiếng Việt (Vietnamese)', 'files/NextGen_Changes_Vietnamese.pdf'],
    ['日本語 (Japanese)', 'files/NextGen_Changes_Japanese.pdf'],
    ['русский (Russian)', 'files/NextGen_Changes_Russian.pdf'],
    ['Армянский (Armenian)', 'files/NextGen_Changes_Armenian.pdf']];

function loadContent(data) {
    $.each(data, 
        function(key, val) {
            let elem = '';
            let newElem = '';

            switch(val.section) {
                case 'header':
                    elem = document.querySelector('#all-header .row');
                    if (val.order == 1) {
                        newElem = document.createElement('h1');
                        newElem.classList.add('my-5');
                        newElem.classList.add('notranslate');
                        newElem.textContent = val.content;
                        elem.appendChild(newElem);
                    }
                    break;
                case 'summary':
                    elem = document.querySelector('#all-summary .row');
                    if (val.order == 1) {
                        elem.appendChild(contentHelper(val.content, 'label'));
                        
                        let linkElem = document.createElement('div');
                        linkElem.classList.add('mt-4');
                        linkElem.classList.add('px-5');
                        linkElem.appendChild(document.createTextNode('Download a PDF version of this page in '));
                        
                        for (let i=0; i<TRANSLATED_FILES.length; i++) {
                            let downloadLink = document.createElement('a');
                            downloadLink.textContent = TRANSLATED_FILES[i][0];
                            downloadLink.href = TRANSLATED_FILES[i][1];
                            linkElem.appendChild(downloadLink);

                            if (i != TRANSLATED_FILES.length - 1) {
                                linkElem.appendChild(document.createTextNode(', '));
                            } else {
                                linkElem.appendChild(document.createTextNode('.'));
                            }
                        }

                        elem.appendChild(linkElem);
                    } else if (val.order % 2 == 0) {
                        elem.appendChild(contentHelper(val.content, 'label'));
                    } else {
                        elem.appendChild(contentHelper(val.content, 'lines'));
                    }
                    break;
                case 'details':
                    elem = document.querySelector('#all-details .row');
                    if (val.order == 1) {
                        newElem = document.createElement('h2');
                        newElem.classList.add('my-4');
                        newElem.classList.add('notranslate');
                        newElem.textContent = val.content;
                        elem.prepend(newElem);
                    } else {
                        newElem = document.createElement('div');
                        newElem.classList.add('py-4');
                        newElem.classList.add('notranslate');
                        newElem.textContent = val.content + ' ';
                        
                        // Link to schedule if it exists.
                        // check for existence of schedule for line number in val.line
                        if (val['schedule-url'] != '') {
                            let scheduleLink = document.createElement('a');
                            scheduleLink.classList.add('scheduleLink');
                            scheduleLink.classList.add('translate');
                            scheduleLink.href = val['schedule-url'];
                            scheduleLink.textContent = 'Download new schedule for Line ' + val.line + '.';
                            newElem.appendChild(scheduleLink);
                        } else {
                            // Show message for lines where schedule is not available yet?
                            //newElem.textContent = newElem.textContent + 'Thanks for your patience as we work to add the new schedule. Check back soon.';
                        }

                        elem.appendChild(newElem);
                    }
                    break;
                case 'end':
                    elem = document.querySelector('#all-end .row');
                    elem.insertBefore(contentHelper(val.content, 'label'), elem.firstChild);
                    break;
                default:
            }
        }
    );
}

function contentHelper(content, type) {
    let elem = document.createElement('div');
    elem.classList.add('mt-4');
    elem.classList.add('notranslate');
    elem.textContent= content;

    switch(type) {
        case 'label':
            elem.classList.add('fw-bold');
            break;
        case 'lines':
            elem.classList.add('px-5');
            break;
    }

    return elem;
}
