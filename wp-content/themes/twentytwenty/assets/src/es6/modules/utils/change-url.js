import $ from 'jquery';
import empty from './empty';

/**
 * Window URL Changer
 * @param hash
 * @param {Boolean} replace
 */
export default function (hash, replace) {
    'use strict';

    // Get the anchor that was clicked
    let pageUrl = hash;

    if (pageUrl.length > 0) {
        pageUrl = pageUrl.toLowerCase();
    }

    // Update the browser URL
    if (pageUrl !== window.location.hash.replace('#', '')) {
        if (history.pushState && history.replaceState) {
            if (pageUrl.length > 0) {
                if (!empty(window.location.search)) {
                    pageUrl = window.location.search + '#' + pageUrl;
                }

                if (pageUrl.indexOf('#') === -1) {
                    pageUrl = '#' + pageUrl;
                }

                if (replace) {
                    window.history.replaceState({state: document.title}, '', pageUrl);
                    $(window).trigger('hashchange', {url: pageUrl});
                } else {
                    window.history.pushState({state: document.title}, '', pageUrl);
                    $(window).trigger('hashchange', {url: pageUrl});
                }
            } else {
                if (replace) {
                    window.history.replaceState({state: document.title}, '', window.location.pathname);
                    $(window).trigger('hashchange', {url: pageUrl});
                } else {
                    window.history.pushState({state: document.title}, '', window.location.pathname);
                    $(window).trigger('hashchange', {url: pageUrl});
                }
            }
        } else {
            window.location.hash = pageUrl;
            $(window).trigger('hashchange', {url: pageUrl});
        }
    }
};
