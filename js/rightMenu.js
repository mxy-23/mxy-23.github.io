var rm = {};
rm.showRightMenu = function (isTrue, x = 0, y = 0) {
    let $rightMenu = $('#rightMenu');
    $rightMenu.css('top', x + 'px').css('left', y + 'px');

    if (isTrue) {
        stopMaskScroll()
        $rightMenu.show();
    } else {
        $rightMenu.hide();
    }
};
let rmWidth = $('#rightMenu').width();
let rmHeight = $('#rightMenu').height();
rm.reloadrmSize = function () {
    rmWidth = $("#rightMenu").width();
    rmHeight = $("#rightMenu").height()
};
window.oncontextmenu = function (event) {
    if (document.body.clientWidth > 768) {
        let pageX = event.clientX + 10;	
        let pageY = event.clientY;
        let $rightMenuNormal = $(".rightMenuNormal");
        let $rightMenuOther = $(".rightMenuOther");
        let $rightMenuReadmode = $("#menu-readmode");
        $rightMenuNormal.show();
        $rightMenuOther.show();
        rm.reloadrmSize();
        if (pageX + rmWidth > window.innerWidth) {
            pageX -= rmWidth;
        }
        if (pageY + rmHeight > window.innerHeight) {
            pageY -= rmHeight;
        }
        rm.showRightMenu(true, pageY, pageX);
        $('#rightmenu-mask').attr('style', 'display: flex');
        return false;
    }
};
function removeRightMenu() {
    rm.showRightMenu(false);
    $('#rightmenu-mask').attr('style', 'display: none');
}
function stopMaskScroll() {
    if (document.getElementById("rightmenu-mask")) {
        let xscroll = document.getElementById("rightmenu-mask");
        xscroll.addEventListener("mousewheel", function (e) {
            removeRightMenu();
        }, false);
    };
    if (document.getElementById("rightMenu")) {
        let xscroll = document.getElementById("rightMenu");
        xscroll.addEventListener("mousewheel", function (e) {
            removeRightMenu();
        }, false);
    }
}
/**
 * @name:  切換模式
 */
function switchDarkMode() {
    removeRightMenu();
    const nowMode = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'
    if (nowMode === 'light') {
        activateDarkMode();
        saveToLocal.set('theme', 'dark', 2);
        GLOBAL_CONFIG.Snackbar !== undefined && btf.snackbarShow(GLOBAL_CONFIG.Snackbar.day_to_night);
    } else {
        activateLightMode();
        saveToLocal.set('theme', 'light', 2);
        GLOBAL_CONFIG.Snackbar !== undefined && btf.snackbarShow(GLOBAL_CONFIG.Snackbar.night_to_day);
    }
    typeof utterancesTheme === 'function' && utterancesTheme();
    typeof FB === 'object' && window.loadFBComment();
    window.DISQUS && document.getElementById('disqus_thread').children.length && setTimeout(() => window.disqusReset(), 200);
};
/* eslint-disable no-undef */
document.addEventListener('DOMContentLoaded', function () {
    translateInitialization();
    document.addEventListener('pjax:complete', translateInitialization);
});
const translate = GLOBAL_CONFIG.translate;
const snackbarData = GLOBAL_CONFIG.Snackbar;
const defaultEncoding = translate.defaultEncoding; /* 網站默認語言，1: 繁體中文, 2: 簡體中文 */
const translateDelay = translate.translateDelay; /* 延遲時間,若不在前, 要設定延遲翻譯時間, 如100表示100ms,默認為0 */
const msgToTraditionalChinese = translate.msgToTraditionalChinese; /* 此處可以更改為你想要顯示的文字 */
const msgToSimplifiedChinese = translate.msgToSimplifiedChinese; /* 同上，但兩處均不建議更改 */
let currentEncoding = defaultEncoding;
const targetEncodingCookie = 'translate-chn-cht';
let targetEncoding =
    saveToLocal.get(targetEncodingCookie) === undefined
        ? defaultEncoding
        : Number(saveToLocal.get('translate-chn-cht'));
