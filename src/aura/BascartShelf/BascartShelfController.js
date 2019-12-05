/**
 * Created by willfong on 12/4/19.
 */

({

    init : function(cmp, event, helper) {
        console.log("init");

        var action = cmp.get("c.getProductObj");
        action.setParams({});
        action.setCallback(this, function(res) {

            var state = res.getState();
            if(state === "SUCCESS") {
                var dataObj = res.getReturnValue();
                cmp.set("v.productObjectList", dataObj.productObjList);

                /*cmp.set("v.oppObj", dataObj.opp);*/

                console.log("# of Products Returned " + dataObj.productObjList.length);

            } else if(state === "ERROR") {
                var errors = res.getError();
                if(errors) {
                    if(errors[0] && errors[0].message) {
                        console.log("Error message: " + errors[0].message);
                    }
                }
            } else {
                console.log("Unknown error");
            }
        });
        $A.enqueueAction(action);
    },

    handleClick : function(cmp, event, helper) {
        console.log("handleClick");

        var pId = event.getSource().get("v.value");
        var alreadySelProducts = cmp.get("v.selectedProductList");
        var currentSelProducts = [];
        var alreadySelected = false;

        if(alreadySelProducts.length > 0) {
            console.log("alreadySelProducts.length > 0");
            console.log("alreadySelProducts " + JSON.stringify(alreadySelProducts) + " ADDING/REMOVING " + JSON.stringify(pId));

            for (var i = 0; i < alreadySelProducts.length; i++) {
                if(alreadySelProducts[i] === pId) {
                    console.log("if(alreadySelProducts[i] === pId) " + i);
                    alreadySelected = true;
                } else {
                    console.log("if(alreadySelProducts[i] !== pId) " + i);
                }
            }
        } else {
            console.log("alreadySelProducts.length === 0"); // CL
        }

        if(alreadySelected === true) {
            console.log("alreadySelected === true"); // CL
            console.log("alreadySelProducts " + JSON.stringify(alreadySelProducts));

            for(var i = 0; i < alreadySelProducts.length; i++) {
                if(pId !== alreadySelProducts[i]) {
                    console.log("if(pId !== alreadySelProducts[i] " + i);
                    currentSelProducts.push(alreadySelProducts[i]);
                    console.log("currentSelProducts.push(alreadySelProducts[i])");

                } else {
                    console.log("if(pId === alreadySelProducts[i] " + i);
                }
                cmp.set("v.selectedProductList", currentSelProducts);
            }
            console.log("currentSelProducts " + JSON.stringify(currentSelProducts));
            console.log("currentSelProducts.length " + currentSelProducts.length);

        } else {
            console.log("alreadySelected === false"); // CL
            alreadySelProducts.push(pId);
            console.log("alreadySelProducts " + JSON.stringify(alreadySelProducts));
            console.log("alreadySelProducts.length " + alreadySelProducts.length);

            cmp.set("v.selectedProductList", alreadySelProducts);
        }
    },

    exitProductPicker : function(cmp, event, helper) {
        console.log("ProductPickerComp.exitProductPicker");

        var oppId = cmp.get("v.oppId");
        console.log("oppId " + oppId);

        var eUrl= $A.get("e.force:navigateToSObject");
        eUrl.setParams({
            "recordId": oppId
        });
        eUrl.fire();

    },

    fireApplicationEvent : function(cmp, event, helper) {
        console.log("fireApplicationEvent");

        var appEvent = $A.get("e.c:BascartAppEvent");
        var selectedProducts = cmp.get("v.selectedProductList");
        console.log("selectedProducts "  + JSON.stringify(selectedProducts));
        console.log("selectedProducts.length "  + selectedProducts.length);

        appEvent.setParams({
            "selectedProducts" : selectedProducts
        });

        appEvent.fire();

        // Uncheck all checkboxes
        var checkboxes = cmp.find("boxPack");
        for(var i = 0; i < checkboxes.length; i++) {
            checkboxes[i].set("v.checked", false);
        }

        // Empty selectedProductList, reset for adding additional products
        var emptyArr = [];
        cmp.set("v.selectedProductList", emptyArr);
        console.log(cmp.get("v.selectedProductList"));
    }

});