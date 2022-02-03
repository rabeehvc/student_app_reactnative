import {
  retrieveStudentData,
  retrieveStudentCurrentlyScheduledIn,
} from "../wrappers/axiosWrapper";
import StudentData from "../models/studentData";
import { checkJWTIsValid } from "../utilities/authUtilities";

class RetrieveStudentDataService {
  constructor() {
    this.returnObject = {};
    this.responseData = {};
  }

  async performStudentDataRequest(sessionToken, studentID) {
    try {
      // Make request via wrapper
      const response = await retrieveStudentData(sessionToken, studentID);

      // Check the validity of the data
      if (
        response.data === undefined ||
        response.data == null ||
        response.data === ""
      ) {
        this.returnObject.error = "Unable to retrieve student data.";
        return this.returnObject;
      }

      this.responseData = response.data;

      this.returnObject.JWTIsValid = checkJWTIsValid(this.responseData); // Determine if our JWT Session token is still valid
      if (!this.returnObject.JWTIsValid) {
        // If the JWT is no longer valid, we return immediately
        return this.returnObject;
      }

      this.returnObject.status = this.responseData.status;
      this.returnObject.message = this.responseData.message;
      if (this.returnObject.status === "success") {
        this.parseStudentData();
      }
      return this.returnObject;
    } catch (responseError) {
      this.returnObject.error = responseError;
      return this.returnObject;
    }
  }

  async performStudentCurrentlyScheduledInRequest(sessionToken, studentID) {
    try {
      // Make request via wrapper
      const response = await retrieveStudentCurrentlyScheduledIn(
        sessionToken,
        studentID.trim()
      );

      // Check the validity of the data
      if (
        response.data === undefined ||
        response.data == null ||
        response.data === ""
      ) {
        this.returnObject.error = "Unable to retrieve student data.";
        return this.returnObject;
      }

      this.responseData = response.data;

      this.returnObject.JWTIsValid = checkJWTIsValid(this.responseData, false); // Determine if our JWT Session token is still valid
      if (!this.returnObject.JWTIsValid) {
        // If the JWT is no longer valid, we return immediately
        return this.returnObject;
      }

      this.returnObject.status = this.responseData.status;
      this.returnObject.message = this.responseData.message;
      this.returnObject.scheduledIn = this.responseData.scheduledIn;
      this.returnObject.attendanceTransactionColor =
        this.responseData.attendancetransactioncolor;
      this.returnObject.attendanceTransactionCodeDescription =
        this.responseData.attendancetransactioncodedescription;
      return this.returnObject;
    } catch (responseError) {
      this.returnObject.error = responseError;
      return this.returnObject;
    }
  }

  parseStudentData() {
    try {
      const studentData = new StudentData();
      studentData.firstName = this.responseData.student.firstname
        .toString()
        .trim();
      studentData.lastName = this.responseData.student.lastname
        .toString()
        .trim();
      studentData.studentID = this.responseData.student.studentid;
      studentData.locationID = this.responseData.student.locationid;
      studentData.locationDescription =
        this.responseData.student.locationdescription;
      studentData.grade = this.responseData.student.grade;
      studentData.homeroom = this.responseData.student.homeroom;
      studentData.studentPhoto = this.responseData.student.studentphoto;
      this.returnObject.studentData = studentData;
    } catch {
      this.returnObject.error = "Unable to Build Student Data";
    }
  }
}

export default RetrieveStudentDataService;
