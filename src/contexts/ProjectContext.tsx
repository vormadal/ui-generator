import { createContext, useContext, useState } from 'react'
import ProjectConfiguration from '../system/ProjectConfiguration'

const ProjectContext = createContext<
  [ProjectConfiguration | null, React.Dispatch<React.SetStateAction<ProjectConfiguration>>]
>([
  null,
  () => {
    throw new Error('schema context not configured')
  }
])

interface Props {
  children: React.ReactNode
}

export function useProject() {
  return useContext(ProjectContext)
}

export function ProjectProvider({ children }: Props) {
  const [project, setProject] = useState<ProjectConfiguration>()

  return <ProjectContext.Provider value={[project || null, setProject]}>{children}</ProjectContext.Provider>
}
