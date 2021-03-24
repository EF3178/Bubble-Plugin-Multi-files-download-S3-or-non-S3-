
function(properties, context) {
	
   	var JSZip = require('jszip');
	var saveAs = require('filesaver.js');

	var zip = new JSZip();
	zip.file("hello.txt", "Hello node!");

	var blob = zip.generate({type: 'blob'});
	saveAs(blob, 'images.zip');
}