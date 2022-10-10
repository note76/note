import firebase from '../lib/firebase'
import useAuth from '../hooks/useAuth'
import { useEffect, useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

export default function Note() {
  const { user, signout } = useAuth()
  const [ paste, setPaste ] = useState('')
  const [ title, setTitle ] = useState('')
  const [ note, setNote ] = useState('')
  const [ notes, setNotes ] = useState()
  const [ key, setkey] = useState('')
  const [ updating, setUpdating ] = useState(false)

  function save(){
    const pasteTitleNote = {
      paste,
      title,
      note
    }
    firebase.database().ref(use.email).push(pasteTitleNote)
    setPaste('')
    setTitle('')
    setNote('')
  }
  function edit(note){
    setUpdating(true)
    setkey(note.key)
    setPaste(note.paste)
    setTitle(note.title)
    setNote(note.note)
  }
  function update(){
    const pasteTitleNote = {
      'paste': paste,
      'title': title,
      'note': note
    }
    firebase.database().ref(user?.email).child(key).update(pasteTitleNote)
    setPaste('')
    setTitle('')
    setNote('')
    setUpdating(false)
  }
  function deleteNote(ref){
    firebase.database().ref(user?.email+ref).remove()
  }
  useEffect(() => {
    firebase.database().ref(user?.email).on('value', result => {
      const resultpasteTitleNote = Object.entries(result.val() ?? {}).map(([key, value]) => {
        return {
          'key': key,
          'paste': value.paste,
          'title': value.title,
          'note': value.note
        }
      })


      setNotes(resultpasteTitleNote)
    })
  }, [])

  return (
    <div className={styles.container}>
      <Head>
        <title>Note</title>
        <meta name="description" content="Digital notebook" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.ribbon}>
          Economize na compra do Macbook Air Pro de 13 polegadas na Apple Store Educational*.
          <a> Comprar &gt;</a>
        </div>
        <p className={styles.free}>Free</p>
        <h1 className={styles.title}>{user?.email}</h1>
        <h2 className={styles.subtitle}>Seu bloco de anotacoes digital</h2>
        <p className={styles.description}>Um bloco de anotacoes multifucional para todas as suas necessidades.</p>
        <div className={styles.buttons}>
          <button onClick={() => signout()}>Comprar</button>
          <a>Saiba mais &gt;</a>
        </div>
        <Image src="/RE2lwga.png" alt="Vercel Logo" width={630} height={380} />
        <form>
          <input type="text" placeholder="Paste" value={paste} onChange={event => setPaste(event.target.value)}></input>
          <input type="text" placeholder="Title" value={title} onChange={event => setTitle(event.target.value)}></input>
          <input type="text" placeholder="Note" value={note} onChange={event => setNote(event.target.value)}></input>
          {updating ? <button type="button" onClick={update}>Update</button> : <button type="button" onClick={save}>Save</button>}
          
        </form>
        <div>
          <input type="text" placeholder="Search"></input>
          {notes?.map(note => {
            return (
              <div key={note.key}>
                <button onClick={() => edit(note)}>Edit</button>
                <button onClick={() => deleteNote(note.key)}>Delete</button>
                <h2>{note.paste}</h2>
                <h1>{note.title}</h1>
                <p>{note.note}</p>
              </div>
            )
          })}
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
        </a>
      </footer>
    </div>
  )
}