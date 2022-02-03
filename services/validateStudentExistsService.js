import { validateStudentExists } from '../wrappers/axiosWrapper';
import { checkJWTIsValid } from '../utilities/authUtilities';

class ValidateStudentExistsService {
    constructor() {
        this.returnObject = {};
        this.responseData = {};
    }

    async retrieveStudentExists(sessionToken, studentID) {
        try {
            // Make request via wrapper
            const response = await validateStudentExists(sessionToken, studentID.trim());

            this.responseData = response.data;
            // Check the validity of the data
            if (response.data === undefined || response.data == null || response.data === '') {
                this.returnObject.error = 'Please make sure your device is connected to the internet.';
                return this.returnObject;
            }

            this.returnObject.JWTIsValid = checkJWTIsValid(this.responseData); // Determine if our JWT Session token is still valid
            if (!this.returnObject.JWTIsValid) { // If the JWT is no longer valid, we return immediately
                return this.returnObject;
            }

            this.returnObject.status = this.responseData.status;
            this.returnObject.message = this.responseData.message;

            return this.returnObject;
        } catch (responseError) {
            this.returnObject.error = responseError;
            return this.returnObject;
        }
    }
}

export default ValidateStudentExistsService;
