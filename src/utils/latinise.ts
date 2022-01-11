export const Latinise = {
  latin_map: {
    τ: 't',
    Τ: 'T',
  },
}

export const latinise = (input: string) => {
  return input.replace(/[^A-Za-z0-9[\] ]/g, (x) => Latinise.latin_map[x] || x)
}

export const convertNumbers2English = (string: string) =>
  string
    // @ts-ignore
    .replace(/[\u0660-\u0669]/g, (c) => c.charCodeAt(0) - 0x0660)
    // @ts-ignore
    .replace(/[\u06f0-\u06f9]/g, (c) => c.charCodeAt(0) - 0x06f0)
