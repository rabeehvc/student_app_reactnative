import {
  retrieveDailyAttendanceDataForStudent,
  retrieveDailyAttendanceDataForHomeroom,
  submitIndividualStudentDailyAttendanceTransaction,
  submitMassStudentDailyAttendanceTransactions,
  retrievePeriodAttendanceData,
  submitMassStudentPeriodAttendanceTransactions,
} from "../wrappers/axiosWrapper";
import { checkJWTIsValid } from "../utilities/authUtilities";
import { checkUserPermissionResponse } from "../utilities/permissionsUtilities";

class AttendanceService {
  constructor() {
    this.returnObject = {};
    this.responseData = {};
  }

  // DAILY ATTENDANCE DATA - INDIVIDUAL STUDENT
  async performRetrieveDailyAttendanceDataForStudentRequest(
    sessionToken,
    studentID
  ) {
    try {
      // Make request via wrapper
      const response = await retrieveDailyAttendanceDataForStudent(
        sessionToken,
        studentID
      );

      // Check the validity of the data
      if (
        response.data === undefined ||
        response.data == null ||
        response.data === ""
      ) {
        this.returnObject.error = "Unable to retrieve attendance codes.";
        return this.returnObject;
      }

      this.responseData = response.data;

      this.returnObject.JWTIsValid = checkJWTIsValid(this.responseData); // Determine if our JWT Session token is still valid
      if (!this.returnObject.JWTIsValid) {
        // If the JWT is no longer valid, we return immediately
        return this.returnObject;
      }

      this.returnObject.attendanceCodes = this.responseData.attendanceCodes;
      this.returnObject.currentDailyAttendance =
        this.responseData.currentDailyAttendance;
      this.returnObject.status = this.responseData.status;
      return this.returnObject;
    } catch (responseError) {
      this.returnObject.error = responseError;
      return this.returnObject;
    }
  }

  // DAILY ATTENDANCE DATA - HOMEROOM MASS ENTRY
  async performRetrieveDailyAttendanceDataForHomeroomRequest(
    sessionToken,
    locationID,
    roomID
  ) {
    try {
      // Make request via wrapper
      const response = await retrieveDailyAttendanceDataForHomeroom(
        sessionToken,
        locationID,
        roomID
      );

      // Check the validity of the data
      if (
        response.data === undefined ||
        response.data == null ||
        response.data === ""
      ) {
        this.returnObject.error = "Unable to retrieve attendance codes.";
        return this.returnObject;
      }

      this.responseData = response.data;

      this.returnObject.JWTIsValid = checkJWTIsValid(this.responseData); // Determine if our JWT Session token is still valid
      if (!this.returnObject.JWTIsValid) {
        // If the JWT is no longer valid, we return immediately
        return this.returnObject;
      }

      this.returnObject.dailyAttendanceCodes =
        this.responseData.attendanceCodes;
      this.returnObject.students = this.responseData.students;
      this.returnObject.status = this.responseData.status;
      this.returnObject.message = this.responseData.message;
      return this.returnObject;
    } catch (responseError) {
      this.returnObject.error = responseError;
      return this.returnObject;
    }
  }

  // DAILY ATTENDANCE SUBMISSION - INDIVIDUAL
  async performSubmitIndividualDailyAttendanceTransaction(
    sessionToken,
    studentID,
    transactionCode,
    transactionTime,
    transactionTimeAMPM,
    hours,
    comment
  ) {
    try {
      // Make request via wrapper
      const response = await submitIndividualStudentDailyAttendanceTransaction(
        sessionToken,
        studentID,
        transactionCode,
        transactionTime,
        transactionTimeAMPM,
        hours,
        comment
      );

      // Check the validity of the data
      if (
        response.data === undefined ||
        response.data == null ||
        response.data === ""
      ) {
        this.returnObject.error = "Unable to submit attendance record.";
        return this.returnObject;
      }

      this.responseData = response.data;

      this.returnObject.JWTIsValid = checkJWTIsValid(this.responseData); // Determine if our JWT Session token is still valid
      // Determine if user was granted permission from the server for this action
      this.returnObject.hasPermission = checkUserPermissionResponse(
        this.responseData
      );
      // If the JWT is no longer valid or if we were denied permission, we return immediately
      if (!this.returnObject.JWTIsValid || !this.returnObject.hasPermission) {
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

  // DAILY ATTENDANCE SUBMISSION - MASS / HOMEROOM
  async performSubmitMassDailyAttendanceTransaction(
    sessionToken,
    homeroomID,
    locationID,
    students
  ) {
    try {
      // Make request via wrapper
      const response = await submitMassStudentDailyAttendanceTransactions(
        sessionToken,
        homeroomID,
        locationID,
        students
      );

      // Check the validity of the data
      if (
        response.data === undefined ||
        response.data == null ||
        response.data === ""
      ) {
        this.returnObject.error = "Unable to submit daily attendance records.";
        return this.returnObject;
      }

      this.responseData = response.data;

      this.returnObject.JWTIsValid = checkJWTIsValid(this.responseData); // Determine if our JWT Session token is still valid
      // Determine if user was granted permission from the server for this action
      this.returnObject.hasPermission = checkUserPermissionResponse(
        this.responseData
      );
      // If the JWT is no longer valid or if we were denied permission, we return immediately
      if (!this.returnObject.JWTIsValid || !this.returnObject.hasPermission) {
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

  // PERIOD ATTENDANCE DATA
  async performRetrievePeriodAttendanceDataRequest(
    sessionToken,
    meetingTimeID,
    locationID
  ) {
    try {
      // Make request via wrapper
      const response = await retrievePeriodAttendanceData(
        sessionToken,
        meetingTimeID,
        locationID
      );

      // Check the validity of the data
      if (
        response.data === undefined ||
        response.data == null ||
        response.data === ""
      ) {
        this.returnObject.error = "Unable to retrieve attendance codes.";
        return this.returnObject;
      }

      this.responseData = response.data;

      this.returnObject.JWTIsValid = checkJWTIsValid(this.responseData); // Determine if our JWT Session token is still valid
      if (!this.returnObject.JWTIsValid) {
        // If the JWT is no longer valid, we return immediately
        return this.returnObject;
      }

      this.returnObject.periodAttendanceCodes =
        this.responseData.attendanceCodes;
      this.returnObject.students = this.responseData.students;
      this.returnObject.status = this.responseData.status;
      this.returnObject.message = this.responseData.message;
      return this.returnObject;
    } catch (responseError) {
      this.returnObject.error = responseError;
      return this.returnObject;
    }
  }

  // PERIOD ATTENDANCE SUBMISSION
  async performSubmitMassPeriodAttendanceTransactions(
    sessionToken,
    meetingTimeID,
    locationID,
    students
  ) {
    try {
      // Make request via wrapper
      const response = await submitMassStudentPeriodAttendanceTransactions(
        sessionToken,
        meetingTimeID,
        locationID,
        students
      );

      // Check the validity of the data
      if (
        response.data === undefined ||
        response.data == null ||
        response.data === ""
      ) {
        this.returnObject.error = "Unable to submit period attendance records.";
        return this.returnObject;
      }

      this.responseData = response.data;

      this.returnObject.JWTIsValid = checkJWTIsValid(this.responseData); // Determine if our JWT Session token is still valid
      // Determine if user was granted permission from the server for this action
      this.returnObject.hasPermission = checkUserPermissionResponse(
        this.responseData
      );
      // If the JWT is no longer valid or if we were denied permission, we return immediately
      if (!this.returnObject.JWTIsValid || !this.returnObject.hasPermission) {
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

export default AttendanceService;
