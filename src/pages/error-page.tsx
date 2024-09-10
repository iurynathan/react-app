import { useRouteError } from 'react-router-dom'

interface ErrorProps {
  statusText?: string
  message?: string
  stack?: string
}

export default function ErrorPage() {
  const error = useRouteError() as ErrorProps
  console.error(error)

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Desculpe. Algo deu errado.</p>
      <p>
        <i>{error.statusText ?? error.message}</i>
      </p>
    </div>
  )
}