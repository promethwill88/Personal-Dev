({
	clickCreateItem: function(component, event, helper) {
		let validItem = component.find('campingform').reduce(function (validSoFar, inputCmp) {
            //Displays error messages for invalid fields
            inputCmp.showHelpMessageIfInvalid();
            return validSoFar && inputCmp.get('v.validity').valid;
    	}, true);
        // If we pass error checking, do some real work
        if(validItem) {
            // Create the new item
            let newItem = component.get("v.newItem");
            console.log("Create Item: " + JSON.stringify(newItem));
            
            let theItems = component.get("v.items");
        
            // Copy the item to a new object
            // THIS IS A DISGUSTING, TEMPORARY HACK
            let Item = JSON.parse(JSON.stringify(theItems));
            console.log("Items before 'create': " + JSON.stringify(theItems));
            theItems.push(Item);
            component.set("v.items", theItems);  
            console.log("Items after 'create': " + JSON.stringify(theItems));
            component.set("v.newItem", { 'sobjectType': 'Camping_Item__c',
                                         'Name': '','Quantity__c': 0,
										 'Price__c': 0,
                                         'Packed__c': false });
        }
	}
})