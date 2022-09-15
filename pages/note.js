import useAuth from '../hooks/useAuth'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

export default function Note() {
  const { user } = useAuth()
  console.log(user)

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
          <button onClick={() => signin()}>Comprar</button>
          <a>Saiba mais &gt;</a>
        </div>
        <Image src="/RE2lwga.png" alt="Vercel Logo" width={630} height={380} />
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