import { View } from '../../configuration/View'
import GeneratorContent from '../../configuration/GeneratorContent'

export default class RouteGenerator {
  generate(views: View[]): GeneratorContent {
    const viewNames = views.map((x) => x.getOption('name'))
    const imports = [
      `import { Route, HashRouter as Router, Routes, useNavigate, useSearchParams } from 'react-router-dom'`,
      ...viewNames.map((x) => `import { ${x} } from './pages/${x}'`)
    ].join('\n')

    const routes = views
      .map((x) => [
        `<Route`, 
        `   path="${x.getOption('route')}"`, 
        `   element={<${x.getOption('name')} />}`, 
        `/>`
      ].join('\n\t\t\t\t'))
      .join('\n\t\t\t')
    const content = `${imports}


export function AppRoutes() {
  return (
      <Routes>
        ${routes}
      </Routes>
  )
}
    `

    return new GeneratorContent('file', content, `src/AppRoutes.tsx`)
  }
}
