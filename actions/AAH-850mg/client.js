function(properties, context) {
/* 
	Zip Download v 0.65 - A JavaScript plugin made for Bubble.is for generating zip files.
	(c) 2009 S G. <segongora> | Yucatán, México.
	Zip Download uses the library JSZip created by Stuk at: https://github.com/Stuk/jszip
	Free to use for every purpose.
    Thanks!
*/
    function imgURLToDataURL(url, options = {}) {
  return new Promise((resolve, reject) => {
    img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      let canvas = document.createElement('CANVAS'),
        ctx = canvas.getContext('2d'),
        dataURL;
      canvas.height = img.height;
      canvas.width = img.width;
      ctx.drawImage(img, 0, 0);
      dataURL = canvas.toDataURL(options.outputFormat, options.quality);
      resolve(dataURL);
      canvas = null;
    };
    img.src = url;
  });
}
    
    //Read properties files and single files. Detect if there's no files at all.
    if (properties.files == null && properties.single_file == null) {
        
        return 0;
    }
    
    // Remove comment if you want only one source to download files
    // If there are more than one source files...
    /*else if (properties.files != null && properties.single_file != null) {
        alert("Just one source must be added.\nRight now there are two. Please reomve one.");
        return 0;
    }*/
    
    // If everything is correct...
    else {
        
        // Multiple source files require a different approach method.
        if (properties.files != null) {
            	
            // Store the List of URL's files.
            var urls = properties.files.get(0,properties.files.length());
            
            // Create a new JSZip (cortesy of Stuk).
            var zip = new JSZip();
            
            // Store the string of folder_name (if exists).
            var folderN = properties.folder_name;
            
            // Download each of the given URL's. Returns multiple Promise's, depending on the quantity of URL's.
            urls.forEach(function(urls){    				
                function urlToPromise(url) {       				
                    return new Promise(function(resolve, reject) {           				
                        if (url.substring(0, 1) == '//'){
                            url = "https:" + url;
                        };
                    imgURLToDataURL(url)
					.then(function(dataURL){	
                        JSZipUtils.getBinaryContent(url, function (err, data) {                           			
                            if(err) {          
                   				reject(err);       
                			} else {           
                   				resolve(data);       
                			}
                    
            			});    
 
                    });
           
            		});
        		}
        		
                // Remove all the annoying extra folders created thanks to Amazon S3.
                var filename = urls.replace(/.*\//g, "");
                
                // If user wants a personal folder name...
                if (folderN != null) {
                	zip.folder(folderN).file(filename, urlToPromise(urls), {binary: true, createFolders: true});
                }
                
                // If not...
                else {

                    zip.file(filename, urlToPromise(urls), {binary: true, createFolders: true});
                }
            }); 
        		
            // Generate the ZIP file and give it to the user.
    		zip.generateAsync({type:"blob"}).then(function callback(blob) {saveAs(blob, properties.filename);});       
        }
        
        // If there's only one file to download.
        if (properties.single_file != null) {
        
            // Store the url given by user.
            var singleURL = "https://stormy-bastion-35201.herokuapp.com/" + properties.single_file;
            
            // Remove all the annoying extra folders created thanks to Amazon S3.
            var filename = singleURL.replace(/.*\//g, "");
            
            // Download file with FileSaver, as a single file without Zip.
            saveAs(singleURL, filename);
            
            
            /*
            /* If you want to download ONE file into a Zip, remove comments from here.
            // Create a new JSZip (cortesy of Stuk).
            var zip = new JSZip();
            
            // Store the single URL file given by the user.
            var singleURL = properties.single_file;
            
            // Create the function that will download the URL given. Return a single Promise.
            function urlToPromise(url) {
                return new Promise(function(resolve, reject) {
                    JSZipUtils.getBinaryContent(url, function (err, data) {      
                        if(err) {          
                            reject(err);       
                        } else {          
                            resolve(data);       
                        }   
                    });
                });
            }			
            
            // Remove all the annoying extra folders created thanks to Amazon S3.
            var filename = singleURL.replace(/.*\//g, "");
            
            // Since there will only be one file, there's no reason to create an extra folder.
            zip.file(filename, urlToPromise(singleURL), {binary:true, createFolders: false});
            
            // Generate the ZIP file and give it to the user.
            zip.generateAsync({type:"blob"}).then(function callback(blob) {saveAs(blob, properties.filename); });
        	
            */
        }           
    }
    
    // End
}