// handling document ready and phonegap deviceready
window.addEventListener('load', function() {
	document.addEventListener('deviceready', onDeviceReady, false);
}, false);

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
function onDeviceReady() {
	getFileSystem();
	clickItemAction();
}

/* get the root file system */
function getFileSystem() {
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,
			function(fileSystem) {// success get file system
				root = fileSystem.root;
				listDir(root);
			}, function(evt) {// error get file system
				console.log("File System Error: " + evt.target.error.code);
			});
}

/* show the content of a directory */
function listDir(directoryEntry) {
	if (!directoryEntry.isDirectory)
		console.log('listDir incorrect type');
	$.mobile.showPageLoadingMsg();
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
	directoryReader
			.readEntries(
					function(entries) {
						var dirContent = $('#dirContent');
						dirContent.empty();

						var dirArr = new Array();
						var fileArr = new Array();
						for ( var i = 0; i < entries.length; ++i) {// sort
							// entries
							var entry = entries[i];
							if (entry.isDirectory && entry.name[0] != '.')
								dirArr.push(entry);
							else if (entry.isFile && entry.name[0] != '.')
								fileArr.push(entry);
						}

						var sortedArr = dirArr.concat(fileArr);
						// sorted entries
						var uiBlock = [ 'a', 'b', 'c', 'd' ];
						dirContent
								.append('<table border="1" style="width:100%" >');
						for ( var i = 0; i < sortedArr.length; ++i) {// show
							// directories
							var entry = sortedArr[i];
							var blockLetter = uiBlock[i % 4];
							if (entry.isDirectory)
								dirContent
										.append('<tr style="width:100%"><td style="width:100%"><div class="ui-block-'
												+ blockLetter
												+ '"><div class="folder"><p>'
												+ entry.name
												+ '</p></div></div></td></tr></hr>');
							else if (entry.isFile) {

								var fType = entry.name.split('.').pop();
								if (fType === "amr" || fType === "wav") {
									dirContent
											.append('<tr style="width:100%"><td style="width:100%"><div class="ui-block-'
													+ blockLetter
													+ '"><div class="file"><p>'
													+ entry.name
													+ '</p></div></div></td></tr></hr>');
								}
							}
						}
						dirContent.append('</table>');
						$.mobile.hidePageLoadingMsg();
						// hide loading message
					},
					function(error) {
						console.log('listDir readEntries error: ' + error.code);
					});
}

/* read from file */
function readFile(fileEntry) {
	if (!fileEntry.isFile)
		console.log('readFile incorrect type');
	$.mobile.showPageLoadingMsg();
	// show loading message
	fileEntry.file(function(file) {

		var reader = new FileReader();
		reader.onloadend = function(evt) {
			//$.mobile.hidePageLoadingMsg();
			//window.location.href = "speech.html";
			console.log("Read as data URL");
			console.log(evt.target.result);
			// show data from file into console
		};
		reader.readAsDataURL(file);
		console.log(file.fullPath);
		$.mobile.hidePageLoadingMsg();
		var pathOfFile = file.fullPath;
		var lastindex = pathOfFile.lastIndexOf(".");
		var selectedFileExtension = pathOfFile.substring(lastindex + 1,
				(pathOfFile.length));
		var selectedFilePath = pathOfFile.substring(0,lastindex);
        window.location.href = "speech.html?selectedFileExtension=" + selectedFileExtension  + "&selectedFilePath=" + selectedFilePath ;
	}, function(error) {
		$.mobile.hidePageLoadingMsg();
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

/* get active item */
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

	folders.live('click', function() {
		var name = $(this).text();
		getActiveItem(name, 'd');
		$('#menu').trigger('click');
		// menu dialog box
	});

	files.live('click', function() {
		var name = $(this).text();
		getActiveItem(name, 'f');
	});

	backBtn.click(function() {// go one level up
		if (parentDir != null)
			listDir(parentDir);
	});

	homeBtn.click(function() {// go to root
		if (root != null) {
			listDir(root);
		}
	});

	openBtn.click(function() {
		openItem(activeItemType);
		menuDialog.dialog('close');
	});

}
