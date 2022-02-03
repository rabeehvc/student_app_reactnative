import { retrieveDisciplineFormData } from '../wrappers/axiosWrapper';
import { checkJWTIsValid } from '../utilities/authUtilities';

class RetrieveDisciplineFormDataService {
    constructor() {
        this.returnObject = {};
        this.responseData = {};
    }

    async performDisciplineFormDataRequest(sessionToken, studentID) {
        try {
            // Make request via wrapper
            const response = await retrieveDisciplineFormData(sessionToken, studentID);

            // Check the validity of the data
            if (response.data === undefined || response.data == null || response.data === '') {
                this.returnObject.error = 'Unable to retrieve discipline form data.';
                return this.returnObject;
            }

            this.responseData = response.data;

            this.returnObject.JWTIsValid = checkJWTIsValid(this.responseData); // Determine if our JWT Session token is still valid
            if (!this.returnObject.JWTIsValid) { // If the JWT is no longer valid, we return immediately
                return this.returnObject;
            }

            this.returnObject.status = this.responseData.status;
            this.returnObject.incidents = this.responseData.incidents;
            this.returnObject.locations = this.responseData.locations;
            this.returnObject.reportedBy = this.responseData.reportedby;
            return this.returnObject;
        } catch (responseError) {
            this.returnObject.error = responseError;
            return this.returnObject;
        }
    }
}

export default RetrieveDisciplineFormDataService;
