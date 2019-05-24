

// Functions
export type UpdatePoint = (index: number, value: string) => void
export type UpdateColor = () => void

//Objects
export type Location = {
  name: string, 
  marker: string,
  placeholder: string,
  point: null | string
}
