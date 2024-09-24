const createPushNotificationsJobs = require("./8-job");
const Kue = require("kue");
const expect = require("chai").expect;

const queue = Kue.createQueue();

describe("Test function createPushNotificationsJobs", () => {
  before(function () {
    queue.testMode.enter();
  });

  afterEach(function () {
    queue.testMode.clear();
  });

  after(function () {
    queue.testMode.exit();
  });

  it("Test that function accept array as argument", () => {
    expect(() => createPushNotificationsJobs("job", queue)).to.throw(
      Error,
      "Jobs is not an array"
    );
  });

  it("Test the jobs in present in the queue", () => {
    const jobs = [
      {
        phoneNumber: "4153518780",
        message: "This is the code 1234 to verify your account",
      },
      {
        phoneNumber: "4153518781",
        message: "This is the code 4562 to verify your account",
      },
    ];

    createPushNotificationsJobs(jobs, queue);

    expect(queue.testMode.jobs.length).to.equal(2);
    expect(queue.testMode.jobs[0].type).to.equal("push_notification_code_3");
    expect(queue.testMode.jobs[0].data).to.eql(jobs[0]);

    expect(queue.testMode.jobs[1].type).to.equal("push_notification_code_3");
    expect(queue.testMode.jobs[1].data).to.eql(jobs[1]);
  });
});
