/**
 * Created by willfong on 12/4/19.
 */

global class BascartController {

    @AuraEnabled public List<productObj> productObjList { get; set; }
    @AuraEnabled public Map<String, productObj> productObjMap { get; set; }

    global class productObj {
        @AuraEnabled public String productId;
        @AuraEnabled public String productName;
        @AuraEnabled public String productClass;
        @AuraEnabled public String bodyStyle;
        @AuraEnabled public String layout;
        @AuraEnabled public String exterior;
        @AuraEnabled public String interior;
        @AuraEnabled public Decimal quantity;
        @AuraEnabled public String notes;
    }

    @AuraEnabled /* Loads all Products on init */
    global static BascartController getProductObj(String oppId) {
        System.debug('BascartController.getProductObj HIT');

        Map<String, productObj> prodObjectMap = new Map<String, productObj>();
        BascartController dataObj = new BascartController();
        List<productObj> availableProductObjList = new List<productObj>();
        List<Product2> productList = [SELECT Id, Name, Class__c, Body_Style__c, Layout__c FROM Product2 WHERE IsActive = TRUE ORDER BY Name ASC];

        for(Product2 p : productList) {
            productObj pObj = new productObj();
            pObj.productId = p.Id;
            pObj.productName = p.Name;
            pObj.productClass = p.Class__c;
            pObj.bodyStyle = p.Body_Style__c;
            pObj.layout = p.Layout__c;
            prodObjectMap.put(p.Id, pObj);
            availableProductObjList.add(pObj);
        }
        dataObj.productObjList = availableProductObjList;
        dataObj.productObjMap = prodObjectMap;

        return dataObj;
    }

    @AuraEnabled /* Receives and inserts OLIs */
    global static BascartController insertProductObj(String oppId, String oliToInsertList) {
        System.debug('BascartController.insertProductObj HIT');
        System.debug('oppId ' + oppId);
        System.debug('oliToInsertList ' + oliToInsertList);

        List<productObj> pObjList = (List<productObj>)JSON.deserialize(oliToInsertList, List<productObj>.class);
        System.debug('Deserialized ' + pObjList);
        System.debug('Number of pObjList ' + pObjList.size());

        if(pObjList.size() > 0) { // Check if there are pObj

            List<String> selectedProductIds = new List<String>();
            Map<Integer, productObj> pObjMap = new Map<Integer, productObj>(); // Map Integer with productObj

            // Loop through pObjList, Add productId to Set and add to Map
            Integer j = 0;
            for(productObj pObj : pObjList) {
                selectedProductIds.add(pObj.productId);
                j++;
                pObjMap.put(j, pObj);
            }

            System.debug('selectedProductIds ' + selectedProductIds);
            System.debug('pObjMap ' + pObjMap);
            System.debug('pObjMap.size() ' + pObjMap.size());

            Pricebook2 stdPriceBook = [SELECT Id, Name FROM Pricebook2 WHERE IsStandard = TRUE LIMIT 1];
            System.debug('stdPriceBook ' + stdPriceBook);

            // Build list of PricebookEntry to create with Product2Ids from selectedProductIds
            List<PricebookEntry> pbeList = [SELECT Id, Product2Id, UnitPrice FROM PricebookEntry WHERE Pricebook2Id = :stdPriceBook.Id AND Product2Id IN :selectedProductIds];
            System.debug('pbeList ' + pbeList);
            System.debug('pbeList.size() ' + pbeList.size());

            List<OpportunityLineItem> oliCreate = new List<OpportunityLineItem>();

            // Insert OLI with selectedProducts
            Integer k = 0;
            for(String pId : selectedProductIds) {
                k++;
                for(PricebookEntry pbe : pbeList) {
                    if(pbe.Product2Id == pId) {
                        OpportunityLineItem oli = new OpportunityLineItem(
                                Product2Id = pbe.Product2Id,
                                PricebookEntryId = pbe.Id,
                                OpportunityId = oppId,
                                Quantity = pObjMap.get(k).quantity,
                                UnitPrice = pbe.UnitPrice,
                                Exterior__c = pObjMap.get(k).exterior,
                                Interior__c = pObjMap.get(k).interior,
                                Client_Notes__c = pObjMap.get(k).notes
                        );
                        oliCreate.add(oli);
                    }
                }
            }
            System.debug('oliCreate ' + oliCreate);
            System.debug('oliCreate.size() ' + oliCreate.size());

            try {
                insert oliCreate;
            } catch(Exception e) {
                System.debug('An exception occurred: ' + e.getMessage());
                throw new AuraHandledException(e.getMessage());
            }
        } else {
            System.debug('No OLI to insert - Opportunity not updated');
        }
        return null;
    }

}