import { useEffect } from 'react'
import './App.css'

function App() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('@jenkinsci/jenkins-io-components')
    }
  }, [])
  return (
    <>
      <jio-navbar></jio-navbar>
      <h1>SSG TEST</h1>
      <jio-footer></jio-footer>
    </>
  )
}

export default App