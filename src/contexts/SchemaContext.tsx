import { createContext, useContext, useState } from 'react'
import OpenApiSchema from '../openApi/OpenApiSchema'

const SchemaContext = createContext<[OpenApiSchema, (url: string) => Promise<void>]>([
  new OpenApiSchema(),
  async () => {
    throw new Error('schema context not configured')
  }
])

interface Props {
  children: React.ReactNode
}

export function useSchema() {
  return useContext(SchemaContext)
}

export function SchemaProvider({ children }: Props) {
  const [schema, setSchema] = useState<OpenApiSchema>()

  const handleLoad = async (url: string) => {
    const newSchema = new OpenApiSchema()
    await newSchema.load(url)
    setSchema(newSchema)
  }
  return <SchemaContext.Provider value={[schema || new OpenApiSchema(), handleLoad]}>{children}</SchemaContext.Provider>
}
