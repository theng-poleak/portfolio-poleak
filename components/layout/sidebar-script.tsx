const script = `try{if(localStorage.getItem("sidebar-state")==="collapsed")document.documentElement.dataset.sidebar="collapsed"}catch(e){}`;

/** Applies the saved sidebar state before first paint so it never flashes open. */
export function SidebarScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
