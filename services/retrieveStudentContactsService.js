import { retrieveStudentContacts } from '../wrappers/axiosWrapper';
import { checkJWTIsValid } from '../utilities/authUtilities';

class RetrieveStudentContactsService {
    constructor() {
        this.returnObject = {};
        this.responseData = {};
    }

    async performStudentContactsRequest(sessionToken, studentID) {
        try {
            // Make request via wrapper
            const response = await retrieveStudentContacts(sessionToken, studentID);

            // Check the validity of the data
            if (response.data === undefined || response.data == null || response.data === '') {
                this.returnObject.error = 'Unable to retrieve student contacts data.';
                return this.returnObject;
            }

            this.responseData = response.data;

            this.returnObject.JWTIsValid = checkJWTIsValid(this.responseData); // Determine if our JWT Session token is still valid
            if (!this.returnObject.JWTIsValid) { // If the JWT is no longer valid, we return immediately
                return this.returnObject;
            }

            this.returnObject.contacts = this.responseData.contacts;
            this.returnObject.status = this.responseData.status;
            return this.returnObject;
        } catch (responseError) {
            this.returnObject.error = responseError;
            return this.returnObject;
        }
    }
}

export default RetrieveStudentContactsService;