let translateButtonObject
const isSnackbar = GLOBAL_CONFIG.Snackbar !== undefined;
function translateText(txt) {
    if (txt === '' || txt == null) return '';
    if (currentEncoding === 1 && targetEncoding === 2) return Simplized(txt);
    else if (currentEncoding === 2 && targetEncoding === 1) { return Traditionalized(txt) } else return txt;
}
function translateBody(fobj) {
    let objs;
    if (typeof fobj === 'object') objs = fobj.childNodes;
    else objs = document.body.childNodes;
    for (let i = 0; i < objs.length; i++) {
        const obj = objs.item(i);
        if (
            '||BR|HR|'.indexOf('|' + obj.tagName + '|') > 0 ||
            obj === translateButtonObject
        ) { continue }
        if (obj.title !== '' && obj.title != null) { obj.title = translateText(obj.title) };
        if (obj.alt !== '' && obj.alt != null) obj.alt = translateText(obj.alt);
        if (obj.placeholder !== '' && obj.placeholder != null) obj.placeholder = translateText(obj.placeholder);
        if (
            obj.tagName === 'INPUT' &&
            obj.value !== '' &&
            obj.type !== 'text' &&
            obj.type !== 'hidden'
        ) { obj.value = translateText(obj.value) }
        if (obj.nodeType === 3) obj.data = translateText(obj.data);
        else translateBody(obj);
    }
}
function translatePage() {
    if (targetEncoding === 1) {
        currentEncoding = 1;
        targetEncoding = 2;
        saveToLocal.set(targetEncodingCookie, targetEncoding, 2);
        translateBody();
        if (isSnackbar) btf.snackbarShow(snackbarData.cht_to_chs);
    } else if (targetEncoding === 2) {
        currentEncoding = 2;
        targetEncoding = 1;
        saveToLocal.set(targetEncodingCookie, targetEncoding, 2);
        translateBody();
        if (isSnackbar) btf.snackbarShow(snackbarData.chs_to_cht);
    }
}
function JTPYStr() {
    return ' '
}
function FTPYStr() {
    return ' '
}
function Traditionalized(cc) {
    let str = '';
    const ss = JTPYStr();
    const tt = FTPYStr();
    for (let i = 0; i < cc.length; i++) {
        if (cc.charCodeAt(i) > 10000 && ss.indexOf(cc.charAt(i)) !== -1) { str += tt.charAt(ss.indexOf(cc.charAt(i))) } else str += cc.charAt(i)
    };
    return str;
}
function Simplized(cc) {
    let str = '';
    const ss = JTPYStr();
    const tt = FTPYStr();
    for (let i = 0; i < cc.length; i++) {
        if (cc.charCodeAt(i) > 10000 && tt.indexOf(cc.charAt(i)) !== -1) { str += ss.charAt(tt.indexOf(cc.charAt(i))) } else str += cc.charAt(i)
    }
    return str;
}
function translateInitialization() {
    translateButtonObject = document.getElementById('menu-translate');
    if (translateButtonObject) {
        if (currentEncoding !== targetEncoding) {
            setTimeout(translateBody, translateDelay);
        }
        translateButtonObject.addEventListener('click', translatePage, false);
    }
}
$('#menu-backward').on('click', function () { window.history.back(); });
$('#menu-forward').on('click', function () { window.history.forward(); });
$('#menu-refresh').on('click', function () { window.location.reload(); });
$('#menu-darkmode').on('click', function () {
    switchDarkMode();
    new Vue({
        data: function () {
            this.$notify({
                title: "你已被发现😜",
                message: "切换模式当中",
                position: 'top-left',
                offset: 50,
                showClose: true,
                type: "warning",
                duration: 5000
            });
        }
    })
}); 
// 切换模式触发事件
$('#menu-home').on('click', function () { window.location.href = window.location.origin; });
/* 简体繁体切换 */
$('#menu-translate').on('click', function () {
    removeRightMenu();
    translateInitialization();
});
$(".menu-link").on("click", function () {
    removeRightMenu();
});
$("#menu-print").on("click", function () {
    removeRightMenu();
    window.print();
});
$("#rightmenu-mask").on("click", function () { removeRightMenu() });
$("#rightmenu-mask").contextmenu(function () {
    removeRightMenu();
    return false;
});
