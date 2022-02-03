import axios from 'axios';
import * as ApiEndpoints from '../constants/api-endpoints';

const submitDistrictCode = async (districtCode) => {
    try {
        const response = await axios.get(ApiEndpoints.getDistrictLookupEndpoint(districtCode));
        return response;
    } catch (responseError) {
        return responseError;
    }
};

const retrieveDistrictsList = async () => {
    try {
        const config = {
            headers: {
                Authorization: 'Basic RealITiOSApp',
            }
        };
        const response = await axios.post(ApiEndpoints.getDistrictListEndpoint(), {}, config);
        return response;
    } catch (responseError) {
        return responseError;
    }
};

const loginRequest = async (username, password, districtID) => {
    try {
        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);
        formData.append('districtID', districtID);

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        };
        const response = await axios.post(ApiEndpoints.getLoginEndpoint(), formData, config);
        return response;
    } catch (responseError) {
        return responseError;
    }
};

const retrieveLocations = async (sessionToken) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${sessionToken}`,
            }
        };
        const response = await axios.post(ApiEndpoints.getLocationsEndpoint(), {}, config);
        return response;
    } catch (error) {
        return error;
    }
};

const retrieveStudents = async (sessionToken, studentID, firstName, lastName, grade, locationID) => {
    try {
        const formData = new FormData();
        formData.append('studentID', studentID);
        formData.append('firstName', firstName);
        formData.append('lastName', lastName);
        formData.append('grade', grade);
        formData.append('locationID', locationID);

        const config = {
            headers: {
                Authorization: `Bearer ${sessionToken}`,
                'Content-Type': 'multipart/form-data',
            }
        };

        const response = await axios.post(ApiEndpoints.getStudentListEndpoint(), formData, config);
        return response;
    } catch (error) {
        return error;
    }
};

const retrieveStudentsForCourseSection = async (sessionToken, meetingTimeID) => {
    try {
        const formData = new FormData();
        formData.append('meetingTimeID', meetingTimeID);

        const config = {
            headers: {
                Authorization: `Bearer ${sessionToken}`,
                'Content-Type': 'multipart/form-data',
            }
        };

        const response = await axios.post(ApiEndpoints.getStudentsForCourseSectionEndpoint(), formData, config);
        return response;
    } catch (error) {
        return error;
    }
};

const retrieveStudentsForHomeroom = async (sessionToken, roomID, locationID) => {
    try {
        const formData = new FormData();
        formData.append('roomID', roomID);
        formData.append('locationID', locationID);

        const config = {
            headers: {
                Authorization: `Bearer ${sessionToken}`,
                'Content-Type': 'multipart/form-data',
            }
        };

        const response = await axios.post(ApiEndpoints.getStudentsForHomeroomEndpoint(), formData, config);
        return response;
    } catch (error) {
        return error;
    }
};

const retrieveStudentData = async (sessionToken, studentID) => {
    try {
        const formData = new FormData();
        formData.append('studentID', studentID);

        const config = {
            headers: {
                Authorization: `Bearer ${sessionToken}`,
                'Content-Type': 'multipart/form-data',
            }
        };

        const response = await axios.post(ApiEndpoints.getStudentDataEndpoint(), formData, config);
        return response;
    } catch (error) {
        return error;
    }
};

const retrieveStudentCurrentlyScheduledIn = async (sessionToken, studentID) => {
    try {
        const formData = new FormData();
        formData.append('studentID', studentID);

        const config = {
            headers: {
                Authorization: `Bearer ${sessionToken}`,
                'Content-Type': 'multipart/form-data',
            }
        };

        const response = await axios.post(ApiEndpoints.getStudentCurrentlyScheduledInEndpoint(), formData, config);
        return response;
    } catch (error) {
        return error;
    }
};

const retrieveStudentContacts = async (sessionToken, studentID) => {
    try {
        const formData = new FormData();
        formData.append('studentID', studentID);

        const config = {
            headers: {
                Authorization: `Bearer ${sessionToken}`,
                'Content-Type': 'multipart/form-data',
            }
        };

        const response = await axios.post(ApiEndpoints.getStudentContactsEndpoint(), formData, config);
        return response;
    } catch (error) {
        return error;
    }
};

const retrieveStudentSchedule = async (sessionToken, studentID) => {
    try {
      const formData = new FormData();
      formData.append('studentID', studentID);

      const config = {
          headers: {
              Authorization: `Bearer ${sessionToken}`,
              'Content-Type': 'multipart/form-data',
          }
      };

      const response = await axios.post(ApiEndpoints.getStudentScheduleEndpoint(), formData, config);
      return response;
    } catch (error) {
      return error;
    }
};

const retrieveStaffSchedule = async (sessionToken) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${sessionToken}`,
            }
        };
        const response = await axios.post(ApiEndpoints.getStaffScheduleEndpoint(), {}, config);
        return response;
    } catch (error) {
        return error;
    }
};

