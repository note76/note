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
  const [ selectedNoteTitle, setSelectedNoteTitle ] = useState('')
  const [ updating, setUpdating ] = useState(false)
  const [search, setSearch] = useState()
  const [searching, setSearching] = useState(false)
  const [showModal, setShowModal] = useState(false)
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
        if(rule.test(note.title)){
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
    return () => {
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
        <link href="https://css.gg/css?=|add|arrow-left|pen|trash-empty" rel="stylesheet"/>
      </Head>

      <header className={styles.header}>
        <div className={styles.searchFolder}>
          <input type='text' placeholder='Search' onChange={searchFolder}></input>
        </div>
        <div className={styles.create} onClick={()=> {
          if (!user){
            Router.push('/')
          }
          setShowModal(true)
          }}>
          <i class="gg-add"></i>
          <p>New note</p>
        </div>
        <div className={styles.account}>
          <p>{user?.name}</p>
          <button onClick={() => {
            signout() 
            uid='null'}}>Sign out</button>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.notes}>      
          {searching ? search?.map(note => {
            return (
              <button className={styles.cards} key={note.key}>
                <div className={styles.folderColor}>
                  <div className={styles.pink}>t</div>
                </div>
                <p className={styles.noteTitle} onClick={()=> {
                  selectNote(note.note)
                  setSelectedNoteTitle(note.title)
                  setShowModal(false)
                  setUpdating(false)
                }}>{note.title}</p>
                <div className={styles.options}>
                  <button onClick={() => {
                    edit(note)
                    setShowModal(true)}}>
                    <i class="gg-pen"></i>
                  </button>
                  <button onClick={() => deleteNote(note.key)}>
                    <i class="gg-trash-empty"></i>
                  </button>
                </div>
              </button>
            )
          }) : notes?.map(note => {
            return (
              <button className={styles.cards} key={note.key}>
                <div className={styles.folderColor}>
                  <div className={note.folder}></div>
                </div>
                <p className={styles.noteTitle} onClick={()=> {
                  selectNote(note.note)
                  setSelectedNoteTitle(note.title)
                  setShowModal(false)
                  setUpdating(false)
                }}>{note.title}</p>
                <div className={styles.options}>
                  <button onClick={() => {
                    edit(note)
                    setShowModal(true)}}>
                    <i class="gg-pen"></i>
                  </button>
                  <button onClick={() => deleteNote(note.key)}>
                    <i class="gg-trash-empty"></i>
                  </button>
                </div>
              </button>
            )
          })}
        </div>
        <div className={styles.note}>
          {
            showModal ? (
              <div>
                <div className={styles.noteOptions}>
                  <div>
                    <button className={styles.closeModal} onClick={()=> {
                      setShowModal(false)
                      setUpdating(false)}}>
                        <i class="gg-arrow-left"></i>
                    </button>
                  </div>
                  <div className={styles.saveOptions}>
                    <div className={styles.selectOptions}>
                      <select className={styles.folderInput} type='text' placeholder='Folder' value={folder} onChange={event => setFolder(event.target.value)}>
                        <option selected value={"none"}>Colors</option>
                        <option className={styles.color1} value={"color1"}>Red</option>
                        <option className={styles.color2} value={"color2"}>Blue</option>
                        <option className={styles.color3} value={"color3"}>Black</option>
                        <option className={styles.color4} value={"color4"}>Orange</option>
                        <option className={styles.color5} value={"color5"}>Green</option>
                      </select>
                    </div>
                    {updating ? <button type='button' className={styles.saveUpdate} onClick={update}>Update</button> : <button type='button' className={styles.saveUpdate} onClick={save}>Save</button>}
                  </div>
                </div>
                <form className={styles.form}>
                  <input maxLength={13} className={styles.titleInput} type='text' placeholder='Title' value={title} onChange={event => setTitle(event.target.value)}></input>
                  <textarea className={styles.noteInput} type='text' placeholder='Note' value={note} onChange={event => setNote(event.target.value)}></textarea>
                </form>
              </div>
            ) : (
              <div>
                <h1>{selectedNoteTitle}</h1>
                <p>{selectedNote}</p>
              </div>
            )
          }
        </div>
      </main>
    </div>
  )
}