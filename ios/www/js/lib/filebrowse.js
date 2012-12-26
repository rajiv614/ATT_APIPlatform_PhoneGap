// handling document ready and phonegap deviceready
//alert(window);
//window.addEventListener('load', function() {
//	//alert('doc is '+document);
//	document.addEventListener('deviceready', onDeviceReady, false);
//}, false);

var root = null;
// File System root variable
var currentDir = null;
// Current DirectoryEntry listed
var parentDir = null;
// Parent of the current directory

var activeItem = null;
// The clicked item
var activeItemType = null;
// d-directory, f-file
var clipboardItem = null;
// file or directory for copy or move
var clipboardAction = null;
// c-copy, m-move

// Phonegap is loaded and can be used
//function onDeviceReady() {
//	//alert('hihhhhh');
//	getFileSystem();
//	clickItemAction();
//}

function readFileSystem() {
	//alert('hihhhhh');
	getFileSystem();
	clickItemAction();
}


/* get the root file system */
function getFileSystem() {
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {// success get file system
		root = fileSystem.root;
                             console.log(JSON.stringify(root));
		listDir(root);
	}, function(evt) {// error get file system
		//alert("error "+evt);
		console.log("File System Error: " + evt.target.error.code);
	});
}

/* show the content of a directory */
function listDir(directoryEntry) {
    console.log(JSON.stringify(directoryEntry));
	if (!directoryEntry.isDirectory)
		console.log('listDir incorrect type');
	//$.mobile.showPageLoadingMsg();
	// show loading message
	currentDir = directoryEntry;
	// set current directory
	directoryEntry.getParent(function(par) {// success get parent
		parentDir = par;
		// set parent directory
		if ((parentDir.name == 'sdcard' && currentDir.name != 'sdcard')
				|| parentDir.name != 'sdcard')
			$('#backBtn').show();
	}, function(error) {// error get parent
		console.log('Get parent error: ' + error.code);
	});

	var directoryReader = directoryEntry.createReader();
	directoryReader.readEntries(function(entries) {
		var dirContent = $('#dirContent');
		dirContent.empty();

		var dirArr = new Array();
		var fileArr = new Array();
		for ( var i = 0; i < entries.length; ++i) {// sort entries
			var entry = entries[i];
			if (entry.isDirectory && entry.name[0] != '.')
				dirArr.push(entry);
			else if (entry.isFile && entry.name[0] != '.')
				fileArr.push(entry);
		}

		var sortedArr = dirArr.concat(fileArr);
		// sorted entries
		var uiBlock = [ 'a', 'b', 'c', 'd' ];

		for ( var i = 0; i < sortedArr.length; ++i) {// show directories
			var entry = sortedArr[i];
			var blockLetter = uiBlock[i % 4];
//			if (entry.isDirectory)
//				dirContent.append('<div class="k-' + blockLetter
//						+ '"><div class="folder"><p>' + entry.name
//						+ '</p></div></div><br>');
//			else
            if (entry.isFile) {

				var fType = entry.name.split('.').pop();
				if (fType === "amr" || fType === "wav") {
					dirContent.append('<div class="k-'
							+ blockLetter + '"><div class="file"><p>'
							+ entry.name + '</p></div></div>');
				}
			}
		}
	
		//$.mobile.hidePageLoadingMsg();
		// hide loading message
	}, function(error) {
		console.log('listDir readEntries error: ' + error.code);
	});
}

/* read from file */
function readFile(fileEntry) {
	if (!fileEntry.isFile)
		console.log('readFile incorrect type');
	//$.mobile.showPageLoadingMsg();
	// show loading message

	fileEntry.file(function(file) {
		var reader = new FileReader();
		reader.onloadend = function(evt) {
			console.log("Read as data URL");
			console.log(evt.target.result);
			// show data from file into console
		};
		reader.readAsDataURL(file);
		window.location.href = "speech.html";
		window.localStorage.speechFilePath = file.fullPath;

		//$.mobile.hidePageLoadingMsg();
                   var pathOfFile = file.fullPath;
                   var lastindex = pathOfFile.lastIndexOf("/");
                   var fileSelected = pathOfFile.substring(lastindex + 1, (pathOfFile.length));
                   //window.localStorage.setItem("fileSelected", fileSelected);
                   window.location.href = "speech.html?fileSelected=" + fileSelected + "&speechFilePath=" + pathOfFile;
                   }, function(error) {
                   console.log(evt.target.error.code);
                   });
}