const retrieveEventSchedule = async (sessionToken) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${sessionToken}`,
            }
        };
        const response = await axios.post(ApiEndpoints.getEventScheduleEndpoint(), {}, config);
        return response;
    } catch (error) {
        return error;
    }
};

const retrieveEventDetail = async (sessionToken, eventID) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${sessionToken}`,
            }
        };
        const formData = new FormData();
        formData.append('eventID', eventID);
        const response = await axios.post(ApiEndpoints.getEventDetailEndpoint(), formData, config);
        return response;
    } catch (error) {
        return error;
    }
};

const submitEventCheckpointForStudent = async (sessionToken, dataObject) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${sessionToken}`,
            }
        };
        const formData = new FormData();
        for ( var key in dataObject ) {
          formData.append(key, dataObject[key]);
        }       
        const response = await axios.post(ApiEndpoints.getSubmitEventCheckpointForStudentEndpoint(), formData, config);      
        return response;
    } catch (error) {
        return error;
    }
};

const retrieveDailyAttendanceDataForStudent = async (sessionToken, studentID) => {
    try {
        const formData = new FormData();
        formData.append('studentID', studentID);

        const config = {
            headers: {
                Authorization: `Bearer ${sessionToken}`,
            }
        };
        const response = await axios.post(ApiEndpoints.getDailyAttendanceDataForStudentEndpoint(), formData, config);
        return response;
    } catch (error) {
        return error;
    }
};

const retrieveDailyAttendanceDataForHomeroom = async (sessionToken, locationID, roomID) => {
    try {
        const formData = new FormData();
        formData.append('locationID', locationID);
        formData.append('roomID', roomID);

        const config = {
            headers: {
                Authorization: `Bearer ${sessionToken}`,
                'Content-Type': 'multipart/form-data',
            }
        };
        const response = await axios.post(ApiEndpoints.getDailyAttendanceDataForHomeroomEndpoint(), formData, config);
        return response;
    } catch (error) {
        return error;
    }
};

const retrievePeriodAttendanceData = async (sessionToken, meetingTimeID, locationID) => {
    try {
        const formData = new FormData();
        formData.append('meetingTimeID', meetingTimeID);
        formData.append('locationID', locationID);

        const config = {
            headers: {
                Authorization: `Bearer ${sessionToken}`,
                'Content-Type': 'multipart/form-data',
            }
        };

        const response = await axios.post(ApiEndpoints.getPeriodAttendanceDataEndpoint(), formData, config);
        return response;
    } catch (error) {
        return error;
    }
};

const submitIndividualStudentDailyAttendanceTransaction = async (
    sessionToken,
    studentID,
    transactionCode,
    transactionTime,
    transactionTimeAMPM,
    hours,
    comment
) => {
    try {
        const formData = new FormData();
        formData.append('studentID', studentID);
        formData.append('transactionCode', transactionCode);
        formData.append('transactionTime', transactionTime);
        formData.append('transactionTimeAMPM', transactionTimeAMPM);
        formData.append('hours', hours);
        formData.append('comment', comment);

        const config = {
            headers: {
                Authorization: `Bearer ${sessionToken}`,
                'Content-Type': 'multipart/form-data',
            }
        };

        const response = await axios.post(ApiEndpoints.getIndividualStudentDailyAttenanceTransactionEndpoint(), formData, config);
        return response;
    } catch (error) {
        return error;
    }
};

const submitMassStudentPeriodAttendanceTransactions = async (sessionToken, meetingTimeID, locationID, students) => {
    try {
        const formData = new FormData();
        const studentsJSON = JSON.stringify(students);
        formData.append('locationID', locationID);
        formData.append('meetingTimeID', meetingTimeID);
        formData.append('students', studentsJSON);

        const config = {
            headers: {
                Authorization: `Bearer ${sessionToken}`,
                'Content-Type': 'application/json',
            }
        };

        const response = await axios.post(ApiEndpoints.getMassStudentPeriodAttendanceTransactionsEndpoint(), formData, config);
        return response;
    } catch (error) {
        return error;
    }
};

const submitMassStudentDailyAttendanceTransactions = async (sessionToken, homeroomID, locationID, students) => {
    try {
        const formData = new FormData();
        const studentsJSON = JSON.stringify(students);
        formData.append('locationID', locationID);
        formData.append('homeroomID', homeroomID);
        formData.append('students', studentsJSON);

        const config = {
            headers: {
                Authorization: `Bearer ${sessionToken}`,
                'Content-Type': 'application/json',
            }
        };

        const response = await axios.post(ApiEndpoints.getMassStudentDailyAttendanceTransactionsEndpoint(), formData, config);
        return response;
    } catch (error) {
        return error;
    }
};

const retrieveDisciplineFormData = async (sessionToken, studentID) => {
    try {
        const formData = new FormData();
        formData.append('studentID', studentID);

        const config = {
            headers: {
                Authorization: `Bearer ${sessionToken}`,
                'Content-Type': 'multipart/form-data',
            }
        };

        const response = await axios.post(ApiEndpoints.getDisciplineFormDataEndpoint(), formData, config);
        return response;
    } catch (error) {
        return error;
    }
};

const addDisciplineEntry = async (sessionToken, studentID, incident, incidentDate, incidentTime, location, reportedBy, notes) => {
    try {
        const formData = new FormData();
        formData.append('studentID', studentID);
        formData.append('incident', incident);
        formData.append('incidentDate', incidentDate);
        formData.append('incidentTime', incidentTime);
        formData.append('location', location);
        formData.append('reportedBy', reportedBy);
        formData.append('notes', notes);

        const config = {
            headers: {
                Authorization: `Bearer ${sessionToken}`,
                'Content-Type': 'multipart/form-data',
            }
        };

        const response = await axios.post(ApiEndpoints.getAddDisciplineEntryEndpoint(), formData, config);
        return response;
    } catch (error) {
        return error;
    }
};

const retrieveStaffHeadlines = async (sessionToken, locationID, districtID, actualSchoolYear) => {
    try {
        const formData = new FormData();
        formData.append('locationid', locationID);
        formData.append('actualschoolyear', actualSchoolYear);

        const config = {
            headers: {
                Authorization: `Bearer ${sessionToken}`,
                'Content-Type': 'multipart/form-data',
            }
        };

        const response = await axios.post(ApiEndpoints.getStaffHeadlinesEndpoint(districtID), formData, config);
        return response;
    } catch (responseError) {
        return responseError;
    }
};

const validateStudentExists = async (sessionToken, studentid) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${sessionToken}`,
                'Content-Type': 'multipart/form-data',
            }
        };

        const response = await axios.get(ApiEndpoints.getStudentExistsEndpoint(studentid), config);
        return response;
    } catch (responseError) {
        return responseError;
    }
};

export {
    submitDistrictCode,
    retrieveDistrictsList,
    loginRequest,
    retrieveLocations,
    retrieveStudents,
    retrieveStudentsForCourseSection,
    retrieveStudentsForHomeroom,
    retrieveStudentData,
    retrieveStudentCurrentlyScheduledIn,
    retrieveStaffSchedule,
    retrieveEventSchedule,
    retrieveDailyAttendanceDataForStudent,
    retrieveDailyAttendanceDataForHomeroom,
    retrievePeriodAttendanceData,
    submitIndividualStudentDailyAttendanceTransaction,
    submitMassStudentPeriodAttendanceTransactions,
    submitMassStudentDailyAttendanceTransactions,
    retrieveStudentContacts,
    retrieveDisciplineFormData,
    addDisciplineEntry,
    retrieveStaffHeadlines,
    validateStudentExists,
    retrieveEventDetail,
    submitEventCheckpointForStudent,
    retrieveStudentSchedule,
};
