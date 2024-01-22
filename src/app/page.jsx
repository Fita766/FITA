import Search from "@/components/search";
import { SearchFunction } from "@/js/recupSearch";
import styles from "./page.module.css";

export default function Home({ searchParams: { url } }) {

  if (url) {
    SearchFunction(SearchFunction)
  }

  return (
    <main className={styles.main}>
      <Search IsURL={!!url}/>
    </main>
  );
}
