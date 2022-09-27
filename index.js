const http = require('http');
const fs = require('fs');
const url = require('url');


const replaceTemplate = (temp,product) => {
    let output = temp.replace(/{%PRODUCTNAME%}/g,product.productName);
    output = output.replace(/{%IMAGE%}/g,product.image);
    output = output.replace(/{%FROM%}/g,product.from);
    output = output.replace(/{%NUTRIENTS%}/g,product.nutrients);
    output = output.replace(/{%QUANTITY%}/g,product.quantity);
    output = output.replace(/{%PRICE%}/g,product.price);
    output = output.replace(/{%DESCRIPTION%}/g,product.description);
    output = output.replace(/{%ID%}/g,product.id);
    if(!product.organic){
        output = output.replace(/{%NOT_ORGANIC%}/g,'not-organic');
    }
    return output;
}

const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`,'utf-8');
const templateProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`,'utf-8');
const tempOverview= fs.readFileSync(`${__dirname}/templates/template-overview.html`,'utf-8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`,'utf-8');
const dataJSObj = JSON.parse(data);


const server = http.createServer((req,res) => {
    const {query,pathname} = url.parse(req.url,true);

    //OverView page
    if(pathname==='/overview' || pathname==='/'){
        res.writeHead(200,{'Content-Type':'text/html'})

        const cardsHTML = dataJSObj.map(el => replaceTemplate(tempCard,el)).join('');
        const output = tempOverview.replace('{%PRODUCT_CARDS%}',cardsHTML);
        res.end(output);
    }
    //products page
    else if(pathname==='/product'){
        res.writeHead(200,{'Content-Type':'text/html'});
        const product = dataJSObj[query.id];
        const output = replaceTemplate(templateProduct,product);
        res.end(output);
    }
    //API page
    else if(pathname==='/api'){
            res.writeHead(200,{'Content-Type':'application/json'});
            res.end(data);
    }
    //Not found page
    else{
        res.end('page not found');
    }

});

server.listen('8000','127.0.0.1', ()=> {
})

