
export async function POST(word, target, langauge){

    const response = await fetch(`${process.env.NEXT_PUBLIC_NGROK_URL}/glossary?` + new URLSearchParams({
        targetWord: target.toLowerCase(),
        word: word.toLowerCase(),
        la: langauge
    }), 
    {
        method: "POST",
        headers:{"ngrok-skip-browser-warning": "true"}
    }
    )
    return await response.json()
}