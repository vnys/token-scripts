const pipe =
  (...functions) =>
  (value) =>
    functions.reduce(
      (currentValue, currentFunction) => currentFunction(currentValue),
      value,
    )

const pipeDebug =
  (...functions) =>
  (value) => {
    debugger

    return functions.reduce((currentValue, currentFunction) => {
      debugger

      return currentFunction(currentValue)
    }, value)
  }

export { pipe, pipeDebug }
