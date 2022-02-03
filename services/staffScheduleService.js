import { retrieveStaffSchedule } from '../wrappers/axiosWrapper';
import { checkJWTIsValid } from '../utilities/authUtilities';

class StaffScheduleService {
    constructor() {
        this.returnObject = {};
        this.responseData = {};
    }

    async performRetrieveStaffScheduleRequest(sessionToken) {
        try {
            // Make request via wrapper
            const response = await retrieveStaffSchedule(sessionToken);

            // Check the validity of the data
            if (response.data === undefined || response.data == null || response.data === '') {
                this.returnObject.error = 'Unable to retrieve staff schedule data.';
                return this.returnObject;
            }
            this.responseData = response.data; // Assign response data to class variable
            this.returnObject.JWTIsValid = checkJWTIsValid(this.responseData); // Determine if our JWT Session token is still valid
            if (!this.returnObject.JWTIsValid) { // If the JWT is no longer valid, we return immediately
                return this.returnObject;
            }

            // Create array of { title: LOCATION DESCRIPTION, data: COURSE SECTIONS } that will be returned as schedule data
            const localStaffScheduleArray = [];
            this.responseData.staffScheduleArray.forEach((location) => { // Loop over array of locations
                const localLocationScheduleArray = []; // Create array of course sections for this location
                location.data.forEach((courseSection) => { // Loop over array of course sections per location
                    const localCourseSection = {}; // local struct for course section

                    // Clean up values
                    const localLocationDescription = courseSection.LOCATIONDESCRIPTION.toString().trim();
                    const localLocationID = courseSection.LOCATIONID.toString().trim();
                    const localCurrentDayCode = location.currentDayCode.toString().trim();
                    const localCourseText = courseSection.COURSEID.toString().trim();
                    const localSectionText = courseSection.SECTIONID.toString().trim();
                    const localRoomText = courseSection.ROOMID.toString().trim();

                    // Assign values to local struct
                    localCourseSection.locationDescription = localLocationDescription;
                    localCourseSection.locationID = localLocationID;
                    localCourseSection.currentDayCode = localCurrentDayCode;
                    localCourseSection.courseTitle = courseSection.COURSETITLE;
                    localCourseSection.courseSection = `(${localCourseText}/${localSectionText})`;
                    localCourseSection.roomID = localRoomText;
                    localCourseSection.isHomeroom = courseSection.ISHOMEROOM;
                    localCourseSection.altMondayCode = courseSection.ALTMONDAYCODE;
                    localCourseSection.mDisplay = courseSection.MDISPLAY;
                    localCourseSection.altTuesdayCode = courseSection.ALTTUESDAYCODE;
                    localCourseSection.tDisplay = courseSection.TDISPLAY;
                    localCourseSection.altWednesdayCode = courseSection.ALTWEDNESDAYCODE;
                    localCourseSection.wDisplay = courseSection.WDISPLAY;
                    localCourseSection.altThursdayCode = courseSection.ALTTHURSDAYCODE;
                    localCourseSection.rDisplay = courseSection.RDISPLAY;
                    localCourseSection.altFridayCode = courseSection.ALTFRIDAYCODE;
                    localCourseSection.fDisplay = courseSection.FDISPLAY;
                    localCourseSection.altSaturdayCode = courseSection.ALTSATURDAYCODE;
                    localCourseSection.sDisplay = courseSection.SDISPLAY;
                    localCourseSection.altSundayCode = courseSection.ALTSUNDAYCODE;
                    localCourseSection.zDisplay = courseSection.ZDISPLAY;
                    localCourseSection.meetingTimeID = courseSection.MEETINGTIMEID;
                    localCourseSection.markingPeriods = courseSection.MARKINGPERIODS;
                    // Append local course section struct to array of course sections for this location
                    localLocationScheduleArray.push(localCourseSection);
                });
                // Create final struct with the location description string and course sections array for this location
                const localLocationScheduleStruct = { title: location.title, data: localLocationScheduleArray };
                // Add this finalized struct to array of { title: LOCATION DESCRIPTION, data: COURSE SECTIONS }
                localStaffScheduleArray.push(localLocationScheduleStruct);
            });

            // Assign variables to return object before returning
            this.returnObject.scheduleData = localStaffScheduleArray;
            this.returnObject.markingPeriodDisplay = this.responseData.markingPeriodDisplay;
            this.returnObject.status = this.responseData.status;
            return this.returnObject;
        } catch (responseError) {
            this.returnObject.error = responseError;
            return this.returnObject;
        }
    }
}

export default StaffScheduleService;
