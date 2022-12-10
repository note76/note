import useAuth from '../hooks/useAuth'
import Head from 'next/head'
import styles from '../styles/Index.module.css'
import Link from 'next/link'

export default function Index() {
  const { login } = useAuth()

  return (
    <div className={styles.container}>
      <Head>
        <title>Note</title>
        <meta name='description' content='Digital notebook'/>
        <meta name = 'viewport' content = 'width=device-width, initial-scale=1.0'></meta>
        <link rel='icon' href='/favicon.ico'/>
      </Head>

      <main className={styles.main}>
        <div className={styles.ribbon}>
          One cross-functional notebook for all your notetaking needs.
          <Link href='/about'> Learn more &gt;</Link>
        </div>
        <p className={styles.free}>Free</p>
        <h1 className={styles.title}>Note</h1>
        <h2 className={styles.subtitle}>Your digital notebook</h2>
        <div className={styles.buttons}>
          <button onClick={() => login()}>Sign in</button>
          <div>
            <Link href='/about'>Learn more &gt;</Link>
          </div>
        </div>     
      </main>

      <footer className={styles.footer}>
        <p>Note</p>
      </footer>
    </div>
  )
}