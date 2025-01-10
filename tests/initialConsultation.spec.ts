//import {test as it} from '@playwright/test'
 import {test as it} from '../pages/component/base.page'
import {updateEnvFile} from '../utilities/hooks/updateEnvFile'
it.describe('should first', () => { 
    it.beforeEach(async ({ familyFilePage }) => {
        await familyFilePage.open();
        await familyFilePage.createFamilyFile()
    })
    it('fill all fields to create FF',async({initialConsultation})=>{
        //await initialConsultation.createFamilyFile()
    })
    it('create FF for community',async({initialConsultation})=>{
        const communities = ["158213", "1441280","1407268"]
        let result = await initialConsultation.createLeadIdForCommunity(communities)
        // process.env.FAMILY_FILE  = result[0]
        // process.env.LEAD_ID  = result[1]
        const familyFileID  = result[0]
        const leadID  = result[1]
        console.log(process.env.FAMILY_FILE);
        console.log(process.env.LEAD_ID);
        // Define the target environment (e.g., "qa", "prod")
        const environment = process.env.ENV || 'qa'; // Default to 'qa' if not specified

        updateEnvFile({
            FAMILY_FILE: familyFileID || '',
            LEAD_ID: leadID || '',
        }, environment);
    })
 })