import { PostSet } from "@/app/api/getSet/route.js"
import Boxed from "./box.js"
import "../../../metaball-wrapper.js"
import Metaball from "../../../metaball-wrapper.js"
import Link from "next/link.js"
import styles from "./page.module.css"
import { collection, getDocs, getCountFromServer } from "firebase/firestore"
import {firestore} from "../../../firebase"

export async function generateStaticParams(){
    // const res = await import("./../../api/getSets/route.js")
    // const sets = await (await res.GET()).json()
    // const re = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/getSets`)
    // const sets = await re.json()
    let sets = []
    // const tag = req.nextUrl.searchParams.get("tag")
    // revalidateTag(tag)

    const querySnapshot = await getDocs(collection(firestore, "Glossaries"))
    // const count = await getCountFromServer(collection(firestore, "Glossaries"))
    
    querySnapshot.forEach(doc => {
        sets.push({id: doc.id, date: doc.data()["date"].toDate()})
    })
    // Object.assign(sets, {revalidated: true, now: Date.now()})
    return sets.map(set1 => ({
        set: set1["id"]
    }))
}

export default async function glossary({params}){
    console.log("params[")
    const set = decodeURI(params["set"])
    const res = await PostSet(set)
    const words = res["words"]
    return <>
        <Metaball
            numMetaballs={10}
            minRadius={15}
            maxRadius={30}
            speed={3}
            backgroundColorFrom="#834d9b"
            backgroundColorTo="#d04ed6"
            colorFrom="#4DA0B0"
            colorTo="#D39D38"
            useDevicePixelRatio={true}
            className="metaballs"
          />
        <main className={styles.main}>
            <h1>{set}</h1>
            <Boxed wordList={words} toLanguage={res["toLanguage"]}/>
            <Link className={styles.back} href={"/sets"}>Back to sets</Link>
        </main>
    </>
}