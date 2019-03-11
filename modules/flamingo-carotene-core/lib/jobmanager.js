
class Jobmanager {

  constructor () {
    this.core = require('./core')
    this.cliTools = this.core.getCliTools()

    this.jobs = {}

    this.useProgress = false
    for (const option of this.cliTools.getOptions()) {
      if (option === '--progress') {
        this.useProgress = true
      }
    }

    if (this.useProgress) {
      const _cliProgress = require('cli-progress');
      this.progressBar = new _cliProgress.Bar({
        format: 'progress [{bar}] | Jobs:  {value}/{total} {openJobList}',
        barCompleteChar: '#',
        barIncompleteChar: '.',
        stopOnComplete: true,
        clearOnComplete: true,
        fps: 5,
        stream: process.stdout,
        barsize: 65,
        position: 'center'
      });

      this.cliTools.startBuffer();
      this.progressBar.start(1, 0);
    }
  }

  addJob(id, label) {
    this.jobs[id] = {label:label, finished: false};

    if (this.useProgress) {
      this.progressBar.setTotal(this.getTotalJobCount())
      this.progressBar.update(this.getFinishedJobCount(), {'openJobList': this.getOpenJobs().join(', ')});
    }
  }

  finishJob(id){
    this.jobs[id].finished = true;
    if (this.useProgress) {
      this.progressBar.update(this.getFinishedJobCount(), {'openJobList': this.getOpenJobs().join(', ')});
      if (this.getOpenJobs().length < 1) {
        const buffer = this.cliTools.getBuffer();
        process.stdout.write(buffer);
      }
    }
  }

  getTotalJobCount () {
    let count = 0;
    for (const jobId in this.jobs) {
      count++
    }
    return count
  }

  getFinishedJobCount () {
    let count = 0;
    for (const jobId in this.jobs) {
      const job = this.jobs[jobId]
      if (job.finished) {
        count++
      }
    }
    return count

  }

  getOpenJobs() {
    const openJobs = []
    for (const jobId in this.jobs) {
      const job = this.jobs[jobId]
      if (!job.finished) {
        openJobs.push(job.label)
      }
    }

    return openJobs;
  }
}

module.exports = new Jobmanager()

