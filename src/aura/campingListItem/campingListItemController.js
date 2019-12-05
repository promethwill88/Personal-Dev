({
    packItem: function(component, event, helper) {
        let checkPack = component.get("v.item", true);
        checkPack.Packed__c = true;
		component.set("v.item", checkPack);
        let btnClick = event.getSource();
        btnClick.set("v.disabled", true);  
    }
})