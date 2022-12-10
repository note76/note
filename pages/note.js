import firebase from '../lib/firebase'
import useAuth from '../hooks/useAuth'
import { useEffect, useState } from 'react'
import Head from 'next/head'
import styles from '../styles/Note.module.css'
import Router from 'next/router'

export default function Note() {
  const { user, signout } = useAuth()
  const [ folder, setFolder ] = useState('')
  const [ title, setTitle ] = useState('')
  const [ note, setNote ] = useState('')
  const [ notes, setNotes ] = useState()
  const [ key, setkey] = useState('')
  const [ selectedNote, setSelectedNote ] = useState('')
  const [ updating, setUpdating ] = useState(false)
  const [search, setSearch] = useState()
  const [searching, setSearching] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [ selectedFolder, setSelectedFolder] = useState('')
  const [ selectFolder, setSelectFolder] = useState('')
  var uid = user?.uid

  if(uid != null){
    uid.replace(/[.,\/#!$%\^&\*;:{}@=\-_`~()]/g,'')
  } else{
    uid='null'
  }
  
  function save(){
    const folderTitleNote = {
      folder,
      title,
      note
    }

    firebase.database().ref(uid).push(folderTitleNote)
    setFolder('')
    setTitle('')
    setNote('')
  }

  function edit(note){
    setUpdating(true)
    setkey(note.key)
    setFolder(note.folder)
    setTitle(note.title)
    setNote(note.note)
    setShowModal(true)
  }

  function update(){
    const folderTitleNote = {
      'folder': folder,
      'title': title,
      'note': note
    }

    firebase.database().ref(uid).child(key).update(folderTitleNote)
    setFolder('')
    setTitle('')
    setNote('')
    setUpdating(false)
  }

  function deleteNote(ref){
    firebase.database().ref(uid+'/'+ref).remove()
  }

  function searchFolder(event){
    if(event.target.value.length > 0) {
      setSearching(true)
      const searchResult = new Array

      notes?.map(note => {
        const rule = new RegExp(event.target.value, 'gi')
        if(rule.test(note.folder)){
          searchResult.push(note)
        }
      })

      setSearch(searchResult)
    } else{
      setSearching(false)
    }
  }

  function folders(){
    if(selectedFolder.length > 0) {
      setSelectFolder(true)
      const searchResult = new Array

      notes?.map(note => {
        if(selectedFolder == note.folder){
          searchResult.push(note)
        } 
      })
    
      setSearch(searchResult)
    } else{
      setSearching(false)
    }
  }

  function selectNote(note){
    setSelectedNote(note)
  }

  useEffect(() => {
    const timer = setTimeout(()=> {
      if (!user){
        Router.push('/')
      }

      firebase.database().ref(uid).on('value', result => {
        const resultFolderTitleNote = Object.entries(result.val() ?? {}).map(([key, value]) => {
          return {
            'key': key,
            'folder': value.folder,
            'title': value.title,
            'note': value.note
          }
        })

        setNotes(resultFolderTitleNote)
      })
    })
    return ()=>{
      clearTimeout(timer)
    }
  })

  return (
    <div className={styles.container}>
      <Head>
        <title>Note</title>
        <meta name='description' content='Digital notebook'/>
        <meta name = 'viewport' content = 'width=device-width, initial-scale=1.0'></meta>
        <link rel='icon' href='/favicon.ico'/>
      </Head>

      <header className={styles.header}>
        <div className={styles.searchFolder}>
          <input type='text' placeholder='Search' onChange={searchFolder}></input>
        </div> 
        <div className={styles.selectedFolder}>
          <p>{selectedFolder}</p>
        </div>
        <div className={styles.account}>
          <button type='button' onClick={()=> setShowModal(true)}>+</button>
          {
            showModal ? (
              <div className={styles.formContainer}>
                <div className={styles.form}>
                  <form>
                    <button onClick={()=> {
                      setShowModal(false)
                      setUpdating(false)}}>X</button>
                    <input type='text' placeholder='Folder' value={folder} onChange={event => setFolder(event.target.value)}></input>
                    <input type='text' placeholder='Title' value={title} onChange={event => setTitle(event.target.value)}></input>
                    <input type='text' placeholder='Note' value={note} onChange={event => setNote(event.target.value)}></input>
                    {updating ? <button type='button' onClick={update}>Update</button> : <button type='button' onClick={save}>Save</button>}
                  </form>
                </div>
              </div>
            ) : null
          }
          <a>{user?.name}</a>
          <button onClick={() => {
            signout() 
            uid='null'}}>signout</button>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.folders}>
          {searching ? search?.map(note => {
            return (
              <div className={styles.cards} key={note.key} onClick={()=>{
                setSelectedFolder(note.folder)
                folders()
              }}>
                <p className={styles.noteFolder}>{note.folder}</p>
                <div>
                  <button className={styles.options} onClick={() => edit(note)}>✏️</button>
                  <button className={styles.options} onClick={() => deleteNote(note.key)}>🗑️</button>
                </div>  
              </div>
            )
          }) : notes?.map(note => {
            return (
              <div className={styles.cards} key={note.key} onClick={()=>{
                setSelectedFolder(note.folder)
                folders()
              }}>
                <p className={styles.noteFolder}>{note.folder}</p>
                <div>
                  <button className={styles.options} onClick={() => edit(note)}>✏️</button>
                  <button className={styles.options} onClick={() => deleteNote(note.key)}>🗑️</button>
                </div>  
              </div>
            )
          })}
        </div>

        <div className={styles.notes}>      
          {selectFolder ? search?.map(note => {
            return (
              <div className={styles.cards} key={note.key}>
                <p className={styles.noteFolder} onClick={() => selectNote(note.note)}>{note.title}</p>
                <div>
                  <button className={styles.options} onClick={() => edit(note)}>✏️</button>
                  <button className={styles.options} onClick={() => deleteNote(note.key)}>🗑️</button>
                </div>
              </div>
            )
          }) : notes?.map(note => {
            return (
              <div className={styles.cards} key={note.key}>
                <p className={styles.noteFolder} onClick={() => selectNote(note.note)}>{note.title}</p>
                <div>
                  <button className={styles.options} onClick={() => edit(note)}>✏️</button>
                  <button className={styles.options} onClick={() => deleteNote(note.key)}>🗑️</button>
                </div>
              </div>
            )
          })}
        </div>
        <div className={styles.note}>
          <p>{selectedNote}</p>
        </div>
      </main>
    </div>
  )
}