import { retrieveStudentSchedule } from '../wrappers/axiosWrapper';
import { checkJWTIsValid } from '../utilities/authUtilities';

class RetrieveStudentScheduleService {
    constructor() {
        this.returnObject = {};
        this.responseData = {};
    }

    async performStudentScheduleRequest(sessionToken, studentID) {
        try {
            // Make request via wrapper
            const response = await retrieveStudentSchedule(sessionToken, studentID);           
            // Check the validity of the data
            if (response.data === undefined || response.data == null || response.data === '') {
                this.returnObject.error = 'Unable to retrieve student schedule data.';
                return this.returnObject;
            }

            this.responseData = response.data;

            this.returnObject.JWTIsValid = checkJWTIsValid(this.responseData); // Determine if our JWT Session token is still valid
            if (!this.returnObject.JWTIsValid) { // If the JWT is no longer valid, we return immediately
                return this.returnObject;
            }
            this.returnObject.scheduleData = this.responseData.studentschedule;
            this.returnObject.periodData = this.responseData.periods;           
            this.returnObject.periodOrder = this.responseData.periodorder.map( function(i) { return i.toString() });
            this.returnObject.currentDay = this.responseData.currentday;
            this.returnObject.status = this.responseData.status;
            return this.returnObject;
        } catch (responseError) {
            this.returnObject.error = responseError;
            return this.returnObject;
        }
    }
}

export default RetrieveStudentScheduleService;
