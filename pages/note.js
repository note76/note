import firebase from '../lib/firebase'
import useAuth from '../hooks/useAuth'
import { useEffect, useState } from 'react'
import Head from 'next/head'
import styles from '../styles/Note.module.css'

export default function Note() {
  const { user, signout } = useAuth()
  const [ paste, setPaste ] = useState('')
  const [ title, setTitle ] = useState('')
  const [ note, setNote ] = useState('')
  const [ notes, setNotes ] = useState()
  const [ key, setkey] = useState('')
  const [ selected, setSelected ] = useState('')
  const [ updating, setUpdating ] = useState(false)
  const testid = user?.email.slice(0, -10)
  const [busca, setBusca] = useState()
  const [estaBuscando, setEstaBuscando] = useState(false)

  function save(){
    const pasteTitleNote = {
      paste,
      title,
      note
    }
    firebase.database().ref(testid).push(pasteTitleNote)
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
    firebase.database().ref(testid).child(key).update(pasteTitleNote)
    setPaste('')
    setTitle('')
    setNote('')
    setUpdating(false)
  }
  function deleteNote(ref){
    firebase.database().ref(testid+'/'+ref).remove()
  }
  function buscar(event){
    const palavra = event.target.value
    if(palavra.length > 0) {
      setEstaBuscando(true)
    const dados = new Array

    notes?.map(note => {
      const regra = new RegExp(event.target.value, "gi")
      if(regra.test(note.title)){
        dados.push(note)
      }
    })

    setBusca(dados)
    } else{
      setEstaBuscando(false)
    }
    
  }
  function selectNote(x){
    setSelected(x)
  }
  useEffect(() => {
    firebase.database().ref(testid).on('value', result => {
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
      <div>

      <input type="text" placeholder="Search" onChange={buscar}></input>
            {estaBuscando ? 
             busca?.map(note => {
              return (
                <div key={note.key} onClick={() => selectNote(note.note)}>
                  <button onClick={() => edit(note)}>Edit</button>
                  <button onClick={() => deleteNote(note.key)}>Delete</button>
                  <h2>{note.paste}</h2>
                  <h1>{note.title}</h1>
                </div>
              )
            }) : notes?.map(note => {
              return (
                <div key={note.key} onClick={() => selectNote(note.note)}>
                  <button onClick={() => edit(note)}>Edit</button>
                  <button onClick={() => deleteNote(note.key)}>Delete</button>
                  <h2>{note.paste}</h2>
                  <h1>{note.title}</h1>
                </div>
              )
            })
            
            }
        </div>
        <div className={styles.right}>
          <div className={styles.buttons}>
            <button onClick={() => signout()}>signout</button>
          </div>
          <div>
            <form>
              <input type="text" placeholder="Paste" value={paste} onChange={event => setPaste(event.target.value)}></input>
              <input type="text" placeholder="Title" value={title} onChange={event => setTitle(event.target.value)}></input>
              <input type="text" placeholder="Note" value={note} onChange={event => setNote(event.target.value)}></input>
              {updating ? <button type="button" onClick={update}>Update</button> : <button type="button" onClick={save}>Save</button>}
              
            </form>
            <div>
              <p>{selected}</p>
            </div>
          </div>
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