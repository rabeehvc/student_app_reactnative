import { addDisciplineEntry } from "../wrappers/axiosWrapper";
import { checkJWTIsValid } from "../utilities/authUtilities";
import { checkUserPermissionResponse } from "../utilities/permissionsUtilities";

class AddDisciplineEntryService {
  constructor() {
    this.returnObject = {};
    this.responseData = {};
  }

  async performAddDisciplineEntryRequest(
    sessionToken,
    studentID,
    incident,
    incidentDate,
    incidentTime,
    location,
    reportedBy,
    notes
  ) {
    try {
      // Make request via wrapper
      const response = await addDisciplineEntry(
        sessionToken,
        studentID,
        incident,
        incidentDate,
        incidentTime,
        location,
        reportedBy,
        notes
      );

      // Check the validity of the data
      if (
        response.data === undefined ||
        response.data == null ||
        response.data === ""
      ) {
        this.returnObject.error = "Unable to save discipline entry data.";
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

      this.returnObject.message = this.responseData.message;
      this.returnObject.status = this.responseData.status;
      return this.returnObject;
    } catch (responseError) {
      this.returnObject.error = responseError;
      return this.returnObject;
    }
  }
}

export default AddDisciplineEntryService;
