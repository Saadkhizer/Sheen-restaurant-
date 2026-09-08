"use client";
import Link from "next/link";
export default function ErrorPage({reset}){return <div className="container section-pad empty-state"><h1>LET’S TRY THAT AGAIN.</h1><p>Something interrupted the page. Your saved bag should still be here.</p><button className="button button-teal" onClick={reset}>Try again</button><Link href="/menu" className="text-link">Back to the menu →</Link></div>;}
