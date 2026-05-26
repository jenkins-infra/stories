import React from 'react'
import { useLoaderData } from 'react-router-dom'

export default function UserStory() {
  const data = useLoaderData()

  return (
    <>
    <jio-navbar />
    <main>
     <center><h1>{data.title}</h1>
      <p>
        Authored by {data.authored_by}
      </p>
      </center> 
    </main>
    <jio-footer />
    </>
  )
}