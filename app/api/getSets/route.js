
import {firestore} from "../../../firebase"
import { collection, getDocs, getCountFromServer } from "firebase/firestore"
import { revalidateTag } from "next/cache"
import { NextResponse } from "next/server"
// import { NextRequest } from "next/server"

export async function GET(req){
    let out = []
    // const tag = req.nextUrl.searchParams.get("tag")
    // revalidateTag(tag)
    
    const querySnapshot = await getDocs(collection(firestore, "Glossaries"))
    const count = await getCountFromServer(collection(firestore, "Glossaries"))
    console.log("querySnapshot.length")
    console.log(count.data().count)
    querySnapshot.forEach(doc => {
        out.push({id: doc.id, date: doc.data()["date"].toDate()})
    })
    // Object.assign(out, {revalidated: true, now: Date.now()})
    return NextResponse.json(out)
}   