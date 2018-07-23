@RestResource(urlMapping='/pinImage/*')
global class WEBSERVICE_uploadImage
   {
@HttpPost
       global static String uploadImage(String parentId, String attachmentId, String fileName, String contentType, String base64BlobValue){
        if(parentId != '' && (attachmentId == '' || attachmentId == null)){
            Attachment att = new Attachment(
                ParentId = parentId,
                Body = EncodingUtil.Base64Decode(base64BlobValue),
                Name = fileName,
                ContentType = contentType
            );
            insert att;
			Pin__c pin = [select Id, PinImage__c from Pin__c where Id = :parentId LIMIT 1];
                if(pin != null){
                    pin.PinImage__c = 'true';
                    update pin;
                }
            return att.Id;
        }else{
            for(Attachment attachment : [select Id, Body from Attachment where Id = :attachmentId]){
                update new Attachment(Id = attachmentId, Body = EncodingUtil.Base64Decode(EncodingUtil.Base64Encode(attachment.Body) + base64BlobValue));
            }
            return attachmentId;
        }
    }

    @HttpPut
    global static List<Attachment> getPinImages(String pinId){
        try{
            List<Attachment> attachments = new List<Attachment>();
            for(Attachment attachment : [SELECT Body,BodyLength,ContentType,CreatedById,CreatedDate,description,Id,LastModifiedDate,Name,ParentId FROM Attachment WHERE ParentId = :pinId]){
           		attachments.add(new Attachment(description = EncodingUtil.base64Encode((attachment.Body)),
                                              Id = attachment.Id,
                                               ContentType = attachment.ContentType,
                                               ParentId = attachment.ParentId,
                                               Name = attachment.Name
                                              ));
            }
            return attachments;
        }catch(Exception ex){
            System.debug('Exception is ' + ex.getMessage());
            throw ex;
        }
    }

 }