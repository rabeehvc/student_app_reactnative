import * as ApiConstants from './apiConstants';

const districtLookupPath = `${ApiConstants.apiBaseUrl}districts/districtLookup.cfm?validateRequest=1&staffApp=1&portalCode=`;
const districtListPath = `${ApiConstants.apiBaseUrl}districts/initialDistrictData.cfm?staffApp=1`;
const loginPath = `${ApiConstants.apiBaseUrl}staff/login.cfm`;
const retrieveLocationsPath = `${ApiConstants.apiBaseUrl}staff/retrieveLocations.cfm`;
const retrieveStudentListPath = `${ApiConstants.apiBaseUrl}staff/retrieveStudentList.cfm`;
const retrieveStudentsForCourseSectionPath = `${ApiConstants.apiBaseUrl}staff/retrieveStudentListForCourseSection.cfm`;
const retrieveStudentsForHomeroom = `${ApiConstants.apiBaseUrl}staff/retrieveStudentListForHomeroom.cfm`;
const retrieveStudentDataPath = `${ApiConstants.apiBaseUrl}staff/retrieveStudentData.cfm`;
const retrieveStudentCurrentlyScheduledInPath = `${ApiConstants.apiBaseUrl}staff/retrieveStudentCurrentlyScheduledIn.cfm`;
const retrieveStaffSchedulePath = `${ApiConstants.apiBaseUrl}staff/retrieveStaffSchedule.cfm`;
const retrieveDailyAttendanceDataForStudentPath = `${ApiConstants.apiBaseUrl}staff/retrieveDailyAttendanceDataForStudent.cfm`;
const retrieveDailyAttendanceDataForHomeroomPath = `${ApiConstants.apiBaseUrl}staff/retrieveDailyAttendanceDataForHomeroom.cfm`;
const retrievePeriodAttendanceDataPath = `${ApiConstants.apiBaseUrl}staff/retrievePeriodAttendanceData.cfm`;
const submitIndividualStudentDailyAttendanceTransactionPath = `${ApiConstants.apiBaseUrl}staff/submitIndividualStudentDailyAttendanceTransaction.cfm`;
const submitMassStudentPeriodAttendanceTransactionsPath = `${ApiConstants.apiBaseUrl}staff/submitMassPeriodAttendanceTransactions.cfm`;
const submitMassStudentDailyAttendanceTransactionsPath = `${ApiConstants.apiBaseUrl}staff/submitMassStudentDailyAttendanceTransactions.cfm`;
const retrieveStudentContactsPath = `${ApiConstants.apiBaseUrl}staff/retrieveStudentContacts.cfm`;
const retrieveDisciplineFormDataPath = `${ApiConstants.apiBaseUrl}staff/retrieveDisciplineFormData.cfm`;
const addDisciplineEntryPath = `${ApiConstants.apiBaseUrl}staff/addDisciplineEntry.cfm`;
const retrieveStaffHeadlines = `${ApiConstants.apiBaseUrl}staff/retrieveStaffMobileAppHeadlinesByLocationID.cfm?districtid=`;
const checkIfStudentExistsPath = `${ApiConstants.apiBaseUrl}staff/checkIfStudentExists.cfm?studentid=`;
const getEventSchedulePath = `${ApiConstants.apiBaseUrl}staff/retrieveEventList.cfm`;
const getEventDetailPath = `${ApiConstants.apiBaseUrl}staff/retrieveEventDetail.cfm`;
const submitEventCheckpointForStudentPath = `${ApiConstants.apiBaseUrl}staff/submitEventCheckpointForStudent.cfm`;
const getStudentScheduleDetailPath = `${ApiConstants.apiBaseUrl}staff/retrieveStudentSchedule.cfm`;

const getDistrictLookupEndpoint = (districtCode) => {
    const districtLookupEndpoint = districtLookupPath + districtCode;
    return districtLookupEndpoint;
};
const getDistrictListEndpoint = () => districtListPath;
const getLoginEndpoint = () => loginPath;
const getLocationsEndpoint = () => retrieveLocationsPath;
const getStudentListEndpoint = () => retrieveStudentListPath;
const getStudentsForCourseSectionEndpoint = () => retrieveStudentsForCourseSectionPath;
const getStudentsForHomeroomEndpoint = () => retrieveStudentsForHomeroom;
const getStudentDataEndpoint = () => retrieveStudentDataPath;
const getStudentCurrentlyScheduledInEndpoint = () => retrieveStudentCurrentlyScheduledInPath;
const getStaffScheduleEndpoint = () => retrieveStaffSchedulePath;
const getEventScheduleEndpoint = () => getEventSchedulePath;
const getEventDetailEndpoint = () => getEventDetailPath;
const getDailyAttendanceDataForStudentEndpoint = () => retrieveDailyAttendanceDataForStudentPath;
const getDailyAttendanceDataForHomeroomEndpoint = () => retrieveDailyAttendanceDataForHomeroomPath;
const getPeriodAttendanceDataEndpoint = () => retrievePeriodAttendanceDataPath;
const getIndividualStudentDailyAttenanceTransactionEndpoint = () => submitIndividualStudentDailyAttendanceTransactionPath;
const getMassStudentPeriodAttendanceTransactionsEndpoint = () => submitMassStudentPeriodAttendanceTransactionsPath;
const getMassStudentDailyAttendanceTransactionsEndpoint = () => submitMassStudentDailyAttendanceTransactionsPath;
const getStudentContactsEndpoint = () => retrieveStudentContactsPath;
const getDisciplineFormDataEndpoint = () => retrieveDisciplineFormDataPath;
const getAddDisciplineEntryEndpoint = () => addDisciplineEntryPath;
const getSubmitEventCheckpointForStudentEndpoint = () => submitEventCheckpointForStudentPath;
const getStaffHeadlinesEndpoint = districtID => retrieveStaffHeadlines + districtID;
const getStudentExistsEndpoint = (studentid) => {
    const studentExistsEndpoint = checkIfStudentExistsPath + studentid;
    return studentExistsEndpoint;
}
const getStudentScheduleEndpoint = () => getStudentScheduleDetailPath;


export {
    getDistrictLookupEndpoint,
    getDistrictListEndpoint,
    getLoginEndpoint,
    getLocationsEndpoint,
    getStudentListEndpoint,
    getStudentsForCourseSectionEndpoint,
    getStudentsForHomeroomEndpoint,
    getStudentDataEndpoint,
    getStudentCurrentlyScheduledInEndpoint,
    getStaffScheduleEndpoint,
    getDailyAttendanceDataForStudentEndpoint,
    getDailyAttendanceDataForHomeroomEndpoint,
    getPeriodAttendanceDataEndpoint,
    getIndividualStudentDailyAttenanceTransactionEndpoint,
    getMassStudentPeriodAttendanceTransactionsEndpoint,
    getMassStudentDailyAttendanceTransactionsEndpoint,
    getStudentContactsEndpoint,
    getDisciplineFormDataEndpoint,
    getAddDisciplineEntryEndpoint,
    getStaffHeadlinesEndpoint,
    getStudentExistsEndpoint,
    getEventScheduleEndpoint,
    getEventDetailEndpoint,
    getSubmitEventCheckpointForStudentEndpoint,
    getStudentScheduleEndpoint
};
