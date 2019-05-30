var fs = require('fs'),
xml2js = require('xml2js');
var parser = new xml2js.Parser();
fs.readFile(__dirname + '/source/catalog.xml', 'utf8', function(err, data) {
    parser.parseString(data, function (err, result) {
        for(let i in result.catalog.product){
            for(let viewtype in result.catalog.product[i].images){
                for(let types in result.catalog.product[i].images[viewtype]['image-group']){

                    if(result.catalog.product[i].images[viewtype]['image-group'][types]["$"]['view-type'] == 'hi-res'){
                        var images = result.catalog.product[i].images[viewtype]['image-group'][types]["image"]
                        var medium = {
                            '$': { 'view-type': 'medium' },
                            image: images
                        };
                        var large = {
                            '$': { 'view-type': 'large' },
                            image: images
                        };
                        result.catalog.product[i].images[viewtype]['image-group'].push(medium,large)
                    }
                }
            }
        }
        console.log(result.catalog.product.length)
        var chunks = chunk(result.catalog.product, 1000)
        for(let x in chunks){
            result.catalog.product = [];
            for(let y in chunks[x]){
                result.catalog.product.push(chunks[x][y])
            }
            var builder = new xml2js.Builder();
            var xml = builder.buildObject(result);
            fs.writeFile(__dirname +'/output/catalog' + x +'.xml', xml, (err) => {
                // throws an error, you could also catch it here
                if (err) throw err;

                // success case, the file was saved
                console.log('Lyric saved!');

            });
        }
    });

});
function chunk(array, size) {
    const chunked_arr = [];
    for (let i = 0; i < array.length; i++) {
        const last = chunked_arr[chunked_arr.length - 1];
        if (!last || last.length === size) {
            chunked_arr.push([array[i]]);
        } else {
            last.push(array[i]);
        }
    }
    return chunked_arr;
}