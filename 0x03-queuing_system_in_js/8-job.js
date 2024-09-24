function createPushNotificationsJobs(jobs, queue) {
  if (!Array.isArray(jobs)) {
    throw new Error("Jobs is not an array");
  }
  jobs.forEach((job) => {
    const new_job = queue.create("push_notification_code_3", job);
    new_job
      .on("complete", () => {
        console.log(`Notification job ${new_job.id} completed`);
      })
      .on("failed", (err) => {
        console.log(`Notification job ${new_job.id} failed: ${err}`);
      })
      .on("progress", (progress, data) => {
        console.log(`Notification job ${new_job.id} ${progress}% complete`);
      })
      .save((err) => {
        if (!err) {
          console.log(`Notification job created: ${new_job.id}`);
        }
      });
  });
}

module.exports = createPushNotificationsJobs;
