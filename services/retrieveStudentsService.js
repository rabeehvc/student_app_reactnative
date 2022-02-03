import {
  retrieveStudents,
  retrieveStudentsForCourseSection,
  retrieveStudentsForHomeroom,
} from "../wrappers/axiosWrapper";
import { checkJWTIsValid } from "../utilities/authUtilities";

class RetrieveStudentsService {
  constructor() {
    this.returnObject = {};
    this.responseData = {};
  }

  async performStudentSearchRequest(
    sessionToken,
    studentID,
    firstName,
    lastName,
    grade,
    locationID
  ) {
    try {
      // Make request via wrapper
      const response = await retrieveStudents(
        sessionToken,
        studentID.toString().trim(),
        firstName.toString().trim(),
        lastName.toString().trim(),
        grade.toString().trim(),
        locationID.toString().trim()
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

      this.returnObject.JWTIsValid = checkJWTIsValid(this.responseData); // Determine if our JWT Session token is still valid
      if (!this.returnObject.JWTIsValid) {
        // If the JWT is no longer valid, we return immediately
        return this.returnObject;
      }

      this.returnObject.students = this.responseData.students;
      this.returnObject.status = this.responseData.status;
      return this.returnObject;
    } catch (responseError) {
      this.returnObject.error = responseError;
      return this.returnObject;
    }
  }

  async performStudentsForCourseSectionRequest(sessionToken, meetingTimeID) {
    try {
      // Make request via wrapper
      const response = await retrieveStudentsForCourseSection(
        sessionToken,
        meetingTimeID.toString().trim()
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

      this.returnObject.JWTIsValid = checkJWTIsValid(this.responseData); // Determine if our JWT Session token is still valid
      if (!this.returnObject.JWTIsValid) {
        // If the JWT is no longer valid, we return immediately
        return this.returnObject;
      }

      this.returnObject.students = this.responseData.students;
      this.returnObject.status = this.responseData.status;
      return this.returnObject;
    } catch (responseError) {
      this.returnObject.error = responseError;
      return this.returnObject;
    }
  }

  async performStudentsForHomeroomRequest(sessionToken, roomID, locationID) {
    try {
      // Make request via wrapper
      const response = await retrieveStudentsForHomeroom(
        sessionToken,
        roomID.toString().trim(),
        locationID.toString().trim()
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

      this.returnObject.JWTIsValid = checkJWTIsValid(this.responseData); // Determine if our JWT Session token is still valid
      if (!this.returnObject.JWTIsValid) {
        // If the JWT is no longer valid, we return immediately
        return this.returnObject;
      }

      this.returnObject.students = this.responseData.students;
      this.returnObject.status = this.responseData.status;
      return this.returnObject;
    } catch (responseError) {
      this.returnObject.error = responseError;
      return this.returnObject;
    }
  }
}

export default RetrieveStudentsService;
