import firebase from '../lib/firebase'
import useAuth from '../hooks/useAuth'
import { useEffect, useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
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
  const testid = "pedrodantas2943"
  const [busca, setBusca] = useState()
  const [estaBuscando, setEstaBuscando] = useState(false)
  const [showModal, setShowModal] = useState(false);
  console.log(user?.email)
  


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
    setShowModal(true)
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
        
      <div className={styles.left}>
      <div className={styles.account}>
          <input type="text" placeholder="Search" onChange={buscar}></input>
        </div>

      
            {estaBuscando ? 
             busca?.map(note => {
              return (
                <div className={styles.leftNotes} key={note.key} onClick={() => selectNote(note.note)}>
                  <h1>{note.title}</h1>
                  <div>
                    <button className={styles.noteOptions} onClick={() => edit(note)}>✏️</button>
                    <button className={styles.noteOptions} onClick={() => deleteNote(note.key)}>🗑️</button>
                    </div>
                  
                </div>
              )
            }) : notes?.map(note => {
              return (
                <div className={styles.leftNotes} key={note.key} onClick={() => selectNote(note.note)}>
                  <h1>{note.title}</h1>
                  <div>
                    <button className={styles.noteOptions} onClick={() => edit(note)}>✏️</button>
                    <button className={styles.noteOptions} onClick={() => deleteNote(note.key)}>🗑️</button>
                    </div>
                </div>
              )
            })
            
            }
        </div>
        <div className={styles.right}>
          <div className={styles.buttons}>
            <a>{user?.name}</a>
            <button onClick={() => signout()}>signout</button>
          </div>
          <div className={styles.containerForm}>
            <div className={styles.open}>
              <button type='button' onClick={()=> setShowModal(true)}>Open modal</button>
            
            </div>
            {
              showModal ? (
                <div className={styles.formPopup}>
                  <form>
                    <button onClick={()=> setShowModal(false)}>X</button>
                    <input type="text" placeholder="Paste" value={paste} onChange={event => setPaste(event.target.value)}></input>
                    <input type="text" placeholder="Title" value={title} onChange={event => setTitle(event.target.value)}></input>
                    <input type="text" placeholder="Note" value={note} onChange={event => setNote(event.target.value)}></input>
                    {updating ? <button type="button" onClick={update}>Update</button> : <button type="button" onClick={save}>Save</button>}
                  </form>
                </div>
              ) : null
            }
          </div>
          <div>
            
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