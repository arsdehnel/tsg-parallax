/** Common functions - included in portal_1a.js */

/* Appcelerator settings */
AppceleratorConfig = {};
AppceleratorConfig["track_stats"] = false;


//
//Typedef Section
//
HashMap = function() {
	this.put = function(key, val) {
		this[key] = val;
	};
	this.get = function(key) {
		return this[key];
	};
}

Photo = function(id, smallImage, largeImage, message) {
	this.id = id;
	this.smallImage = smallImage;
	this.largeImage = largeImage;
	this.message = message;
};

/** for inclusions, detect the session expired */
function displayLoginPageIfSessionExpired(contextPath, elementId, marker) {
	try {
		var element = document.getElementById(elementId);
		var html = element.innerHTML;
		if (html == undefined) {
			alert("Element with ID:" + elementId + " is not defined.");
		} else if ((html.indexOf(marker) >= 0)) {
			location.href = contextPath + '/login/login.action?error=2';
			return true;// expired
		} else {
		}
	} catch (err) {
		alert('Error:' + err);
	}

	return false;
}


function refreshPortal(contextPath) {
	location.href = contextPath + '/home.action';
}

function loginPage(contextPath) {
	if (window.parent)
		window.parent.location.href = contextPath + '/login/login.action';
	else
		location.href = contextPath + '/login/login.action';
}

/* Common functions */
function cleanForms() {
	for ( var i = 0; i < document.forms.length; i++) {
		document.forms[i].reset();
	}
}

function cleanSelect(elementId) {
	var elSel = document.getElementById(elementId);
	var i;
	for (i = elSel.length - 1; i >= 0; i--) {
		elSel.remove(i);
	}
}

function clearForm(form) {
	for ( var i = 0; i < form.elements.length; i++) {
		if (form.elements[i].type == "text"
				|| form.elements[i].type == "textarea")
			form.elements[i].value = "";
		else if (form.elements[i].type == "select-one")
			form.elements[i].selectedIndex = 0;
		else if (form.elements[i].type == "checkbox")
			form.elements[i].checked = false;
	}
}
/** Ping */
function pingPortal() {
	var myJSON = null;
	$MQ('r:ping.request', myJSON);
}

function pingPortalRepetitive(time) {
	return setInterval("pingPortal()", time);
}

function pingPortalRepetitiveStop(id) {
	return window.clearInterval(id);
}

function cleanContent(elementId) {
	var el = document.getElementById(elementId)
	Appcelerator.Compiler.destroyContent(el);
	Appcelerator.Compiler.destroy(el);
	el.innerHTML = '';
}

function evaluateContent(content) {
	var search = content;

	while (script = search.match(/(<script[^>]+javascript[^>]+>\s*(<!--)?)/i)) {
		search = search.substr(search.indexOf(RegExp.$1) + RegExp.$1.length);

		if (!(endscript = search.match(/((-->)?\s*<\/script>)/)))
			break;

		block = search.substr(0, search.indexOf(RegExp.$1));
		search = search.substring(block.length + RegExp.$1.length);

		var oScript = document.createElement('script');
		oScript.text = block;
		document.getElementsByTagName("head").item(0).appendChild(oScript);
	}
}

function evaluateContent2(content) {
	var array = content.match(/<script.*?>([^<]*)<\/script>/g);
	if (array != null) {
		for (idx = 0; idx < array.length; idx++) {
			try {
				eval(RegExp.$1);
			} catch (err) {
				alert("Encounter an errror while parsing the script:"
						+ err.message);
			}
		}
	}
}


function evaluateJavascript(xmlNode, debug) {
	var scripts = xmlNode.getElementsByTagName("script");
	for ( var i = 0; i < scripts.length; i++) {
		var script = scripts[i];

		if (script.getAttribute("type") == "text/javascript") {
			var js = script.firstChild.nodeValue;
			eval(js);
			alert(xmlNode.id + "\n" + js);
		} else {
			if (debug)
				alert('Type for <script> located in ' + xmlNode.id
						+ ' is not text/javascript('
						+ script.getAttribute("type")
						+ '). Evaluation skipped.');
		}
	}
}
