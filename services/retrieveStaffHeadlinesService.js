import { retrieveStaffHeadlines } from '../wrappers/axiosWrapper';

class retrieveStaffHeadlinesService {
    constructor() {
        this.returnObject = {};
        this.responseData = {};
    }

    async performStaffHeadlinesRequest(sessionToken, locationID, districtID, actualSchoolYear) {
        try {
            // Make request via wrapper
            const response = await retrieveStaffHeadlines(sessionToken, locationID, districtID, actualSchoolYear);

            // Check the validity of the data
            if (response.data === undefined || response.data == null || response.data === '') {
                this.returnObject.error = 'Unable to retrieve staff headlines data.';
                return this.returnObject;
            }

            this.responseData = response.data;
            
            this.returnObject = this.responseData;
            return this.returnObject;
        } catch (responseError) {
            this.returnObject.error = responseError;
            return this.returnObject;
        }
    }
}

export default retrieveStaffHeadlinesService;
