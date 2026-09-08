export default function Icon({name,className="",size=20,...props}){
 const paths={
 arrow:<path d="M4 12h16m-6-6 6 6-6 6"/>,
 bag:<><path d="M5 7h14l1 14H4L5 7Z"/><path d="M8 8V6a4 4 0 0 1 8 0v2"/></>,
 menu:<><path d="M4 7h16M4 12h16M4 17h16"/></>,
 close:<path d="m6 6 12 12M6 18 18 6"/>,
 pin:<><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></>,
 search:<><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></>,
 check:<path d="m5 12 4 4L19 6"/>,
 clock:<><circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/></>,
 chat:<><path d="M21 11a9 9 0 0 1-13 8l-5 2 1-5a9 9 0 1 1 17-5Z"/><path d="M8 10h8M8 14h5"/></>,
 food:<><path d="M4 3v6a3 3 0 0 0 6 0V3M7 3v18M18 3v18M18 3c-5 4-5 9 0 9"/></>,
 phone:<path d="M5 3h4l2 5-3 2a15 15 0 0 0 6 6l2-3 5 2v4c0 2-2 3-4 2C9 20 4 15 3 7c-1-2 0-4 2-4Z"/>,
 spark:<path d="m12 2 2.6 7.4L22 12l-7.4 2.6L12 22l-2.6-7.4L2 12l7.4-2.6L12 2Z"/>,
 plus:<path d="M12 5v14M5 12h14"/>,
 minus:<path d="M5 12h14"/>,
 };
 return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true" {...props}>{paths[name]||paths.arrow}</svg>;
}
