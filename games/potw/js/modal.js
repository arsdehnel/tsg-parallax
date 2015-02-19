jQuery(document).ready(function()
{
	// #### generic code #### //
	
	// INITIALIZE DATE PICKERS
	datePickerElements = jQuery("label.datepick input")
	if ( datePickerElements )
	{
		datePickerElements.datepicker({
	        showOn: 'focus',
	        showAnim: 'fadeIn'
	    });
	}
	
	// SHOW/HIDE TOOLTIPS/MINITIPS
	/* documentation
	------------------------------------
	- The <a> that can trigger a tooltip needs to have a class of "tip" and a page-unique ID of "tip#" where # is any integer applied: <a class="tip" id="tip#">
	- Each tooltip needs a class of "tooltip" and also one corresponding to the class of the trigger, or "tip#", and should be of the following structure: <div class="tooltip tip#"><blockquote>[content]</blockquote></div>
	- When the trigger is hovered, the corresponding tooltip will show and then hide on mouseout.
	------------------------------------
	*/
    jQuery("a.tip").bind("mouseenter", function() {
		tip = jQuery(this).attr("id");
		hideselect = false;
		if( jQuery.browser.msie && jQuery.browser.version.substr(0,3)=="6.0" ) {
			hideselect = true;
		}		
		
		jQuery("."+tip).show();
		if( hideselect == true ) {
			jQuery("select").css({'visibility' : 'hidden'});	
		}
	}).bind("mouseleave", function() {
		jQuery("."+tip).hide();
		if( hideselect == true ) {
			jQuery("select").css({'visibility' : 'visible'});	
		}
	});

	jQuery("a.checkTip").bind("mouseenter", function()
	{
		jQuery(this).parent("span.label").parent("label").prev("img.checkExample").show();
	}).bind("mouseleave", function()
	{
		jQuery(this).parent("span.label").parent("label").prev("img.checkExample").hide();
	});
	
	jQuery("a.oldCheckTip").bind("mouseenter", function()
	{
		jQuery(this).next("img.oldCheckExample").show();
	}).bind("mouseleave", function()
	{
		jQuery(this).next("img.oldCheckExample").hide();
	});

	// DISABLE OR ENABLE FORMS
	/* documentation
	------------------------------------
	- The path variable should be in the form of a jQuery selector string and point at the container of the form you want to disable.
	- EVERY input, select, textarea, and button will be turned off so be careful when applying it.
	------------------------------------
	*/
    function disable_form(path) {
        jQuery(path + " input").attr("disabled","disabled").addClass("disabled");
        jQuery(path + " select").attr("disabled","disabled").addClass("disabled");
        jQuery(path + " textarea").attr("disabled","disabled").addClass("disabled");
        jQuery(path + " button").attr("disabled","disabled").addClass("disabled");
    }
    function enable_form(path) {
        jQuery(path + " input").removeAttr("disabled").removeClass("disabled");
        jQuery(path + " select").removeAttr("disabled").removeClass("disabled");
        jQuery(path + " textarea").removeAttr("disabled").removeClass("disabled");
        jQuery(path + " button").removeAttr("disabled").removeClass("disabled");
    }
	
	// SHOW/HIDE CONDITIONAL FORM FIELDS WITH SELECT BOX
	/* documentation
	------------------------------------
	- The <select> that can trigger conditional items needs to have a class of "hastrigger" applied: <select class="hastrigger">
	- The <option> that triggers conditional items needs to have a class of "trigger" and a page-unique title of "cond#" where # is any integer: <option class="trigger" title="cond#">
	- Conditional items can be anything on the page: <label>s, <fieldset>s, <div>s, etc.
	- Each conditional item needs a class of "conditional" and also one corresponding to the class of the trigger option, or "cond#": <label class="conditional cond#"> or <fieldset class="conditional cond#">, etc.
	- When the trigger option is selected, all conditional items matching the "cond#" class will fade in. When the trigger option is deselected, these items will fade out. Any values entered into conditional form fields *should* be retained. It may be wise to revise this function to flush those values.
	------------------------------------
	*/
	
    lastchange = new Array();
    
	jQuery("select.hastrigger").change( function() {
        thisone = jQuery(this).attr("id");
        var istrigger = jQuery(this).find("option:selected");
        var cond = istrigger.attr("title");
        
        if( istrigger.hasClass("trigger") == true ) {
            jQuery("."+cond).show().focus();
            lastchange[thisone] = cond;
        }
        if( istrigger.hasClass("trigger") == false ) {
            jQuery("."+lastchange[thisone]).hide();
        }
	});
	
	// SHOW/HIDE CONDITIONAL FORM FIELDS WITH RADIO/CHECKBOXES
	/* documentation
	------------------------------------
	- The <input type="radio/checkbox"> that can trigger conditional items needs to have a class of "trigger" and a page-unique title of "cond#" where # is any integer applied: <input type="radio/checkbox" class="trigger" title="cond#">
	- Conditional items can be anything on the page: <label>s, <fieldset>s, <div>s, etc.
	- Each conditional item needs a class of "conditional" and also one corresponding to the class of the trigger option, or "cond#": <label class="conditional cond#"> or <fieldset class="conditional cond#">, etc.
	- When the trigger field is selected, all conditional items matching the "cond#" class will fade in. When the trigger field is deselected, these items will fade out. Any values entered into conditional form fields *should* be retained. It may be wise to revise this function to flush those values.
	------------------------------------
	*/
	
	/* radio buttons */
	jQuery("input[type='radio']").click( function() { // must work with all radios on the page, as even those without trigger classes can be grouped with those that do have the class
		
		var name = jQuery(this).attr("name"); // grabs the name of the clicked on radio button
		var condthis = jQuery(this).attr("title"); // grabs the title element from the clicked on radio button
		
		jQuery("input[name='"+name+"']").each( function() { // grabs all radios with the same name and starts looping through each
			var cond = jQuery(this).attr("title"); // grabs the title element from each
			if( cond != "" && cond != condthis ) { // if the title element is not blank and is not the clicked on radio
				jQuery("."+cond).hide(); // then hide the conditional tied to this radio
			}
		}); // repeat as necessary for all radios with the same name as the clicked on radio button
		
		if( condthis != "" ) { // if the title element of the clicked on radio button is not blank
			jQuery("."+condthis).show(); // then show the conditional tied to this radio
		}
	});
	
	/* checkboxes */
    jQuery("input[type='checkbox'].trigger").click( function() {
		var state = jQuery(this).attr("checked"); // grabs the checked state
        var cond = jQuery(this).attr("title"); // grabs the title element
        if( state == true ) { // if it is checked
            jQuery("."+cond).show(); // show the conditional tied to this checkbox
        } else if( state == false ) { // if it is not checked
            jQuery("."+cond).hide(); // hide the conditional tied to this checkbox
        }
	});
	
	// SHOW CONDITIONAL FORM FIELDS LINKS OR BUTTONS OR ANY OTHER CLICK
	/* documentation
	------------------------------------
	- The <a> or <button> that triggers conditional items needs to have a class of "triggershow" and a page-unique title of "cond#" where # is any integer: <a class="triggershow" title="cond#"> or <button class="triggershow" title="cond#">
	- Conditional items can be anything on the page: <label>s, <fieldset>s, <div>s, etc.
	- Each conditional item needs a class of "conditional" and also one corresponding to the title of the trigger link/button, or "cond#": <label class="conditional cond#"> or <fieldset class="conditional cond#">, etc.
	- When the trigger link/button is clicked, all conditional items matching the "cond#" class will fade in. Because these operate on a click, a repeat click will NOT cause the conditional to go away. There must be a separate button or link to HIDE (see below).
	------------------------------------
	*/
    
	jQuery(".triggershow").click( function() {
        var cond = jQuery(this).attr("title"); // grabs the title element
        jQuery("."+cond).show(); // show the conditional tied to this checkbox
	});
	
	// HIDE CONDITIONAL FORM FIELDS LINKS OR BUTTONS OR ANY OTHER CLICK
	/* documentation
	------------------------------------
	- The <a> or <button> that triggers conditional items needs to have a class of "triggerhide" and a page-unique title of "cond#" where # is any integer: <a class="triggerhide" title="cond#"> or <button class="triggerhide" title="cond#">
	- Conditional items can be anything on the page: <label>s, <fieldset>s, <div>s, etc.
	- Each conditional item needs a class of "conditional" and also one corresponding to the title of the trigger link/button, or "cond#": <label class="conditional cond#"> or <fieldset class="conditional cond#">, etc.
	- When the trigger link/button is clicked, all conditional items matching the "cond#" class will fade out. Because these operate on a click, a repeat click will NOT cause the conditional to come back. There must be a separate button or link to SHOW (see above). Any values entered into conditional form fields *should* be retained. It may be wise to revise this function to flush those values.
	------------------------------------
	*/
    
	jQuery(".triggerhide").click( function() {
        var cond = jQuery(this).attr("title"); // grabs the title element
        jQuery("."+cond).hide(); // hide the conditional tied to this checkbox
		jQuery("."+cond+" .conditional").hide(); // hide all child conditionals
	});
	
	// SHOW/HIDE MORELESS TOGGLES
	/* documentation
	------------------------------------
	- This requires a container of any sort with the class "moreless": <span class="moreless"> or <div class="moreless">, etc.
	- The show more link needs a class of "less": <a class="less">
	- The hide more link needs a class of "more": <a class="more">
	- The content to show/hide when clicking on the links should be an any container with class "more": <span class="more"> or <p class="more">, etc.
	- The hide more link should be inside the more container: <span class="more">[content]<a class="more">[link]</a></span>
	------------------------------------
	*/
    
	jQuery(".moreless .more").hide();
	jQuery(".moreless a").show();
	jQuery(".moreless a.less").click( function() {
		jQuery(this).hide();
		jQuery(this).parents(".moreless").children(".more").show();
	});
	jQuery(".moreless a.more").click( function() {
		jQuery(this).parents(".moreless").children("a.less").show();
		jQuery(this).parents(".moreless").children(".more").hide();
	});
	
	// HANDLE MULTIMOVE SELECT BOXES
	/* documentation
	------------------------------------
	- The container that holds a "multi-select move options back and forth" widget should have a class of "multimove": <div class="multimove">
	- An optional <p class="fauxlabel"> can be added to fill the left column in a two-column form
	- The source and destination <select>s should be wrapped in <label>s and structured like a typical form field.
	- The <span class="label"> and <a class="selectall"> tags are both optional, but recommended.
	- There is <ul class="movers"> between the two source and destination <select>s that is required to move items back and forth.
	- Full sample markup can be found in mock_mymessages_modal_p7-updatemessages.html
	- When the mover links/buttons are clicked, the selected <option>s will be moved to the opposite <select> and placed at the top. There is currently no reordering built in.
	------------------------------------
	*/
	
	jQuery(".multimove a.selectall").click(function() {
		jQuery(this).next().find("option").attr("selected","selected");
	});
	
	jQuery(".multimove .add a").click(function() {
		store = jQuery(this).parents("ul").prev().find("option:selected");
		jQuery(this).parents("ul").next().find("select").prepend(store);
		store.attr("selected","");
	});
	
	jQuery(".multimove .remove a").click(function() {
		store = jQuery(this).parents("ul").next().find("option:selected");
		jQuery(this).parents("ul").prev().find("select").prepend(store);
		store.attr("selected","");
	});
	
	// allow resizing for long names and lists
	jQuery(".multimove .wider a").click(function() {
		jQuery(this).parents(".multimove").addClass("multiwider");
	});
	
	jQuery(".multimove .taller a").click(function() {
		jQuery(this).parents(".multimove").children("label.select").children("span.select").children("select").attr("size", "10");
	});
	
	jQuery(".multimove .reset a").click(function() {
		jQuery(this).parents(".multimove").removeClass("multitaller").removeClass("multiwider")
		jQuery(this).parents(".multimove").children("label.select").children("span.select").children("select").attr("size", "5");
	});
	
	// disable/enable the buttons
	jQuery(".multimove .source select").focus(function() {
		jQuery(this).parents("label").next().find(".add a").removeClass("disabled");
	}).blur(function() {
		jQuery(this).parents("label").next().find(".add a").addClass("disabled");
	});
	jQuery(".multimove .destination select").focus(function() {
		jQuery(this).parents("label").prev().find(".remove a").removeClass("disabled");
	}).blur(function() {
		jQuery(this).parents("label").prev().find(".remove a").addClass("disabled");
	});
	
    // Alphabetizing for when the contents of multi selects change
	jQuery("div.multimove ul.movers li.add, div.multimove ul.movers li.remove").click(function()
	{
		// Go through all the selects inside of the multimove class
		jQuery("div.multimove select").each(function()
		{
			// Set up an array for the select contents
			var selectContents = new Array();
			
			// Cycle through all of the options to get their values and text
			jQuery(this).children("option").each(function()
			{
				selectContents.push(jQuery(this).text()+"::"+jQuery(this).attr("value"));
			});
			
			// Sort the array
			selectContents.sort(alphanum);
			
			// Initialize the select options string
			selectString = "";
			
			// Build the string
			for(var index in selectContents)
			{
				var tempString = selectContents[index];
				var tempArray = tempString.split("::");
				selectString += "<option value=\""+tempArray[1]+"\">"+tempArray[0]+"</option>\n";
			}
			
			// Update the contents of the select with the new string
			jQuery(this).html(selectString);
		});
	});
	
	// JUMP TO INVALID FORM FIELDS
	jQuery("ul.invalid a").click( function() {
		var target = jQuery(this).attr("href");
		jQuery(target).focus();
	});
	
	// SELECT RADIO BUTTONS TIED TO DROP-DOWNS
	jQuery("label.radiocheck select").mousedown(function()
	{
		jQuery(this).focus();
        jQuery(this).parents("label").find("input").attr("checked","checked");
	});
	
	// SELECT RADIO BUTTONS TIED TO DROP-DOWNS
	jQuery("div.radiocheck select").mousedown(function()
	{
		jQuery(this).parents("div").children("span.radiocheck").children("input").attr("checked","checked");
	});
	
	jQuery("label.req span.label, p.req, span.req").append(" *");
});