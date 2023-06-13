import { NextResponse } from 'next/server'
import { revalidatePath} from 'next/cache'
 
export async function GET(request) {
  
  revalidatePath("/sets")
  revalidatePath("/sets/[set]")
  return NextResponse.json({ revalidated: true, now: Date.now() })
}