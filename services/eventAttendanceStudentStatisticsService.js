// import DistrictData from '../models/districtData';

class EventAttendanceStudentStatisticsService {
  constructor() {
    this.studentData = {};
    this.statistics = this.getEmptyStatisticsObject();
    this.returnObject = {
      status: "incomplete",
      userMessage: "Calculation Incomplete",
      result: false,
      debug: {}
    };
  }
  getEmptyStudent(studentID) {
    return {
      "eventID": "",
      "firstName": "",
      "lastName": "",
      "studentID": studentID,
      "checkpoints": [],
      "hasFinalRelease": false
    }
  }

  fromEventDetail(eventDetail) {
    // eventDetail.studentCheckPointArray needs to be munged into eventDetail.studentArray ;
    var students = eventDetail.studentArray;
    for ( studentIdx in eventDetail.studentArray ) {
      var student = eventDetail.studentArray[studentIdx];
      if ( !this.studentData.hasOwnProperty(student.studentID)  ){
        this.studentData[student.studentID] = student;
        this.studentData[student.studentID]["checkpoints"] =[];
        this.studentData[student.studentID]["hasFinalRelease"] = false;
      }
    }
    for (checkpointIdx in eventDetail.studentCheckPointArray) {
      var checkpoint = eventDetail.studentCheckPointArray[checkpointIdx];
      if ( !this.studentData.hasOwnProperty(checkpoint.studentID)  ){
        this.studentData[checkpoint.studentID] = this.getEmptyStudent(student.studentID);
      }
      this.studentData[checkpoint.studentID]["checkpoints"].push(checkpoint);
      if ( checkpoint.isFinalRelease == 1) {
        this.studentData[checkpoint.studentID]["hasFinalRelease"] = true;
      }
    }
    this.recalculateStatistics();
    return this;
  }

  getEmptyStatisticsObject() {
    return {
      totalStudents: 0,
      withFinalRelease: 0,
      withCheckpoint: 0,
      withoutCheckpoint: 0,
    };
  }

  recalculateStatistics() {
    this.statistics = this.getEmptyStatisticsObject();
    for ( studentID in this.studentData) {
      var student = this.studentData[studentID];
      this.statistics["totalStudents"] += 1;      
      if (student.hasFinalRelease == true) {
        this.statistics["withFinalRelease"] += 1;
      }
      if (student.checkpoints.length == 0) {
        this.statistics["withoutCheckpoint"] += 1;
      } else {
        this.statistics["withCheckpoint"] += 1;
      }
    }
  }

  doesStudentHaveFinalCheckpoint(studentID) {
    this.returnObject["result"]=false;
    this.returnObject["status"]="success";
    this.returnObject["userMessage"]="Student does NOT have a final checkpoint";
    if ( this.studentData.hasOwnProperty(studentID) && this.studentData[studentID]["hasFinalRelease"] == true ) {
      this.returnObject["result"]=true;
      this.returnObject["status"]="success";
      this.returnObject["userMessage"]="Student has a final checkpoint and is not eligbile for new checkpoints.";
    }
    return this.returnObject;
  }

  canStudentHaveACheckpointAdded(studentID) {
    if ( this.doesStudentHaveFinalCheckpoint(studentID)["result"] == true ) {
      this.returnObject["result"]=false;
      this.returnObject["status"]="success";
      this.returnObject["userMessage"]="Student already has a final checkpoint";
    } else {
      this.returnObject["result"]=true;
      this.returnObject["status"]="success";
      this.returnObject["userMessage"]="Checkpoint Possible";
    }
    return this.returnObject;
  }
}

export default EventAttendanceStudentStatisticsService;
