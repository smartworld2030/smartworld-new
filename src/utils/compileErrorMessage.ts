const compileErrorMessage = (err: string | Error): [string, string] => {
  const compiled = err instanceof Error ? err?.message.split(':') : 'Unknown, Message Not Found!'

  const lastItem = compiled.length - 1
  const name = compiled[lastItem].split(',')[0]
  const message = compiled[lastItem].split(',')[1]

  return [name, message]
}

export default compileErrorMessage
