import { createContext, useContext, useState } from 'react'
import { CodeGenerator } from '../configuration/CodeGenerator'

const GeneratorContext = createContext<[CodeGenerator | undefined, (generator: CodeGenerator) => void]>([
  undefined,
  () => {
    throw new Error('set generator not specified')
  }
])

interface Props {
  children: React.ReactNode
}

export function useGenerator() {
  return useContext(GeneratorContext)
}

export function GeneratorProvider({ children }: Props) {
  const [generator, setGenerator] = useState<CodeGenerator>()

  return <GeneratorContext.Provider value={[generator, setGenerator]}>{children}</GeneratorContext.Provider>
}
