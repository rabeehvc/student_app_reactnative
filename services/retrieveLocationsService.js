import { retrieveLocations } from '../wrappers/axiosWrapper';
import { checkJWTIsValid } from '../utilities/authUtilities';

class RetrieveLocationsService {
    constructor() {
        this.returnObject = {};
        this.responseData = {};
    }

    async performLocationsRequest(sessionToken) {
        try {
            // Make request via wrapper
            const response = await retrieveLocations(sessionToken);

            // Check the validity of the data
            if (response.data === undefined || response.data == null || response.data === '') {
                this.returnObject.error = 'Unable to retrieve location data.';
                return this.returnObject;
            }

            this.responseData = response.data;

            this.returnObject.JWTIsValid = checkJWTIsValid(this.responseData); // Determine if our JWT Session token is still valid
            if (!this.returnObject.JWTIsValid) { // If the JWT is no longer valid, we return immediately
                return this.returnObject;
            }

            this.returnObject.locations = this.responseData.locations;
            this.returnObject.status = this.responseData.status;
            return this.returnObject;
        } catch (responseError) {
            this.returnObject.error = responseError;
            return this.returnObject;
        }
    }
}

export default RetrieveLocationsService;
