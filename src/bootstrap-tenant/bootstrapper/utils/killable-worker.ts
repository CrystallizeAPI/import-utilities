export class KillableWorker {
  isKilled = false
  isPaused = false
  _workIntervalId: NodeJS.Timeout | null = null
  _workPausedTimeout: NodeJS.Timeout | null = null

  kill() {
    if (this._workIntervalId) {
      clearTimeout(this._workIntervalId)
    }
    if (this._workPausedTimeout) {
      clearTimeout(this._workPausedTimeout)
    }
    this.isKilled = true
  }

  pauseFor(ms: number, cb: () => void) {
    if (this._workPausedTimeout) {
      clearTimeout(this._workPausedTimeout)
    }
    this._workPausedTimeout = setTimeout(() => {
      this.isPaused = false
      cb()
    }, ms)
    this.isPaused = true
  }
}