/* open item */
function openItem(type) {
	if (type == 'd') {
		listDir(activeItem);
	} else if (type == 'f') {
		readFile(activeItem);
	}
}

/* get active item  */
function getActiveItem(name, type) {
	if (type == 'd' && currentDir != null) {
		currentDir.getDirectory(name, {
			create : false
		}, function(dir) {// success find directory
			activeItem = dir;
			activeItemType = type;
		}, function(error) {// error find directory
			console.log('Unable to find directory: ' + error.code);
		});
	} else if (type == 'f' && currentDir != null) {
		currentDir.getFile(name, {
			create : false
		}, function(file) {// success find file
			activeItem = file;
			activeItemType = type;
            openItem(activeItemType);
		}, function(error) {// error find file
			console.log('Unable to find file: ' + error.code);
		});
	}
}

/* get clipboard item for copy or move */
function getClipboardItem(action) {
	if (activeItem != null) {
		clipboardItem = activeItem;
		clipboardAction = action;
	}
}

/* click actions */
function clickItemAction() {
	var folders = $('.folder');
	var files = $('.file');
	var backBtn = $('#backBtn');
	var homeBtn = $('#homeBtn');
	/* menu buttons */
	var menuDialog = $('#menuOptions');
	var openBtn = $('#openBtn');
	var copyBtn = $('#copyBtn');
	var moveBtn = $('#moveBtn');
	var pasteBtn = $('#pasteBtn');
	var deleteBtn = $('#deleteBtn');

	folders.live('click', function() {
		var name = $(this).text();
		getActiveItem(name, 'd');
		
		$('#menu').trigger('click');
		// menu dialog box
	});

	files.live('click', function() {
		var name = $(this).text();
		getActiveItem(name, 'f');
		//openItem(activeItemType);
		//$('#menu').trigger('click');
		// menu dialog box
		// paste button always disabled for files
		pasteBtn.button('disable');
		pasteBtn.button('refresh');
	});
	backBtn.click(function() {// go one level up
		if (parentDir != null)
			listDir(parentDir);
	});

	homeBtn.click(function() {// go to root
		if (root != null) {
			listDir(root);
		}
		/*else{
		 $.mobile.loadPage('speech.html');

		 }*/
	});

	openBtn.click(function() {
		openItem(activeItemType);
		menuDialog.dialog('close');
	});

	copyBtn.click(function() {
		getClipboardItem('c');
		menuDialog.dialog('close');
		pasteBtn.button('enable');
		pasteBtn.button('refresh');
	});

	moveBtn.click(function() {
		getClipboardItem('m');
		menuDialog.dialog('close');
		pasteBtn.button('enable');
		pasteBtn.button('refresh');
	});

	pasteBtn.click(function() {
		if (clipboardItem != null && clipboardAction != null) {
			if (clipboardAction == 'c') {// copy item
				console.log('copy: ' + clipboardItem.name + ' to: ' + activeItem.name);
				clipboardItem.copyTo(activeItem, clipboardItem.name, function(fileCopy) {
					console.log('copy success! ' + fileCopy.name);
					openBtn.trigger('click');
				}, function(error) {
					console.log('copy error: ' + error.code);
				});
			} else if (clipboardAction == 'm') {// move item
				console.log('move: ' + clipboardItem.name + ' to: ' + activeItem.name);
				clipboardItem.moveTo(activeItem, clipboardItem.name, function(fileCopy) {
					console.log('move success! ' + fileCopy.name);
					openBtn.trigger('click');
				}, function(error) {
					console.log('move error: ' + error.code);
				});
			}
		}
	});

	deleteBtn.click(function() {
		if (activeItem != null && activeItemType != null) {
			if (activeItemType == 'd') {
				activeItem.removeRecursively(function() {
					console.log('removed recursively with success');
					menuDialog.dialog('close');
					listDir(currentDir);
				}, function(error) {
					console.log('remove recursively error: ' + error.code);
				});
			} else if (activeItemType == 'f') {
				activeItem.remove(function() {
					console.log('removed recursively with success');
					menuDialog.dialog('close');
					listDir(currentDir);
				}, function(error) {
					console.log('remove recursively error: ' + error.code);
				});
			}
		}
	});
}
