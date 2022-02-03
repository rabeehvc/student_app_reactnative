import { retrieveEventSchedule, retrieveEventDetail, submitEventCheckpointForStudent } from '../wrappers/axiosWrapper';
import { checkJWTIsValid } from '../utilities/authUtilities';
import moment from 'moment';

class EventScheduleService {
    constructor() {
        this.returnObject = {};
        this.responseData = {};
    }

    async performRetrieveEventScheduleRequest(sessionToken) {
        try {
            // Make request via wrapper
            const response = await retrieveEventSchedule(sessionToken);          
            // Check the validity of the data
            if (response.data === undefined || response.data == null || response.data === '') {
                this.returnObject.error = 'Unable to retrieve event schedule data.';
                return this.returnObject;
            }
            this.responseData = response.data; // Assign response data to class variable
            this.returnObject.JWTIsValid = checkJWTIsValid(this.responseData); // Determine if our JWT Session token is still valid
            if (!this.returnObject.JWTIsValid) { // If the JWT is no longer valid, we return immediately
                return this.returnObject;
            }          

            // Create array of { title: LOCATION DESCRIPTION, data: COURSE SECTIONS } that will be returned as schedule data
            const localEventData = [];
            this.responseData.events.forEach((event) => {
              var item = { eventName: event.eventName, eventDateTime: moment(event.eventDateTimeString), details: event, eventID: event.eventID };
              localEventData.push(item);
            });

            // Assign variables to return object before returning
            this.returnObject.eventData = localEventData;
            // this.returnObject.markingPeriodDisplay = this.responseData.markingPeriodDisplay;
            this.returnObject.status = this.responseData.status;
            return this.returnObject;
        } catch (responseError) {
            this.returnObject.error = responseError;           
            return this.returnObject;
        }
    }
    async performRetrieveEventDetailRequest(sessionToken, eventID) {
        try {
            // Make request via wrapper
            const response = await retrieveEventDetail(sessionToken, eventID);
            // Check the validity of the data
            if (response.data === undefined || response.data == null || response.data === '') {
                this.returnObject.error = 'Unable to retrieve event schedule data.';
                return this.returnObject;
            }
            this.responseData = response.data; // Assign response data to class variable
            this.returnObject.JWTIsValid = checkJWTIsValid(this.responseData); // Determine if our JWT Session token is still valid
            if (!this.returnObject.JWTIsValid) { // If the JWT is no longer valid, we return immediately
                return this.returnObject;
            }
            this.returnObject.eventDetail = this.responseData.eventDetail;
            this.returnObject.status = this.responseData.status;
            return this.returnObject;
        } catch (responseError) {
            this.returnObject.error = responseError;
            return this.returnObject;
        }
    }

    async performSubmitEventCheckpointForStudentRequest(sessionToken, dataObject ) {
      // try {
          // Make request via wrapper
          const response = await submitEventCheckpointForStudent(sessionToken, dataObject);
          // Check the validity of the data
          if (response.data === undefined || response.data == null || response.data === '') {
              this.returnObject.error = 'Unable to retrieve event data.';
              return this.returnObject;
          }
          this.responseData = response.data; // Assign response data to class variable
          this.returnObject.JWTIsValid = checkJWTIsValid(this.responseData); // Determine if our JWT Session token is still valid
          if (!this.returnObject.JWTIsValid) { // If the JWT is no longer valid, we return immediately
              return this.returnObject;
          }
          this.returnObject.eventDetail = this.responseData.eventDetail;
          this.returnObject.status = this.responseData.status;
          return this.returnObject;
      // } catch (responseError) {
      //     this.returnObject.error = responseError;
      //     return this.returnObject;
      // }
    }
}

export default EventScheduleService;
