import xmldom from 'xmldom';
//import linksRe, { any as linksAny } from './links';

const noop = () => {};
const DOMParser = new xmldom.DOMParser({
    errorHandler: { warning: noop, error: noop },
});
const XMLSerializer = new xmldom.XMLSerializer();

export default function(html, { mutate = true, hideImages = false } = {}) {
    const state: any = {};
    state.hashtags = new Set();
    state.usertags = new Set();
    state.htmltags = new Set();
    state.images = new Set();
    state.links = new Set();
    try {
        const doc = DOMParser.parseFromString(html, 'text/html');
        //try catch error here, seomthing not working...
        traverse(doc, state);

        if (!mutate) return state;
        return {
            html: doc ? XMLSerializer.serializeToString(doc) : '',
            ...state,
        };
    } catch (error) {
        // xmldom error is bad
        console.log(
            'rendering error',
            JSON.stringify({ error: error.message, html })
        );
        return { html: '' };
    }
}

function traverse(node, state, depth = 0) {
    if (!node || !node.childNodes) return;
    Array.prototype.forEach.call(node.childNodes, child => {
        const tag = child.tagName ? child.tagName.toLowerCase() : null;
        if (tag) state.htmltags.add(tag);

        if (tag === 'img') img(state, child);

        traverse(child, state, depth + 1);
    });
}

function img(state, child) {
    const url = child.getAttribute('src');
    if (url) {
        state.images.add(url);
    }
}
