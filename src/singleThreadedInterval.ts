// Copyright © 2025 JalapenoLabs

export async function singleThreadedInterval(
  callback: () => Promise<void>,
  intervalMs: number,
  doInitialRun: boolean = true,
) {
  let isBusy: boolean = false
  async function doCycle() {
    if (isBusy) {
      return
    }

    isBusy = true
    try {
      await callback()
    }
    catch (error) {
      console.error('Uncaught error during interval:', error)
    }
    finally {
      isBusy = false
    }
  }

  if (doInitialRun) {
    doCycle()
  }

  const interval = setInterval(doCycle, intervalMs)

  return interval
}
