'use strict';



const csvFilePath= 'baseutf8-leao.csv'
const fs = require('fs')
const csv=require('csvtojson')
csv({
    delimiter: "auto"
})
.fromFile(csvFilePath)
.then((osList)=>{
    let scriptsDnOs= '';
    let scriptsOsB2b = '';
   
    osList.forEach(os => {
        scriptsDnOs += `insert into dn_os(origem, id, empresa_id, xid, seguradora_sinistro, cli__pessoa__nome, cli__cpf, osstatus__inicio, interacao__inicio, item__descricao, servico_id,servico__xid)
        values ('B2B','${os.code}', '1', '${os.code}', '${os.claim}', '${os.name}', '${os.document}', '${os.issueDate}', '${os.issueDate}', '${os.model}', 32, 'OUT');`
   
        os.item = {'manufacturer': os.manufacturer, 'model': os.model};
        os.complaint = os.complaint.trim();
        os.customer = {
            'name': os.name,
            'email': os.email,
            'phones': [os.phones1, os.phones2, os.phones3],
            'document': os.document,
            'address': {
                "zipCode": os.zipCode,
                "number": os.number,
                "neighborhood": os.neighborhood,
                "street": os.street,
                "additionalInformation": os.additionalInformation,
                "city": os.city,
                "state": os.state
            }
        }

        os.contract = {
            "axaPlan" : os.axaPlan,
            "certificate" : os.certificate,
            "code" : os.code,
            "coverage" : os.coverage,
            "endTerm" : os.endTerm,
            "issueDate" : os.issueDate,
            "itemCode" : null,
            "lmi" : os.lmi,
            "policy" : os.policy,
            "segment" : os.segment,
            "smallSized" : os.smallSized,
            "startTerm" : os.startTerm,
            "status" : null
        }

        os.charges = [{
            "amount": os.amount,
            "chargeAttempts" : null,
            "createdAt": null,
            "dueAt": null,
            "emission": os.emission,
            "expirationDate": os.expirationDate,
            "status": os.status,
            "type": os.type

        }]
        
        delete os.model,
        delete os.state,
        delete os.city,
        delete os.additionalInformation,
        delete os.street,
        delete os.neighborhood,
        delete os.number,
        delete os.zipCode,
        delete os.document,
        delete os.phones1,
        delete os.phones2,
        delete os.phones3,
        delete os.phones4,
        delete os.phones5,
        delete os.email,
        delete os.name

        scriptsOsB2b += `insert into os_b2b (os_b2b, dados ) values ('${os.code}' , '${JSON.stringify(os)}');`
        console.log(JSON.stringify(os));
    });

    fs.writeFile('scriptsOsB2b.txt', scriptsOsB2b, 'UTF-8', (err, data) => {
        if(err)
            console.log(err)
        console.log(data)
    });

    fs.writeFile('scriptsDnOS.txt', scriptsDnOs, 'UTF-8', (err, data) => {
        if(err)
            console.log(err)
        console.log(data)
    });
})