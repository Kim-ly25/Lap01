import { RaceResultsService } from "./service/RaceResultsService.js";
import Duration from "./model/Duration.js";
import { RaceResult } from "./model/RaceResult.js";
import fs from "fs";

function runTests() {
  const service = new RaceResultsService();

  // Test loading from file
  const loadSuccess = service.loadFromFile("./Start code/EX-3/data/raceScores.json");
  console.assert(loadSuccess, "Failed to load race results from file");

  // Test querying existing participant and sports
  const swimTime = service.getTimeForParticipant("participant1", "swim");
  console.assert(swimTime !== null, "Swim time should not be null");
  console.assert(swimTime.toString() === "2m 30s", `Unexpected swim time: ${swimTime.toString()}`);

  const runTime = service.getTimeForParticipant("participant1", "run");
  console.assert(runTime !== null, "Run time should not be null");
  console.assert(runTime.toString() === "1m 45s", `Unexpected run time: ${runTime.toString()}`);

  const totalTime = service.getTotalTimeForParticipant("participant1");
  console.assert(totalTime.toString() === "4m 15s", `Unexpected total time: ${totalTime.toString()}`);

  // Test querying non-existent participant and sport
  const noParticipant = service.getTimeForParticipant("nonexistent", "swim");
  console.assert(noParticipant === null, "Expected null for non-existent participant");

  const noSport = service.getTimeForParticipant("participant1", "cycling");
  console.assert(noSport === null, "Expected null for non-existent sport");

  // Test addRaceResult and saveToFile
  const newDuration = Duration.fromMinutesAndSeconds(3, 0);
  const newResult = new RaceResult("participant3", "swim", newDuration);
  service.addRaceResult(newResult);

  const newTotalTime = service.getTotalTimeForParticipant("participant3");
  console.assert(newTotalTime.toString() === "3m 0s", `Unexpected total time for participant3: ${newTotalTime.toString()}`);

  const tempFilePath = "./Start code/EX-3/data/tempRaceResults.json";
  service.saveToFile(tempFilePath);
  const savedData = JSON.parse(fs.readFileSync(tempFilePath, "utf8"));
  console.assert(savedData.some(r => r.participantId === "participant3"), "Saved data should include participant3");

  // Clean up temp file
  fs.unlinkSync(tempFilePath);

  // Test Duration class methods
  const d1 = new Duration(90);
  const d2 = Duration.fromMinutesAndSeconds(1, 30);
  console.assert(d1.toString() === "1m 30s", `Duration toString failed: ${d1.toString()}`);
  console.assert(d2.toString() === "1m 30s", `Duration fromMinutesAndSeconds failed: ${d2.toString()}`);

  const d3 = d1.plus(d2);
  console.assert(d3.toString() === "3m 0s", `Duration plus failed: ${d3.toString()}`);

  const d4 = d3.minus(d1);
  console.assert(d4.toString() === "1m 30s", `Duration minus failed: ${d4.toString()}`);

  // Test RaceResult class
  const rr = new RaceResult("testParticipant", "testSport", d1);
  console.assert(rr.participantId === "testParticipant", "RaceResult participantId mismatch");
  console.assert(rr.sportType === "testSport", "RaceResult sportType mismatch");
  console.assert(rr.duration.toString() === "1m 30s", "RaceResult duration mismatch");

  console.log("All tests passed.");
}

runTests();
