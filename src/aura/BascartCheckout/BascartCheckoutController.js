/**
 * Created by willfong on 12/4/19.
 */

({

    listenApplicationEvent : function(cmp, event, helper) {
        console.log("listenApplicationEvent");

        var selDataObj = event.getParams("selectedProducts");
        console.log("selDataObj " + JSON.stringify(selDataObj));
        console.log("selDataObj.length " + selDataObj.selectedProducts.length);

        var productsToInsert = [];
        var alreadyInserted = cmp.get("v.alreadyInsertedProductList");
        console.log("EVENT 2 v.alreadyInserted " + cmp.get("v.alreadyInsertedProductList").length);

        if(alreadyInserted.length > 0) {	// Handles subsequent product inserts
            console.log("SUBSEQUENT CLICKS alreadyInserted.length > 0");

            for(var i = 0; i < selDataObj.selectedProducts.length; i++) {
                alreadyInserted.push(selDataObj.selectedProducts[i]);
                console.log("EVENT 2 LOOP alreadyInserted[" + [i] + "] ");
            }
            console.log("EVENT 2 AFTER LOOP alreadyInserted.length " + alreadyInserted.length);
            cmp.set("v.selectedProductObjectList", alreadyInserted);

        } else {	// Handles first product inserts
            console.log("FIRST CLICK alreadyInserted.length === 0");

            for(var i = 0; i < selDataObj.selectedProducts.length; i++) {
                productsToInsert.push(selDataObj.selectedProducts[i]);
                console.log("productsToInsert.length " + productsToInsert.length);
            }
            cmp.set("v.selectedProductObjectList", productsToInsert);
            console.log("EVENT 1 v.selectedProductObjectList " + JSON.stringify(cmp.get("v.selectedProductObjectList")));
            console.log("EVENT 1 v.selectedProductObjectList " + cmp.get("v.selectedProductObjectList").length);

            cmp.set("v.alreadyInsertedProductList", productsToInsert);
            console.log("EVENT 1 v.alreadyInserted " + JSON.stringify(cmp.get("v.alreadyInsertedProductList")));
            console.log("EVENT 1 v.alreadyInserted " + cmp.get("v.alreadyInsertedProductList").length);
        }
    },

    removeProductRow : function(cmp, event, helper) {
        console.log("removeProductRow");

        var rowIndex = event.currentTarget.id; // Find element attribute Id
        console.log("index " + rowIndex);

        var allRowsList = cmp.get("v.selectedProductObjectList");
        console.log("allRowsList " + JSON.stringify(allRowsList));
        console.log("allRowsList.length " + allRowsList.length);

        allRowsList.splice(rowIndex, 1); // Remove 1 element from rowIndex element i (see markup)
        console.log("AFTER SPLICE allRowsList " + JSON.stringify(allRowsList));
        console.log("AFTER SPLICE allRowsList.length " + allRowsList.length);

        // updates array attributes for listenApplicationEvent above
        cmp.set("v.alreadyInsertedProductList", allRowsList);
        cmp.set("v.selectedProductObjectList", allRowsList);
    },

    insertOli : function(cmp, event, helper) {
        console.log("insertOli");

        var selectedProducts = JSON.stringify(cmp.get("v.selectedProductObjectList")); // Stringify all selected products
        console.log("selectedProducts " + selectedProducts);

        var oppId = cmp.get("v.oppId"); // Get Opp record Id
        console.log("oppId " + oppId);

        var suggestedCaulkColor = cmp.get("v.suggestedCaulkColor");
        var windowsOpeningsUnderConstruction = cmp.get("v.windowsOpeningsUnderConstruction");
        var additionalMaterialsNecessary = cmp.get("v.additionalMaterialsNecessary");
        var windowTreatmentsOriginalPosition = cmp.get("v.windowTreatmentsOriginalPosition");
        var materialFitElevator = cmp.get("v.materialFitElevator");
        var materialFitStairwell = cmp.get("v.materialFitStairwell");
        var technicians = cmp.get("v.technicians");
        var hours = cmp.get("v.hours");
        var clientPresent = cmp.get("v.clientPresent");

        var action = cmp.get("c.insertProductObj"); // Get ProductPickerHandler.insertProductObj
        action.setParams({
            "oppId" : oppId, // Set oppId attribute as string
            "oliToInsertList" : selectedProducts, // Set oliToInsertList as string
            "caulk" : suggestedCaulkColor,
            "opening" : windowsOpeningsUnderConstruction,
            "material" : additionalMaterialsNecessary,
            "treatment" : windowTreatmentsOriginalPosition,
            "elevator" : materialFitElevator,
            "stairwell" : materialFitStairwell,
            "tech" : technicians,
            "hours" : hours,
            "client" : clientPresent
        });
        action.setCallback(this, function(res) {

            var state = res.getState();
            if(state === "SUCCESS") {
                console.log("Response SUCCESS");

                // Redirect back to Opportunity after timeout
                setTimeout(function () {
                    console.log("setTimeout");

                    var eUrl= $A.get("e.force:navigateToSObject");
                    eUrl.setParams({
                        "recordId": oppId
                    });
                    eUrl.fire();
                }, 3000);

            } else if(state === "ERROR") {
                var errors = res.getError();
                if(errors) {
                    if(errors[0] && errors[0].message) {
                        console.log("Error message: " + errors[0].message);
                        alert("Save Failed: " + errors[0].message);
                    }
                }
            } else {
                console.log("Unknown error");
                alert("Save Failed: Unknown error");
            }
        });
        $A.enqueueAction(action);
    },

    exitProductPicker : function(cmp, event, helper) {
        console.log("OpportunityProductSelectionCompController.exitProductPicker");

        var oppId = cmp.get("v.oppId");
        console.log("oppId " + oppId);

        var eUrl= $A.get("e.force:navigateToSObject");
        eUrl.setParams({
            "recordId": oppId
        });
        eUrl.fire();
    }

});