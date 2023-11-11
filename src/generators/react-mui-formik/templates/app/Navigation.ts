import ProjectConfiguration from '../../../../system/ProjectConfiguration'
import { RMFRoute } from '../../RouteGenerator'

export function NavigationTemplate(name: string, project: ProjectConfiguration, routes: RMFRoute[]) {
  const pages = routes
    .map(
      (x) => `
{
  name: '${x.pageName}',
  path: '${x.path}'
}
    `
    )
    .join(',\n')

  return `
import { Navigation as NavigationComponent } from '@vormadal/react-mui'

const pages = [
${pages}
]

interface Props {
  children: React.ReactNode
}
function ${name}({children}: Props) {
    return (
      <NavigationComponent
        pages={pages}
        drawer
        title="${project.name}"
      >
        {children}
      </NavigationComponent>
    )
}

export default ${name}
    `
}
