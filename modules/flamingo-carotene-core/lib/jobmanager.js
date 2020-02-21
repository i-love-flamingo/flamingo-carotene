const emoji = require('node-emoji')

class Jobmanager {

  constructor () {
    this.core = require('./core')
    this.cliTools = this.core.getCliTools()
    this.reportCallback = function() {}
    this.callbackOnFinish = function() {}
    this.callbackOnFinishForGroups = {}
    const dictionary = this.core.getDictionary()

    dictionary.addOption('--progress', 'Show progress bar in CLI')
    this.useProgress = this.cliTools.hasOption(['--progress', '--forceProgress'])
    if (this.useProgress) {
      this.cliTools.info(`Showing Progressbar`)
    }

    dictionary.addOption('--forceProgress', 'Show progress bar in CLI without checking for TTY')
    this.forceProgress = this.cliTools.hasOption('--forceProgress')
    if (this.forceProgress) {
      this.cliTools.info(`Forcing Progressbar`)
    }

    if (this.useProgress) {
      this.CliProgress = require('cli-progress');
    }
  }

  reset(group) {
    if (!group) {
      this.jobs = {}
    }
    else {
      const newJobs = {}
      for (const jobId in this.jobs) {
        if (this.jobs[jobId].group !== group) {
          newJobs[jobId] = this.jobs[jobId]
        }
      }
      this.jobs = newJobs
    }

    if (this.useProgress) {
      this.cliTools.startBuffer();


      const output = process.stdout
      if (this.forceProgress) {
        output.isTTY = true
      }

      this.progressBar = new this.CliProgress.Bar({
        format: `${emoji.get('carrot')} Build [{bar}] {value}/{total} {openJobList}`,
        barCompleteChar: '#',
        barIncompleteChar: '.',
        stopOnComplete: true,
        clearOnComplete: true,
        fps: 5,
        stream: output,
        barsize: 65,
        position: 'center'
      });


      this.progressBar.start(1, 0);
      this.progressBar.update(0, {'openJobList': ''});
      this.reportJobChange()
    }
  }

  addJob(id, label, group, info ) {
    if (this.getTotalJobCount() === 0) {
      this.reset()
    }

    this.cliTools.info(`Job start: ${label} ${info ? ' - '+info : ''}`)
    this.jobs[id] = {label:label, group: group, finished: false, subjobs: 0, subProgress: 0, info:info, start:new Date().getTime()};

    if (this.useProgress) {
      this.progressBar.setTotal(this.getTotalJobCount())
    }
    this.updateProgressBar()
  }

  setSubJobTotalCount(id, subjobs) {
    this.jobs[id].subjobs = subjobs

    if (this.useProgress) {
      this.progressBar.setTotal(this.getTotalJobCount())
    }
    this.reportJobChange()
  }

  setSubJobProgress(id, subjobs) {
    if (this.jobs[id]) {
      this.jobs[id].subProgress = subjobs
      const jobData = this.jobs[id]
    }

    // this.cliTools.info(`Job SubProgress: ${id} ${subjobs}`)
    this.updateProgressBar()
  }

  incSubJobProgress(id) {
    this.setSubJobProgress(id, this.jobs[id].subProgress + 1);
  }

  reportFinishJob(id) {
    if (this.jobs[id]) {
      this.jobs[id].finished = true;
      const jobData = this.jobs[id]
      const duration = new Date().getTime() - jobData.start
      this.cliTools.info(`Job finished: ${jobData.label} in ${duration}ms`)
    }
  }

  finishJob(id){
    if (this.jobs[id]) {
      this.jobs[id].finished = true;
      const jobData = this.jobs[id]
      const group = jobData.group;

      if (group) {
        if (this.getOpenJobsByGroup(group).length < 1) {
          if (this.callbackOnFinishForGroups.hasOwnProperty(group)) {
            if (typeof this.callbackOnFinishForGroups[group] === 'function') {
              this.callbackOnFinishForGroups[group]()
            }
          }
        }
      }
    }

    // this.cliTools.info(`Generated ${Object.keys(allFiles).length} AST file(s)\n`)
    this.updateProgressBar()

    if (this.getOpenJobs().length < 1) {
      this.callbackOnFinish()
    }
  }

  updateProgressBar() {
    if (this.useProgress) {
      this.progressBar.update(this.getFinishedJobCount(), {'openJobList': this.getOpenJobs().join(', ')});
      if (this.getOpenJobs().length < 1) {
        this.cliTools.stopBuffer()
        const buffer = this.cliTools.getBuffer();
        process.stdout.write(buffer);
      }
    }
    this.reportJobChange()
  }

  getTotalJobCount () {
    let count = 0;
    for (const jobId in this.jobs) {
      const job = this.jobs[jobId]
      if (job.subjobs > 0) {
        count+= job.subjobs
      }
      else {
        count++
      }
    }
    return count
  }

  getFinishedJobCount () {
    let count = 0;
    for (const jobId in this.jobs) {
      const job = this.jobs[jobId]

      if (job.subjobs > 0) {
        if (job.finished) {
          count+= job.subjobs
        }
        else {
          count+= job.subProgress
        }
      }
      else {
        if (job.finished) {
          count++
        }
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

  getOpenJobsByGroup (group) {
    const openJobs = []
    for (const jobId in this.jobs) {
      const job = this.jobs[jobId]
      if (!job.finished && job.group === group) {
        openJobs.push(job.label)
      }
    }
    return openJobs;
  }

  setCallbackOnFinish(callback, group) {
    if (!group) {
      this.callbackOnFinish = callback
    }
    else {
      this.callbackOnFinishForGroups[group] = callback
    }
  }

  reportJobChange () {
    if (typeof this.reportCallback === 'function') {
      this.reportCallback({
        total: this.getTotalJobCount(),
        finished: this.getFinishedJobCount(),
        openJobs: this.getOpenJobs()
      })
    }
  }

  setReportCallback(callback) {
    this.reportCallback = callback
  }
}

module.exports = new Jobmanager()

