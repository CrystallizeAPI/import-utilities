export class KillableWorker {
  isKilled = false
  _workIntervalId: NodeJS.Timeout | null = null

  kill() {
    if (this._workIntervalId) {
      clearTimeout(this._workIntervalId)
    }
    this.isKilled = true
  }
}
