
let cheerio = require('cheerio');

function nodesBySelector(html, selector){
    let $ = cheerio.load(html);
    return $(selector);    
};

function getAllTopicsHtml(html){
    return nodesBySelector(html,'div#center li a');
};

function getAllResultNodes(html){
    return nodesBySelector(html,'div#sortable-results ul.rows li.result-row p.result-info>a.result-title');
}

function getSubTopicsNodes(html){
    return nodesBySelector(html,'div.personals div.links ul.subLinks li a');
}

//node here refers to a cheerio node object
function extractInfoFromLandingPageNode(index, node){
    return {
        index: index,
        url: node.attribs.href,
        text: node.children[0].children[0].data
    };
};


function extractInfoFromLeafPageNode(index, node){
    return {
        dataId : node.attribs['data-id'],
        url: node.attribs.href,
        title: node.children[0].data
    };
};

function extractInfoFromSubTopicPageNode(index, node){
    return {
        url: node.attribs.href,
        subTitle: node.children[0].data
    }
}

function fetchAndTransform(html, getFn, transformerFn){
    return getFn(html).map(transformerFn).get();
}

exports.getAllTopics = function(html){
    return fetchAndTransform(html,getAllTopicsHtml,extractInfoFromLandingPageNode);
};

exports.getAllResults = function(html){
    return fetchAndTransform(html,getAllResultNodes,extractInfoFromLeafPageNode);
};

exports.getSubTopics = function(html){
    return fetchAndTransform(html,getSubTopicsNodes,extractInfoFromSubTopicPageNode);
}



