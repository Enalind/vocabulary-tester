"use client"
import Link from 'next/link'
import styles from './page.module.css'
import Metaballs from "../react-metaballs-js/dist/index"


export default function Home() {
  return (
    <main>
      <div className={styles.master}>
        <div className={styles.upper}>
          <h1>The Vocabulary Software of the Future</h1>
          <h2>Powered by AI and the Cloud</h2>
          <a href="#content" className={styles.scroll}>Get Started</a>
        </div>
        <Metaballs
            numMetaballs={10}
            minRadius={15}
            maxRadius={30}
            speed={3}
            colorFrom="#FF66B3"
            colorTo="#60EFFF"
            backgroundColorFrom="#C53A94"
            backgroundColorTo="#0965C0"
            useDevicePixelRatio={true}
            className={styles.balls}
          />
        <div className={styles.main} id={"content"}>
          <Link className={styles.link} href="/create">Create<br/>New Cards</Link>
          <Link className={styles.link} href="/sets">Train</Link>
        </div>
      </div>
      
    </main>
  )
}
