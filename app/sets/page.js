import styles from "./page.module.css"
import Link from 'next/link'
import dateFormat, {masks} from "dateformat"
import "../../metaball-wrapper"
import dynamic from "next/dynamic"

const Metaballs = dynamic(() => import("../../metaball-wrapper"), {
    ssr: false
})

export default async function viewSets(){
    // const res = await import("./../api/getSets/route.js")
    const re = await fetch("/api/getSets", {next: {tags: ["collection"]}})
    const sets = await re.json()
    console.log(sets)
    // const sets = await res.GET({next: {tags: ["collection"]}})
    return <>
    <Metaballs
                numMetaballs={10}
                minRadius={15}
                maxRadius={30}
                speed={3}
                colorFrom="#f7ff00"
                colorTo="#db36a4"
                backgroundColorFrom="#ff4b1f"
                backgroundColorTo="#1fddff"
                useDevicePixelRatio={true}
                className={styles.balls}
            />
    <div className={styles.wrapper}>
        {sets.map(set => {
            return <>
            <Link href={`/sets/${set["id"]}`} >
                <div className={styles.item}>
                    <p>{set["id"]}</p> 
                    <p>{dateFormat(new Date(set["date"]), "dddd, dd mmmm yyyy")}</p>
                </div>
            </Link>
            
            </>
        })}
        <Link className={styles.back} href={"/#content"}>Back to main page</Link>
    </div>
    </>
}